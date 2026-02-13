import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { VintageCard, VintageCardContent, VintageCardHeader, VintageCardTitle, OrnamentalDivider } from './VintageCard';
import { Button } from '@/components/ui/button';
import { formatTime } from './GameTimer';
import { MapPin, CheckCircle, Target, Timer, Trophy, Home } from 'lucide-react';

interface TrailSummaryProps {
  cityName: string;
  distanceKm: number | null;
  totalLocations: number;
  puzzleLocations: number;
  firstAttemptSolves: number;
  completionTimeMs: number;
}

export function TrailSummary({
  cityName,
  distanceKm,
  totalLocations,
  puzzleLocations,
  firstAttemptSolves,
  completionTimeMs,
}: TrailSummaryProps) {
  const navigate = useNavigate();
  const accuracy = puzzleLocations > 0 ? Math.round((firstAttemptSolves / puzzleLocations) * 100) : 0;

  // Celebration confetti on mount
  useEffect(() => {
    const colors = ['#C9A24D', '#ff6600', '#ffcc00', '#33cc33', '#3399ff', '#9933ff', '#ff33cc'];
    
    // Initial big burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors,
    });

    // Staggered side cannons
    const timeouts = [300, 600, 1200, 2000].map((delay) =>
      setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.65 },
          colors,
        });
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.65 },
          colors,
        });
      }, delay)
    );

    // Star burst at 1.5s
    const starTimeout = setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 360,
        startVelocity: 30,
        ticks: 80,
        origin: { x: 0.5, y: 0.3 },
        colors,
        shapes: ['star'],
        scalar: 1.2,
      });
    }, 1500);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(starTimeout);
    };
  }, []);

  const stats = [
    {
      icon: MapPin,
      label: 'Distance walked',
      value: distanceKm ? `${distanceKm} km` : '—',
    },
    {
      icon: CheckCircle,
      label: 'Locations visited',
      value: `${totalLocations}`,
    },
    {
      icon: Target,
      label: 'Solved on first attempt',
      value: `${firstAttemptSolves} / ${puzzleLocations}`,
    },
    {
      icon: Trophy,
      label: 'Accuracy',
      value: `${accuracy}%`,
    },
    {
      icon: Timer,
      label: 'Total time',
      value: formatTime(completionTimeMs),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-md mx-auto">
      <div className="text-center space-y-2">
        <span className="text-4xl">🎉</span>
        <h1 className="font-display text-2xl font-bold">StoryTrail Complete!</h1>
        <p className="text-muted-foreground">
          You finished the {cityName} mystery
        </p>
      </div>

      <OrnamentalDivider />

      <VintageCard variant="elegant" className="border-accent">
        <VintageCardHeader>
          <VintageCardTitle className="text-lg text-center">Your Walk Summary</VintageCardTitle>
        </VintageCardHeader>
        <VintageCardContent className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <stat.icon className="h-5 w-5 text-accent" />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <span className="font-display font-semibold text-foreground">{stat.value}</span>
            </div>
          ))}
        </VintageCardContent>
      </VintageCard>

      <div className="space-y-3">
        <Button onClick={() => navigate('/leaderboard')} className="w-full" variant="default">
          <Trophy className="h-4 w-4 mr-2" />
          View Leaderboard
        </Button>
        <Button onClick={() => navigate('/home')} variant="outline" className="w-full">
          <Home className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
