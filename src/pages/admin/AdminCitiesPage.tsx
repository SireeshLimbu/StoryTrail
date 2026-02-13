import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAdminCities } from '@/hooks/useAdmin';
import { Plus, Pencil, Trash2, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import type { City } from '@/lib/types';

interface CityFormData {
  name: string;
  description: string;
  tagline: string;
  story_description: string;
  how_it_works: string[];
  price_cents: number;
  is_published: boolean;
  image_url: string;
  display_order: number;
  distance_km: string;
}

const defaultHowItWorks = [
  'Create your free account to get started',
  'Travel to each location using the map',
  'Solve riddles to unlock clues and progress',
  'Piece together the mystery as you explore',
];

const defaultFormData: CityFormData = {
  name: '',
  description: '',
  tagline: '',
  story_description: '',
  how_it_works: [...defaultHowItWorks],
  price_cents: 0,
  is_published: false,
  image_url: '',
  display_order: 0,
  distance_km: '',
};

export default function AdminCitiesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState<CityFormData>(defaultFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const queryClient = useQueryClient();
  const { data: cities, isLoading } = useAdminCities();

  const saveMutation = useMutation({
    mutationFn: async (data: CityFormData & { id?: string }) => {
      if (data.id) {
        const { error } = await supabase
          .from('cities')
          .update({
            name: data.name,
            description: data.description,
            tagline: data.tagline,
            story_description: data.story_description,
            how_it_works: data.how_it_works,
            price_cents: data.price_cents,
            is_published: data.is_published,
            image_url: data.image_url || null,
            display_order: data.display_order,
            distance_km: data.distance_km ? parseFloat(data.distance_km) : null,
          })
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cities')
          .insert({
            name: data.name,
            description: data.description,
            tagline: data.tagline,
            story_description: data.story_description,
            how_it_works: data.how_it_works,
            price_cents: data.price_cents,
            is_published: data.is_published,
            image_url: data.image_url || null,
            display_order: data.display_order,
            distance_km: data.distance_km ? parseFloat(data.distance_km) : null,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cities'] });
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      setIsDialogOpen(false);
      setEditingCity(null);
      setFormData(defaultFormData);
      setImageFile(null);
      setImagePreview(null);
      toast.success(editingCity ? 'City updated successfully' : 'City created successfully');
    },
    onError: (error) => {
      toast.error('Failed to save city: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cities')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cities'] });
      queryClient.invalidateQueries({ queryKey: ['cities'] });
      toast.success('City deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete city: ' + error.message);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('city-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('city-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleEdit = (city: City) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      description: city.description || '',
      tagline: city.tagline || '',
      story_description: city.story_description || '',
      how_it_works: Array.isArray((city as any).how_it_works) ? (city as any).how_it_works : [...defaultHowItWorks],
      price_cents: city.price_cents,
      is_published: city.is_published,
      image_url: city.image_url || '',
      display_order: (city as any).display_order ?? 0,
      distance_km: (city as any).distance_km?.toString() || '',
    });
    setImagePreview(city.image_url || null);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingCity(null);
    setFormData(defaultFormData);
    setImageFile(null);
    setImagePreview(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalImageUrl = formData.image_url;

    if (imageFile) {
      setIsUploading(true);
      try {
        finalImageUrl = await uploadImage(imageFile);
      } catch (error) {
        toast.error('Failed to upload image');
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    saveMutation.mutate({
      ...formData,
      image_url: finalImageUrl,
      id: editingCity?.id,
    });
  };

  const handleDelete = (city: City) => {
    if (confirm(`Are you sure you want to delete "${city.name}"? This will also delete all locations and characters.`)) {
      deleteMutation.mutate(city.id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Cities</h1>
            <p className="text-muted-foreground">Manage the cities and their settings</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add City
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCity ? 'Edit City' : 'Create New City'}</DialogTitle>
                <DialogDescription>
                  {editingCity ? 'Update the city details below.' : 'Add a new mystery city to the game.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">City Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Vaxholm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline (Stories list)</Label>
                  <Textarea
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="Short text shown on the stories overview card..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Home page)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description shown on the home page..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="story_description">Story Page Description</Label>
                  <Textarea
                    id="story_description"
                    value={formData.story_description}
                    onChange={(e) => setFormData({ ...formData, story_description: e.target.value })}
                    placeholder="Longer description for the story landing page..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>How It Works Steps</Label>
                  {formData.how_it_works.map((step, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium mt-1">{i + 1}</span>
                      <Input
                        value={step}
                        onChange={(e) => {
                          const updated = [...formData.how_it_works];
                          updated[i] = e.target.value;
                          setFormData({ ...formData, how_it_works: updated });
                        }}
                        placeholder={`Step ${i + 1}`}
                      />
                      {formData.how_it_works.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => {
                          const updated = formData.how_it_works.filter((_, j) => j !== i);
                          setFormData({ ...formData, how_it_works: updated });
                        }}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => {
                    setFormData({ ...formData, how_it_works: [...formData.how_it_works, ''] });
                  }}>
                    <Plus className="h-4 w-4 mr-1" /> Add Step
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Story Image</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  {imagePreview || formData.image_url ? (
                    <div className="relative w-full h-40 rounded-md overflow-hidden border">
                      <img
                        src={imagePreview || formData.image_url}
                        alt="City preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          type="button"
                          size="icon"
                          variant="secondary"
                          className="h-7 w-7"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="secondary"
                          className="h-7 w-7"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                            setFormData({ ...formData, image_url: '' });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-28 border-dashed"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Upload image</span>
                      </div>
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value || '0', 10) })}
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">Lower numbers appear first</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (SEK)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price_cents / 100}
                    onChange={(e) => setFormData({ ...formData, price_cents: Math.round(parseFloat(e.target.value || '0') * 100) })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance_km">Distance (km)</Label>
                  <Input
                    id="distance_km"
                    type="number"
                    step="0.1"
                    value={formData.distance_km}
                    onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
                    placeholder="e.g. 3.5"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="published">Published (visible to players)</Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={saveMutation.isPending || isUploading} className="flex-1">
                    {(saveMutation.isPending || isUploading) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {isUploading ? 'Uploading...' : editingCity ? 'Update City' : 'Create City'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Cities</CardTitle>
            <CardDescription>
              {cities?.length || 0} cities configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : cities?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No cities yet. Create your first mystery!
              </div>
            ) : (
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Order</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Description</TableHead>
                    <TableHead className="w-20">Price</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-20 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cities?.map((city) => (
                    <TableRow key={city.id}>
                      <TableCell className="text-muted-foreground">{(city as any).display_order ?? 0}</TableCell>
                      <TableCell className="font-medium">{city.name}</TableCell>
                      <TableCell className="hidden sm:table-cell max-w-xs truncate">{city.description || '—'}</TableCell>
                      <TableCell>{(city.price_cents / 100).toFixed(2)} SEK</TableCell>
                      <TableCell>
                        <Badge variant={city.is_published ? 'default' : 'secondary'}>
                          {city.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(city)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(city)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
