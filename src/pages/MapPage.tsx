import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header, MobileNav } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Map, Loader2 } from 'lucide-react';

// Default to Vaxholm
const VAXHOLM_CITY_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

// Convert various Google Maps URL formats to embed format
function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  
  // Clean up any trailing HTML artifacts (e.g. from pasted iframe tags)
  const cleanUrl = url.replace(/["']?\s*(width|height|style|class|allowfullscreen|loading|referrerpolicy)=.*$/gi, '').replace(/["'>\s]+$/, '').trim();
  
  // Already an embed URL (standard embed or My Maps embed)
  if (cleanUrl.includes('/maps/embed') || cleanUrl.includes('/maps/d/embed')) {
    return cleanUrl;
  }
  
  // Try to extract place/coordinates from URL
  try {
    const coordMatch = cleanUrl.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (coordMatch) {
      const lat = coordMatch[1];
      const lng = coordMatch[2];
      return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d10000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1234567890`;
    }
    
    const placeMatch = cleanUrl.match(/\/maps\/place\/([^/@]+)/);
    if (placeMatch) {
      const placeName = decodeURIComponent(placeMatch[1]);
      return `https://www.google.com/maps/embed/v1/place?key=&q=${encodeURIComponent(placeName)}`;
    }
  } catch (e) {
    // Invalid URL
  }
  
  return null;
}

export default function MapPage() {
  const { data: city, isLoading } = useQuery({
    queryKey: ['city', VAXHOLM_CITY_ID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('id, name, google_maps_url')
        .eq('id', VAXHOLM_CITY_ID)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const embedUrl = city?.google_maps_url ? getEmbedUrl(city.google_maps_url) : null;

  const openGoogleMaps = () => {
    if (city?.google_maps_url) {
      window.open(city.google_maps_url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Header />
      <main className="container py-6 space-y-4">
        <h1 className="font-display text-2xl font-bold">Map</h1>

        {city?.google_maps_url ? (
          <div className="space-y-4">
            {/* Map Preview Card */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div 
                  className="aspect-[4/3] bg-muted relative overflow-hidden flex items-center justify-center cursor-pointer group"
                  onClick={openGoogleMaps}
                >
                  {embedUrl ? (
                     <iframe
                        src={embedUrl}
                        width="640"
                        height="480"
                        style={{ border: 0, marginTop: '-70px', height: 'calc(100% + 70px)' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-x-0 top-0 w-full"
                      />
                  ) : (
                    <div className="text-center p-6">
                      <Map className="h-16 w-16 mx-auto text-primary/50 mb-4" />
                      <p className="text-muted-foreground mb-2">
                        Tap to view map in Google Maps
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Open in Google Maps button */}
            <Button onClick={openGoogleMaps} className="w-full" size="lg">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Google Maps
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Tap the map or button above to open the full interactive map
            </p>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Map className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                No map configured for this city yet.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
      <MobileNav />
    </div>
  );
}
