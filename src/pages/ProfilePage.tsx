import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Header, MobileNav } from '@/components/Navigation';
import { VintageCard, VintageCardContent, VintageCardHeader, VintageCardTitle, OrnamentalDivider } from '@/components/VintageCard';
import { LogoutConfirmDialog } from '@/components/LogoutConfirmDialog';
import { DeleteAccountDialog } from '@/components/DeleteAccountDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Shield, RotateCcw } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [resetting, setResetting] = useState(false);

  const handleResetProgress = async () => {
    if (!user) return;
    setResetting(true);
    try {
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      toast({ title: 'Progress reset', description: 'Your game progress has been cleared.' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />
      <main className="container py-6 space-y-6">
        <h1 className="font-display text-2xl font-bold">Your Profile</h1>

        <VintageCard variant="parchment">
          <VintageCardHeader>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <VintageCardTitle className="text-lg">
                  {user?.user_metadata?.display_name || 'Detective'}
                </VintageCardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Player name: {user?.user_metadata?.player_name || '—'}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </p>
              </div>
            </div>
          </VintageCardHeader>
        </VintageCard>

        <OrnamentalDivider />

        {/* Account Actions */}
        <VintageCard variant="default">
          <VintageCardHeader>
            <VintageCardTitle className="text-lg">Account</VintageCardTitle>
          </VintageCardHeader>
          <VintageCardContent className="space-y-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2" disabled={resetting}>
                  <RotateCcw className="h-4 w-4" />
                  {resetting ? 'Resetting...' : 'Reset Game Progress'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset all progress?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will clear all your completed locations across all stories. You'll start each story from the beginning. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetProgress}>Reset Progress</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <LogoutConfirmDialog variant="full" />
          </VintageCardContent>
        </VintageCard>

        {/* Privacy & Data */}
        <VintageCard variant="default">
          <VintageCardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <VintageCardTitle className="text-lg">Privacy & Data</VintageCardTitle>
            </div>
          </VintageCardHeader>
          <VintageCardContent className="space-y-3">
            <Link 
              to="/privacy" 
              className="block w-full text-center py-2 px-4 border border-border rounded-md hover:bg-secondary transition-colors text-sm"
            >
              View Privacy Policy
            </Link>
            <DeleteAccountDialog />
          </VintageCardContent>
        </VintageCard>
      </main>
      <MobileNav />
    </div>
  );
}
