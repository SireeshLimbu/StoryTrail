import { useState, useMemo, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useLocations, useUserProgress, useValidateAnswer, useUserPurchase, useCharacters, useSaveTrailCompletion, useTrailCompletion, useCity } from '@/hooks/useGameData';
import { useGeolocation, calculateDistance, formatDistance } from '@/hooks/useGeolocation';
import { usePlaytestSetting } from '@/hooks/usePlaytestSetting';
import { Header, MobileNav } from '@/components/Navigation';
import { LocationCard, LocationDetail } from '@/components/LocationCard';
import { VintageCard, VintageCardContent, OrnamentalDivider } from '@/components/VintageCard';
import { Button } from '@/components/ui/button';
import { GameTimer, formatTime } from '@/components/GameTimer';
import { TrailSummary } from '@/components/TrailSummary';
import { ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Distance threshold for "at location" (50 meters)
const LOCATION_THRESHOLD = 50;
export default function GamePage() {
  const {
    cityId
  } = useParams<{
    cityId: string;
  }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [playtestAtLocation, setPlaytestAtLocation] = useState<Set<string>>(new Set());
  const [revealedClues, setRevealedClues] = useState<Record<string, string>>({});
  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerFinalTime, setTimerFinalTime] = useState<number | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState<Record<string, number>>({});
  const [showSummary, setShowSummary] = useState(false);
  const {
    data: locations,
    isLoading: locationsLoading
  } = useLocations(cityId);
  const {
    data: progress,
    isLoading: progressLoading
  } = useUserProgress(cityId);
  const {
    data: purchase
  } = useUserPurchase(cityId);
  const {
    data: characters
  } = useCharacters(cityId);
  const {
    data: playtestEnabled
  } = usePlaytestSetting();
  const { data: city } = useCity(cityId);
  const validateAnswer = useValidateAnswer();
  const saveCompletion = useSaveTrailCompletion();
  const { data: existingCompletion } = useTrailCompletion(cityId);
  const hasCompletedBefore = !!existingCompletion;
  const geo = useGeolocation();
  const completedLocationIds = useMemo(() => new Set(progress?.map(p => p.location_id) || []), [progress]);

  // Check if the end location is completed (trail finished)
  const allPuzzlesSolved = useMemo(() => {
    if (!locations || !progress) return false;
    const endLocation = locations.find(l => l.is_end_location);
    if (endLocation) return completedLocationIds.has(endLocation.id);
    // Fallback: all non-intro locations completed
    const puzzleLocations = locations.filter(l => !l.is_intro_location);
    return puzzleLocations.length > 0 && puzzleLocations.every(l => completedLocationIds.has(l.id));
  }, [locations, progress, completedLocationIds]);



  // Handle location from URL query params - wait for progress to load first
  useEffect(() => {
    const locationId = searchParams.get('location');
    if (locationId && locations?.some(l => l.id === locationId) && !progressLoading) {
      setSelectedLocationId(locationId);
      // Clear the query param after setting the location
      setSearchParams({}, {
        replace: true
      });
    }
  }, [searchParams, locations, progressLoading, setSearchParams]);
  const isLocationUnlocked = (location: typeof locations[0]) => {
    // First two locations are always unlocked
    if (location.sequence_order <= 2) return true;

    // Find previous location and check if completed
    const prevLocation = locations?.find(l => l.sequence_order === location.sequence_order - 1);
    return prevLocation ? completedLocationIds.has(prevLocation.id) : false;
  };
  const isAtLocation = (location: typeof locations[0]) => {
    // Playtest override
    if (playtestAtLocation.has(location.id)) return true;

    // Check real GPS
    if (!geo.latitude || !geo.longitude || !location.latitude || !location.longitude) {
      return false;
    }
    const distance = calculateDistance(geo.latitude, geo.longitude, location.latitude, location.longitude);
    return distance <= LOCATION_THRESHOLD;
  };
  const getDistanceToLocation = (location: typeof locations[0]) => {
    if (!geo.latitude || !geo.longitude || !location.latitude || !location.longitude) {
      return null;
    }
    return calculateDistance(geo.latitude, geo.longitude, location.latitude, location.longitude);
  };
  const handleOpenMaps = (location: typeof locations[0]) => {
    if (!location.latitude || !location.longitude) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
    window.open(url, '_blank');
  };
  const startTimer = useCallback(() => {
    if (!timerStartTime && !allPuzzlesSolved && !hasCompletedBefore) {
      const now = Date.now();
      setTimerStartTime(now);
      setTimerRunning(true);
      toast('⏱️ Your time begins now — Good luck!', {
        position: 'top-center',
        duration: 4000,
        style: {
          fontSize: '1.25rem',
          fontWeight: '700',
          padding: '1.5rem 2rem',
          textAlign: 'center' as const,
        },
      });
    }
  }, [timerStartTime, allPuzzlesSolved, hasCompletedBefore]);

  const handleAnswerSubmit = async (locationId: string, answerIndex: number, freeTextAnswer?: string) => {
    if (!cityId) return;
    const result = await validateAnswer.mutateAsync({
      cityId,
      locationId,
      answerIndex,
      freeTextAnswer,
    });
    if (result.correct && result.clue_text) {
      setRevealedClues(prev => ({
        ...prev,
        [locationId]: result.clue_text!
      }));
    }
    // Track wrong attempts
    if (!result.correct) {
      setWrongAttempts(prev => ({
        ...prev,
        [locationId]: (prev[locationId] || 0) + 1,
      }));
    }
    // Stop timer and go to summary if this is the end location
    if (result.correct) {
      const currentLocation = locations?.find(l => l.id === locationId);
      if (currentLocation?.is_end_location && timerStartTime && !hasCompletedBefore) {
        // 🎉 Confetti celebration burst
        const duration = 4000;
        const end = Date.now() + duration;
        const colors = ['#ff0000', '#ff6600', '#ffcc00', '#33cc33', '#3399ff', '#9933ff', '#ff33cc'];
        const frame = () => {
          confetti({
            particleCount: 7,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.5 },
            colors,
          });
          confetti({
            particleCount: 7,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.5 },
            colors,
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
        const finalElapsed = Date.now() - timerStartTime;
        setTimerRunning(false);
        setTimerFinalTime(finalElapsed);
        if (cityId) {
          saveCompletion.mutate({ cityId, completionTimeMs: finalElapsed });
        }
        // Go directly to summary
        setTimeout(() => {
          setShowSummary(true);
          setSelectedLocationId(null);
        }, 2000);
      }
    }
    return result;
  };
  const handleLocationComplete = (locationId: string) => {
    setSelectedLocationId(null);
  };
  const handleGoToNextLocation = (currentLocation: typeof locations[0]) => {
    const nextLocation = locations?.find(l => l.sequence_order === currentLocation.sequence_order + 1);
    if (nextLocation) {
      setSelectedLocationId(nextLocation.id);
    } else {
      // No more locations, go back to list
      setSelectedLocationId(null);
    }
  };
  const selectedLocation = locations?.find(l => l.id === selectedLocationId);
  const firstLocation = locations?.find(l => l.sequence_order === 1);

  // Auto-start timer when first location detail is shown
  useEffect(() => {
    if (selectedLocation && firstLocation && selectedLocation.id === firstLocation.id) {
      const atLoc = isAtLocation(selectedLocation);
      const completed = completedLocationIds.has(selectedLocation.id);
      const unlocked = isLocationUnlocked(selectedLocation);
      if (unlocked && (atLoc || completed)) {
        startTimer();
      }
    }
  }, [selectedLocation, firstLocation, completedLocationIds, startTimer]);

  // Not purchased check
  if (!purchase?.hasPurchased && !playtestEnabled) {
    return <div className="min-h-screen pb-20">
        <Header />
        <main className="container py-6">
          <VintageCard variant="parchment">
            <VintageCardContent className="py-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold mb-2">Mystery Locked</h2>
              <p className="text-muted-foreground mb-4">
                Purchase this mystery to begin your investigation.
              </p>
              <Button onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </VintageCardContent>
          </VintageCard>
        </main>
        <MobileNav />
      </div>;
  }
  if (locationsLoading || progressLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }

  // Trail Summary view
  if (showSummary && timerFinalTime) {
    const puzzleLocations = locations?.filter(l => !l.is_intro_location) || [];
    const firstAttemptSolves = puzzleLocations.filter(l => !wrongAttempts[l.id]).length;
    return <div className="min-h-screen pb-20">
        <Header />
        <main className="container py-6">
          <TrailSummary
            cityName={city?.name || 'Mystery'}
            distanceKm={city?.distance_km ?? null}
            totalLocations={locations?.length || 0}
            puzzleLocations={puzzleLocations.length}
            firstAttemptSolves={firstAttemptSolves}
            completionTimeMs={timerFinalTime}
          />
        </main>
        <MobileNav />
      </div>;
  }

  // Viewing specific location
  if (selectedLocation) {
    const atLocation = isAtLocation(selectedLocation);
    const unlocked = isLocationUnlocked(selectedLocation);
    const completed = completedLocationIds.has(selectedLocation.id);
    return <div className="min-h-screen pb-20">
        {!hasCompletedBefore && <GameTimer isRunning={timerRunning} startTime={timerStartTime} finalTime={timerFinalTime} />}
        <Header />
        <main className="container py-6">
          <Button variant="ghost" onClick={() => setSelectedLocationId(null)} className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Locations
          </Button>

          {!unlocked ? <VintageCard variant="parchment">
              <VintageCardContent className="py-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Complete the previous location to unlock this one.
                </p>
              </VintageCardContent>
            </VintageCard> : !atLocation && !completed ? <VintageCard variant="parchment">
              <VintageCardContent className="py-8 text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-accent mx-auto" />
                <h2 className="font-display text-xl font-semibold">
                  Travel to {selectedLocation.name}
                </h2>
                <p className="text-muted-foreground">
                  You need to physically arrive at this location to access its content.
                </p>
                {geo.error && <p className="text-destructive text-sm">{geo.error}</p>}
                <div className="flex flex-col gap-2">
                  <Button onClick={() => handleOpenMaps(selectedLocation)}>
                    Open in Maps
                  </Button>
                  {playtestEnabled && <Button variant="outline" onClick={() => {
                    setPlaytestAtLocation(prev => new Set([...prev, selectedLocation.id]));
                    // Start timer if this is the first location
                    if (firstLocation && selectedLocation.id === firstLocation.id) {
                      startTimer();
                    }
                  }} className="text-accent border-accent hover:bg-accent hover:text-accent-foreground">
                      🎮 Playtest: I'm here
                    </Button>}
                </div>
              </VintageCardContent>
            </VintageCard> : <LocationDetail location={selectedLocation} isCompleted={completed} isLastLocation={selectedLocation.is_end_location} onAnswerSubmit={(answerIndex, freeTextAnswer) => handleAnswerSubmit(selectedLocation.id, answerIndex, freeTextAnswer)} onComplete={() => handleLocationComplete(selectedLocation.id)} onGoToNextLocation={() => handleGoToNextLocation(selectedLocation)} revealedClue={revealedClues[selectedLocation.id]} characters={selectedLocation.is_intro_location ? characters : undefined} />}
        </main>
        <MobileNav />
      </div>;
  }

  // Location list view
  return <div className="min-h-screen pb-20">
      {!hasCompletedBefore && <GameTimer isRunning={timerRunning} startTime={timerStartTime} finalTime={timerFinalTime} />}
      <Header />
      <main className="container py-6 space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/home')}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>

        <h1 className="font-display text-2xl font-bold">Your StoryTrail</h1>
        
        <div className="text-sm text-muted-foreground">
          {completedLocationIds.size} of {locations?.length || 0} locations completed
        </div>

        <OrnamentalDivider />

        <div className="space-y-4">
          {locations?.map(location => {
          const unlocked = isLocationUnlocked(location);
          const completed = completedLocationIds.has(location.id);
          const atLoc = isAtLocation(location);
          const distance = getDistanceToLocation(location);
          return <div key={location.id} onClick={() => unlocked && setSelectedLocationId(location.id)} className={unlocked ? 'cursor-pointer' : ''}>
                <LocationCard location={location} isUnlocked={unlocked} isCompleted={completed} isAtLocation={atLoc} distanceText={distance ? formatDistance(distance) : undefined} onNavigate={() => handleOpenMaps(location)} onPlaytestUnlock={() => {
              // For locked locations, completing previous unlocks this one
              const prevLocation = locations?.find(l => l.sequence_order === location.sequence_order - 1);
              if (prevLocation && !completedLocationIds.has(prevLocation.id)) {
                handleAnswerSubmit(prevLocation.id, -1); // -1 for playtest unlock
              }
            }} />
              </div>;
        })}
        </div>
      </main>
      <MobileNav />
    </div>;
}