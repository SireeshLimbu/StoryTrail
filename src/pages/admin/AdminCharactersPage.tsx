import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAdminCities, useAdminCharacters } from '@/hooks/useAdmin';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Character } from '@/lib/types';

interface CharacterFormData {
  name: string;
  age: number | null;
  gender: string;
  height: string;
  bio: string;
  image_url: string;
  is_suspect: boolean;
  display_order: number;
}

const defaultFormData: CharacterFormData = {
  name: '',
  age: null,
  gender: '',
  height: '',
  bio: '',
  image_url: '',
  is_suspect: false,
  display_order: 0,
};

export default function AdminCharactersPage() {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [formData, setFormData] = useState<CharacterFormData>(defaultFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const queryClient = useQueryClient();
  const { data: cities } = useAdminCities();
  const { data: characters, isLoading } = useAdminCharacters(selectedCityId);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, image_url: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${selectedCityId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('character-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('character-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const saveMutation = useMutation({
    mutationFn: async (data: CharacterFormData & { id?: string; city_id: string }) => {
      const payload = {
        name: data.name,
        age: data.age,
        gender: data.gender || null,
        height: data.height || null,
        bio: data.bio || null,
        image_url: data.image_url || null,
        is_suspect: data.is_suspect,
        display_order: data.display_order,
        city_id: data.city_id,
      };

      if (data.id) {
        const { error } = await supabase
          .from('characters')
          .update(payload)
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('characters')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-characters'] });
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      setIsDialogOpen(false);
      setEditingCharacter(null);
      setFormData(defaultFormData);
      toast.success(editingCharacter ? 'Character updated successfully' : 'Character created successfully');
    },
    onError: (error) => {
      toast.error('Failed to save character: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-characters'] });
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      toast.success('Character deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete character: ' + error.message);
    },
  });

  const handleEdit = (character: Character) => {
    setEditingCharacter(character);
    setFormData({
      name: character.name,
      age: character.age,
      gender: character.gender || '',
      height: character.height || '',
      bio: character.bio || '',
      image_url: character.image_url || '',
      is_suspect: character.is_suspect,
      display_order: character.display_order,
    });
    setImageFile(null);
    setImagePreview(character.image_url || null);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    if (!selectedCityId) {
      toast.error('Please select a city first');
      return;
    }
    setEditingCharacter(null);
    const nextOrder = characters?.length ? Math.max(...characters.map(c => c.display_order)) + 1 : 1;
    setFormData({ ...defaultFormData, display_order: nextOrder });
    setImageFile(null);
    setImagePreview(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCityId) return;
    
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
      id: editingCharacter?.id,
      city_id: selectedCityId,
    });
  };

  const handleDelete = (character: Character) => {
    if (confirm(`Are you sure you want to delete "${character.name}"?`)) {
      deleteMutation.mutate(character.id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Characters</h1>
            <p className="text-muted-foreground">Manage suspects and their profiles</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedCityId || ''} onValueChange={setSelectedCityId}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                {cities?.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate} disabled={!selectedCityId}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Character
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingCharacter ? 'Edit Character' : 'Create New Character'}</DialogTitle>
                  <DialogDescription>
                    {editingCharacter ? 'Update the character details below.' : 'Add a new suspect to the mystery.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Captain Löfving"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age ?? ''}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : null })}
                        placeholder="35"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select 
                        value={formData.gender} 
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        placeholder="e.g., 180 cm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biography</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Character background and personality..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Character Image</Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    {imagePreview ? (
                      <div className="flex flex-col items-center gap-2">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={imagePreview} alt="Preview" />
                          <AvatarFallback>{formData.name.charAt(0) || '?'}</AvatarFallback>
                        </Avatar>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            Change
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={clearImage}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-24 border-dashed"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Upload image</span>
                        </div>
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_suspect"
                      checked={formData.is_suspect}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_suspect: checked })}
                    />
                    <Label htmlFor="is_suspect">Suspect (hidden until reveal location)</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={saveMutation.isPending || isUploading} className="flex-1">
                      {(saveMutation.isPending || isUploading) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {isUploading ? 'Uploading...' : editingCharacter ? 'Update Character' : 'Create Character'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {selectedCityId 
                ? `Characters in ${cities?.find(c => c.id === selectedCityId)?.name}`
                : 'Select a City'
              }
            </CardTitle>
            <CardDescription>
              {selectedCityId 
                ? `${characters?.length || 0} characters configured`
                : 'Choose a city to manage its characters'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedCityId ? (
              <div className="text-center py-8 text-muted-foreground">
                Select a city from the dropdown above
              </div>
            ) : isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : characters?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No characters yet. Create your first suspect!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Suspect</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead className="max-w-xs">Bio</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {characters?.map((character) => (
                    <TableRow key={character.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={character.image_url || undefined} alt={character.name} />
                          <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{character.name}</TableCell>
                      <TableCell>{character.is_suspect ? '🔍 Yes' : '—'}</TableCell>
                      <TableCell>{character.age ?? '—'}</TableCell>
                      <TableCell>{character.gender ?? '—'}</TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                        {character.bio || '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(character)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(character)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
