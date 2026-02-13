import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminCities } from '@/hooks/useAdmin';
import { Map, Loader2, ExternalLink, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminMapsPage() {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  
  const queryClient = useQueryClient();
  const { data: cities, isLoading } = useAdminCities();

  const selectedCity = cities?.find(c => c.id === selectedCityId);

  const handleCityChange = (cityId: string) => {
    const city = cities?.find(c => c.id === cityId);
    setSelectedCityId(cityId);
    setGoogleMapsUrl(city?.google_maps_url || '');
    setHasChanges(false);
  };

  const handleUrlChange = (url: string) => {
    setGoogleMapsUrl(url);
    setHasChanges(url !== (selectedCity?.google_maps_url || ''));
  };

  const saveMutation = useMutation({
    mutationFn: async ({ cityId, url }: { cityId: string; url: string }) => {
      const { error } = await supabase
        .from('cities')
        .update({ google_maps_url: url || null })
        .eq('id', cityId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cities'] });
      toast.success('Google Maps URL saved successfully');
      setHasChanges(false);
    },
    onError: (error) => {
      toast.error('Failed to save URL: ' + error.message);
    },
  });

  const handleSave = () => {
    if (!selectedCityId) return;
    saveMutation.mutate({ cityId: selectedCityId, url: googleMapsUrl });
  };

  const openGoogleMapsUrl = () => {
    if (googleMapsUrl) {
      window.open(googleMapsUrl, '_blank');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Maps</h1>
            <p className="text-muted-foreground">Configure Google Maps URL for each city</p>
          </div>
          <Select value={selectedCityId || ''} onValueChange={handleCityChange}>
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
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !selectedCityId ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Map className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                Select a city from the dropdown above to configure its Google Maps URL
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                {selectedCity?.name} Map
              </CardTitle>
              <CardDescription>
                Enter the Google Maps URL for this city
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="google-maps-url">Google Maps URL</Label>
                <Input
                  id="google-maps-url"
                  type="url"
                  value={googleMapsUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://www.google.com/maps/..."
                />
                <p className="text-xs text-muted-foreground">
                  Paste a Google Maps share link or embed URL for this city
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleSave} 
                  disabled={saveMutation.isPending || !hasChanges}
                >
                  {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                {googleMapsUrl && (
                  <Button variant="outline" onClick={openGoogleMapsUrl}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in Google Maps
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
