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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAdminCities, useAdminLocations } from '@/hooks/useAdmin';
import { Plus, Pencil, Trash2, Loader2, GripVertical, Upload, X, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

// Local type for admin location data from database
interface AdminLocation {
  id: string;
  city_id: string;
  name: string;
  intro_text: string | null;
  riddle_text: string | null;
  answer_options: Json;
  correct_answer_index: number | null;
  correct_answer_indices: number[] | null;
  clue_text: string | null;
  latitude: number | null;
  longitude: number | null;
  sequence_order: number;
  is_intro_location: boolean;
  image_url: string | null;
  answer_type: string;
  free_text_answer: string | null;
  is_reveal: boolean;
  reveal_image_url: string | null;
  is_end_location: boolean;
  created_at: string;
  updated_at: string;
}

interface LocationFormData {
  name: string;
  intro_text: string;
  riddle_text: string;
  answer_options: string[];
  correct_answer_index: number;
  correct_answer_indices: number[];
  clue_text: string;
  latitude: number | null;
  longitude: number | null;
  sequence_order: number;
  is_intro_location: boolean;
  image_url: string;
  answer_type: 'multiple_choice' | 'free_text';
  free_text_answer: string;
  is_reveal: boolean;
  reveal_image_url: string;
  is_end_location: boolean;
}

const defaultFormData: LocationFormData = {
  name: '',
  intro_text: '',
  riddle_text: '',
  answer_options: ['', '', '', '', ''],
  correct_answer_index: 0,
  correct_answer_indices: [0],
  clue_text: '',
  latitude: null,
  longitude: null,
  sequence_order: 0,
  is_intro_location: false,
  image_url: '',
  answer_type: 'multiple_choice',
  free_text_answer: '',
  is_reveal: false,
  reveal_image_url: '',
  is_end_location: false,
};

export default function AdminLocationsPage() {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<AdminLocation | null>(null);
  const [formData, setFormData] = useState<LocationFormData>(defaultFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [revealImageFile, setRevealImageFile] = useState<File | null>(null);
  const [revealImagePreview, setRevealImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const revealFileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  
  const queryClient = useQueryClient();
  const { data: cities } = useAdminCities();
  const { data: locations, isLoading } = useAdminLocations(selectedCityId);

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
      .from('location-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('location-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const saveMutation = useMutation({
    mutationFn: async (data: LocationFormData & { id?: string; city_id: string }) => {
      const filteredOptions = data.answer_options.filter(o => o.trim());
      const payload = {
        name: data.name,
        intro_text: data.intro_text || null,
        riddle_text: data.riddle_text || null,
        answer_options: filteredOptions,
        correct_answer_index: data.answer_type === 'multiple_choice' ? data.correct_answer_indices[0] ?? data.correct_answer_index : null,
        correct_answer_indices: data.answer_type === 'multiple_choice' ? data.correct_answer_indices : null,
        clue_text: data.clue_text || null,
        latitude: data.latitude,
        longitude: data.longitude,
        sequence_order: data.sequence_order,
        is_intro_location: data.is_intro_location,
        image_url: data.image_url || null,
        city_id: data.city_id,
        answer_type: data.answer_type,
        free_text_answer: data.answer_type === 'free_text' ? (data.free_text_answer || null) : null,
        is_reveal: data.is_reveal,
        reveal_image_url: data.reveal_image_url || null,
        is_end_location: data.is_end_location,
      };

      if (data.id) {
        const { error } = await supabase
          .from('locations')
          .update(payload)
          .eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('locations')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-locations'] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      setIsDialogOpen(false);
      setEditingLocation(null);
      setFormData(defaultFormData);
      toast.success(editingLocation ? 'Location updated successfully' : 'Location created successfully');
    },
    onError: (error) => {
      toast.error('Failed to save location: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-locations'] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success('Location deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete location: ' + error.message);
    },
  });

  const handleEdit = (location: AdminLocation) => {
    setEditingLocation(location);
    const rawOptions = location.answer_options;
    const options: string[] = Array.isArray(rawOptions) 
      ? (rawOptions as string[])
      : [];
    // Ensure we always have 5 options
    while (options.length < 5) options.push('');
    
    const indices = location.correct_answer_indices ?? 
      (location.correct_answer_index !== null ? [location.correct_answer_index] : [0]);
    
    setFormData({
      name: location.name,
      intro_text: location.intro_text || '',
      riddle_text: location.riddle_text || '',
      answer_options: options,
      correct_answer_index: location.correct_answer_index || 0,
      correct_answer_indices: indices,
      clue_text: location.clue_text || '',
      latitude: location.latitude,
      longitude: location.longitude,
      sequence_order: location.sequence_order,
      is_intro_location: location.is_intro_location,
      image_url: location.image_url || '',
      answer_type: (location.answer_type as 'multiple_choice' | 'free_text') || 'multiple_choice',
      free_text_answer: location.free_text_answer || '',
      is_reveal: location.is_reveal || false,
      reveal_image_url: location.reveal_image_url || '',
      is_end_location: (location as AdminLocation).is_end_location || false,
    });
    setImageFile(null);
    setImagePreview(location.image_url || null);
    setRevealImageFile(null);
    setRevealImagePreview(location.reveal_image_url || null);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    if (!selectedCityId) {
      toast.error('Please select a city first');
      return;
    }
    setEditingLocation(null);
    const nextOrder = locations?.length ? Math.max(...locations.map(l => l.sequence_order)) + 1 : 1;
    setFormData({ ...defaultFormData, sequence_order: nextOrder });
    setImageFile(null);
    setImagePreview(null);
    setRevealImageFile(null);
    setRevealImagePreview(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCityId) return;
    
    let finalImageUrl = formData.image_url;
    let finalRevealImageUrl = formData.reveal_image_url;
    
    setIsUploading(true);
    try {
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }
      if (revealImageFile) {
        finalRevealImageUrl = await uploadImage(revealImageFile);
      }
    } catch (error) {
      toast.error('Failed to upload image');
      setIsUploading(false);
      return;
    }
    setIsUploading(false);
    
    saveMutation.mutate({
      ...formData,
      image_url: finalImageUrl,
      reveal_image_url: finalRevealImageUrl,
      id: editingLocation?.id,
      city_id: selectedCityId,
    });
  };

  const handleDelete = (location: AdminLocation) => {
    if (confirm(`Are you sure you want to delete "${location.name}"?`)) {
      deleteMutation.mutate(location.id);
    }
  };

  const updateAnswerOption = (index: number, value: string) => {
    const newOptions = [...formData.answer_options];
    newOptions[index] = value;
    setFormData({ ...formData, answer_options: newOptions });
  };

  const handleCsvImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCityId) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length < 2) {
        toast.error('CSV file appears empty');
        return;
      }

      if (!locations || locations.length === 0) {
        toast.error('No existing locations to update — create locations first');
        return;
      }

      // Parse coordinates from ALL CSV data rows, matching by row number (1-based) to sequence_order
      const sorted = [...locations].sort((a, b) => a.sequence_order - b.sequence_order);
      let updated = 0;

      // Process each raw line after header, using line index as sequence number
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        // Extract POINT coordinates from anywhere in the line
        const pointMatch = line.match(/POINT\s*\(\s*(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s*\)/i);
        if (!pointMatch) {
          console.warn(`CSV row ${i}: no POINT coordinates found, skipping`);
          continue;
        }

        const longitude = parseFloat(pointMatch[1]);
        const latitude = parseFloat(pointMatch[2]);

        // Match to location by sequence position (CSV row 1 = sequence_order index 0, etc.)
        const seqIndex = updated;
        if (seqIndex >= sorted.length) break;

        const { error } = await supabase
          .from('locations')
          .update({ latitude, longitude })
          .eq('id', sorted[seqIndex].id);
        if (error) throw error;
        updated++;
      }

      if (updated < sorted.length) {
        toast.warning(`Only ${updated} of ${sorted.length} locations were updated — some CSV rows had no coordinates`);
      }

      queryClient.invalidateQueries({ queryKey: ['admin-locations'] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast.success(`Updated coordinates for ${updated} locations`);
    } catch (err: any) {
      toast.error('Import failed: ' + err.message);
    } finally {
      setIsImporting(false);
      if (csvInputRef.current) csvInputRef.current.value = '';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Locations</h1>
            <p className="text-muted-foreground">Manage puzzle locations and their content</p>
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
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv"
              onChange={handleCsvImport}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => csvInputRef.current?.click()}
              disabled={!selectedCityId || isImporting}
            >
              {isImporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              Import CSV
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate} disabled={!selectedCityId}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingLocation ? 'Edit Location' : 'Create New Location'}</DialogTitle>
                  <DialogDescription>
                    {editingLocation ? 'Update the location details below.' : 'Add a new puzzle location.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Location Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Norrhamnen: Kullarna"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sequence">Sequence Order</Label>
                      <Input
                        id="sequence"
                        type="number"
                        value={formData.sequence_order}
                        onChange={(e) => setFormData({ ...formData, sequence_order: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="google_maps_link">Google Maps Link</Label>
                    <Input
                      id="google_maps_link"
                      type="url"
                      placeholder="Paste a Google Maps link to auto-fill coordinates"
                      onChange={(e) => {
                        const url = e.target.value;
                        if (!url) return;
                        // Match patterns like @59.4019,18.3507 or ?q=59.4019,18.3507 or ll=59.4019,18.3507
                        const patterns = [
                          /@(-?\d+\.?\d*),(-?\d+\.?\d*)/,
                          /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
                          /[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
                          /place\/[^/]*\/(-?\d+\.?\d*),(-?\d+\.?\d*)/,
                        ];
                        for (const pattern of patterns) {
                          const match = url.match(pattern);
                          if (match) {
                            setFormData({
                              ...formData,
                              latitude: parseFloat(match[1]),
                              longitude: parseFloat(match[2]),
                            });
                            toast.success('Coordinates extracted from link');
                            return;
                          }
                        }
                        toast.error('Could not extract coordinates from this link');
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        value={formData.latitude ?? ''}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value ? parseFloat(e.target.value) : null })}
                        placeholder="59.4019"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        value={formData.longitude ?? ''}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value ? parseFloat(e.target.value) : null })}
                        placeholder="18.3507"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="intro"
                      checked={formData.is_intro_location}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_intro_location: checked })}
                    />
                    <Label htmlFor="intro">This is an intro location (no puzzle required)</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_reveal"
                      checked={formData.is_reveal}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_reveal: checked })}
                    />
                    <Label htmlFor="is_reveal">This is a reveal location (shows suspects)</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_end_location"
                      checked={formData.is_end_location}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_end_location: checked })}
                    />
                    <Label htmlFor="is_end_location">This is the end location (skips clue, goes to summary)</Label>
                  </div>

                  {formData.is_reveal && (
                    <div className="space-y-2">
                      <Label>Reveal Image (Suspects)</Label>
                      <input
                        ref={revealFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
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
                            setRevealImageFile(file);
                            setRevealImagePreview(URL.createObjectURL(file));
                          }
                        }}
                        className="hidden"
                      />
                      
                      {revealImagePreview ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative w-full h-32 rounded-md overflow-hidden border bg-muted">
                            <img 
                              src={revealImagePreview} 
                              alt="Reveal preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => revealFileInputRef.current?.click()}
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              Change
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setRevealImageFile(null);
                                setRevealImagePreview(null);
                                setFormData({ ...formData, reveal_image_url: '' });
                                if (revealFileInputRef.current) revealFileInputRef.current.value = '';
                              }}
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
                          onClick={() => revealFileInputRef.current?.click()}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Upload reveal image (suspects)</span>
                          </div>
                        </Button>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="intro_text">Intro Text</Label>
                    <Textarea
                      id="intro_text"
                      value={formData.intro_text}
                      onChange={(e) => setFormData({ ...formData, intro_text: e.target.value })}
                      placeholder="The story text shown when arriving at this location..."
                      rows={3}
                    />
                  </div>

                  {!formData.is_intro_location && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="riddle_text">Riddle / Question</Label>
                        <Textarea
                          id="riddle_text"
                          value={formData.riddle_text}
                          onChange={(e) => setFormData({ ...formData, riddle_text: e.target.value })}
                          placeholder="The puzzle question the player must answer..."
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Answer Type</Label>
                        <Select 
                          value={formData.answer_type} 
                          onValueChange={(value: 'multiple_choice' | 'free_text') => setFormData({ ...formData, answer_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                            <SelectItem value="free_text">Free Text Input</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.answer_type === 'multiple_choice' ? (
                        <div className="space-y-2">
                          <Label>Answer Options <span className="text-muted-foreground text-xs">(click to toggle correct — multiple allowed)</span></Label>
                          <div className="space-y-2">
                            {formData.answer_options.map((option, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input
                                  value={option}
                                  onChange={(e) => updateAnswerOption(index, e.target.value)}
                                  placeholder={`Option ${index + 1}`}
                                />
                                <Button
                                  type="button"
                                  variant={formData.correct_answer_indices.includes(index) ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => {
                                    const indices = formData.correct_answer_indices.includes(index)
                                      ? formData.correct_answer_indices.filter(i => i !== index)
                                      : [...formData.correct_answer_indices, index];
                                    // Ensure at least one correct answer
                                    if (indices.length === 0) return;
                                    setFormData({ ...formData, correct_answer_indices: indices });
                                  }}
                                >
                                  {formData.correct_answer_indices.includes(index) ? '✓ Correct' : 'Set Correct'}
                                </Button>
                              </div>
                            ))}
                          </div>
                          {formData.correct_answer_indices.length > 1 && (
                            <p className="text-sm text-muted-foreground">
                              {formData.correct_answer_indices.length} correct answers selected
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="free_text_answer">Correct Answer (case-insensitive)</Label>
                          <Input
                            id="free_text_answer"
                            value={formData.free_text_answer}
                            onChange={(e) => setFormData({ ...formData, free_text_answer: e.target.value })}
                            placeholder="The exact answer the player must type..."
                          />
                          <p className="text-xs text-muted-foreground">
                            Player's answer will be compared case-insensitively with trimmed whitespace.
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="clue_text">Clue (revealed after solving)</Label>
                        <Textarea
                          id="clue_text"
                          value={formData.clue_text}
                          onChange={(e) => setFormData({ ...formData, clue_text: e.target.value })}
                          placeholder="The clue revealed when the player answers correctly..."
                          rows={2}
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label>Location Image</Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    {imagePreview ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative w-full h-32 rounded-md overflow-hidden border bg-muted">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
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
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Upload location image</span>
                        </div>
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={saveMutation.isPending || isUploading} className="flex-1">
                      {(saveMutation.isPending || isUploading) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {isUploading ? 'Uploading...' : editingLocation ? 'Update Location' : 'Create Location'}
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
                ? `Locations in ${cities?.find(c => c.id === selectedCityId)?.name}`
                : 'Select a City'
              }
            </CardTitle>
            <CardDescription>
              {selectedCityId 
                ? `${locations?.length || 0} locations configured`
                : 'Choose a city to manage its locations'
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
            ) : locations?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No locations yet. Create your first puzzle location!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Coordinates</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locations?.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          {location.sequence_order}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{location.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 flex-wrap">
                          <Badge variant={location.is_intro_location ? 'secondary' : 'default'}>
                            {location.is_intro_location ? 'Intro' : location.answer_type === 'free_text' ? 'Free Text' : 'Multiple Choice'}
                          </Badge>
                          {(location as AdminLocation).is_reveal && (
                            <Badge variant="outline" className="border-amber-500 text-amber-600">
                              Reveal
                            </Badge>
                          )}
                          {(location as AdminLocation).is_end_location && (
                            <Badge variant="outline" className="border-red-500 text-red-600">
                              End
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {location.latitude && location.longitude 
                          ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                          : '—'
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(location)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(location)}>
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
