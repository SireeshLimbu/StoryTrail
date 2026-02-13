import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from './AdminLayout';
import { VintageCard, VintageCardContent, VintageCardHeader, VintageCardTitle } from '@/components/VintageCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Pencil, Search, UserCog, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileRow {
  id: string;
  user_id: string;
  display_name: string | null;
  player_name: string | null;
  created_at: string;
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [editProfile, setEditProfile] = useState<ProfileRow | null>(null);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editPlayerName, setEditPlayerName] = useState('');
  const [saving, setSaving] = useState(false);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, display_name, player_name, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as ProfileRow[];
    },
  });

  // Fetch all cities (including unpublished for admin)
  const { data: cities } = useQuery({
    queryKey: ['admin-cities-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('id, name')
        .order('display_order');
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch location counts per city
  const { data: locationCounts } = useQuery({
    queryKey: ['admin-location-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('city_id, id');
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data || []).forEach((loc) => {
        counts[loc.city_id] = (counts[loc.city_id] || 0) + 1;
      });
      return counts;
    },
  });

  // Fetch all user progress
  const { data: allProgress } = useQuery({
    queryKey: ['admin-all-progress'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_progress')
        .select('user_id, city_id, location_id');
      if (error) throw error;
      // Group by user_id -> city_id -> count
      const map: Record<string, Record<string, number>> = {};
      (data || []).forEach((p) => {
        if (!map[p.user_id]) map[p.user_id] = {};
        map[p.user_id][p.city_id] = (map[p.user_id][p.city_id] || 0) + 1;
      });
      return map;
    },
  });

  const filtered = profiles?.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (p.display_name?.toLowerCase().includes(q)) ||
      (p.player_name?.toLowerCase().includes(q)) ||
      p.user_id.toLowerCase().includes(q)
    );
  });

  const openEdit = (profile: ProfileRow) => {
    setEditProfile(profile);
    setEditDisplayName(profile.display_name || '');
    setEditPlayerName(profile.player_name || '');
  };

  const handleSave = async () => {
    if (!editProfile) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: editDisplayName || null,
          player_name: editPlayerName || null,
        })
        .eq('id', editProfile.id);
      if (error) throw error;
      toast.success('Profile updated');
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
      setEditProfile(null);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">View and edit user accounts</p>
        </div>

        <VintageCard>
          <VintageCardHeader>
            <div className="flex items-center justify-between gap-4">
              <VintageCardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                All Users
              </VintageCardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </VintageCardHeader>
          <VintageCardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Real Name</TableHead>
                      <TableHead>Player Name</TableHead>
                      <TableHead className="hidden md:table-cell">Joined</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                    {filtered?.map((profile) => {
                      const isExpanded = expandedUser === profile.user_id;
                      const userProgress = allProgress?.[profile.user_id] || {};
                      return (
                        <>
                          <TableRow key={profile.id} className="cursor-pointer" onClick={() => setExpandedUser(isExpanded ? null : profile.user_id)}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-1">
                                {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                                {profile.display_name || <span className="text-muted-foreground italic">Not set</span>}
                              </div>
                            </TableCell>
                            <TableCell>
                              {profile.player_name || <span className="text-muted-foreground italic">Not set</span>}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                              {new Date(profile.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openEdit(profile); }}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                          {isExpanded && cities && cities.length > 0 && (
                            <TableRow key={`${profile.id}-progress`}>
                              <TableCell colSpan={4} className="bg-muted/30 py-3 px-6">
                                <div className="text-xs font-medium text-muted-foreground mb-2">Progress by City</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                  {cities.map((city) => {
                                    const completed = userProgress[city.id] || 0;
                                    const total = locationCounts?.[city.id] || 0;
                                    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                                    return (
                                      <div key={city.id} className="flex items-center gap-2 text-sm">
                                        <span className="font-medium truncate">{city.name}:</span>
                                        <span className={completed === total && total > 0 ? 'text-green-600 font-semibold' : 'text-muted-foreground'}>
                                          {completed}/{total}
                                        </span>
                                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden min-w-[40px]">
                                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </VintageCardContent>
        </VintageCard>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editProfile} onOpenChange={(open) => !open && setEditProfile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Real Name</Label>
              <Input
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                placeholder="User's real name"
              />
            </div>
            <div className="space-y-2">
              <Label>Player / Team Name</Label>
              <Input
                value={editPlayerName}
                onChange={(e) => setEditPlayerName(e.target.value)}
                placeholder="Public player name"
              />
              <p className="text-xs text-muted-foreground">This is shown publicly on leaderboards.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProfile(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
