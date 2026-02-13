import { useNavigate } from 'react-router-dom';
import { useLocations, useUserProgress } from '@/hooks/useGameData';
import { useGeolocation, calculateDistance, formatDistance } from '@/hooks/useGeolocation';
import { Header, MobileNav } from '@/components/Navigation';
import { VintageCard, VintageCardContent, VintageCardHeader, VintageCardTitle } from '@/components/VintageCard';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Check, Lock, Loader2 } from 'lucide-react';
import { useMemo } from 'react';

// Default to Vaxholm
const VAXHOLM_CITY_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

export default function TrailPage() {
  const navigate = useNavigate();
  const { data: locations, isLoading } = useLocations(VAXHOLM_CITY_ID);
  const { data: progress } = useUserProgress(VAXHOLM_CITY_ID);
  const geo = useGeolocation();

  const completedLocationIds = useMemo(() => 
    new Set(progress?.map(p => p.location_id) || []),
    [progress]
  );

  const isLocationUnlocked = (location: typeof locations[0]) => {
    if (location.sequence_order <= 2) return true;
    const prevLocation = locations?.find(l => l.sequence_order === location.sequence_order - 1);
    return prevLocation ? completedLocationIds.has(prevLocation.id) : false;
  };

  const getDistanceToLocation = (location: typeof locations[0]) => {
    if (!geo.latitude || !geo.longitude || !location.latitude || !location.longitude) {
      return null;
    }
    return calculateDistance(
      geo.latitude, geo.longitude,
      location.latitude, location.longitude
    );
  };

  const handleOpenMaps = (location: typeof locations[0]) => {
    if (!location.latitude || !location.longitude) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Find next uncompleted location
  const nextLocation = locations?.find(l => 
    isLocationUnlocked(l) && !completedLocationIds.has(l.id)
  );

  return (
    <div className="min-h-screen pb-20">
      <Header />
      <main className="container py-6 space-y-6">
        <h1 className="font-display text-2xl font-bold">Your Trail</h1>

        {geo.error && (
          <VintageCard variant="default" className="border-destructive/50">
            <VintageCardContent className="py-4">
              <p className="text-destructive text-sm">{geo.error}</p>
            </VintageCardContent>
          </VintageCard>
        )}

        {/* Current Target */}
        {nextLocation && (
          <VintageCard variant="elegant" className="border-accent">
            <VintageCardHeader>
              <VintageCardTitle className="text-lg flex items-center gap-2">
                <Navigation className="h-5 w-5 text-accent" />
                Next Destination
              </VintageCardTitle>
            </VintageCardHeader>
            <VintageCardContent className="space-y-3">
              <div>
                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                  Location {nextLocation.sequence_order}
                </span>
                <h3 className="font-display text-lg font-semibold mt-1">{nextLocation.name}</h3>
                {getDistanceToLocation(nextLocation) && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDistance(getDistanceToLocation(nextLocation)!)} away
                  </p>
                )}
              </div>
              <Button onClick={() => handleOpenMaps(nextLocation)} className="w-full">
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
            </VintageCardContent>
          </VintageCard>
        )}

        {/* All Locations */}
        <div className="space-y-2">
          <h2 className="font-display text-base font-semibold text-muted-foreground">All Locations</h2>
          <div className="bg-card rounded-lg border divide-y">
            {locations?.map((location) => {
              const unlocked = isLocationUnlocked(location);
              const completed = completedLocationIds.has(location.id);
              const distance = getDistanceToLocation(location);

              return (
                <div 
                  key={location.id} 
                  className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors hover:bg-muted/50 ${!unlocked ? 'opacity-50' : ''}`}
                  onClick={() => navigate(`/game/${VAXHOLM_CITY_ID}?location=${location.id}`)}
                >
                  {/* Status indicator */}
                  <div className={`
                    h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium
                    ${completed ? 'bg-accent text-accent-foreground' : 
                      unlocked ? 'bg-primary/10 text-primary border border-primary/30' : 
                      'bg-muted text-muted-foreground'}
                  `}>
                    {completed ? <Check className="h-3.5 w-3.5" /> : 
                     !unlocked ? <Lock className="h-3.5 w-3.5" /> :
                     <span>{location.sequence_order}</span>}
                  </div>
                  
                  {/* Location info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate">{location.name}</h3>
                    {distance && unlocked && (
                      <p className="text-xs text-muted-foreground">
                        {formatDistance(distance)}
                      </p>
                    )}
                  </div>

                  {/* Action button */}
                  {unlocked && !completed && (
                    <Button 
                      size="icon" 
                      variant="ghost"
                      className="h-7 w-7 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenMaps(location);
                      }}
                    >
                      <MapPin className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
