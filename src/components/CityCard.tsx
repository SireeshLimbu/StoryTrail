import type { City } from '@/lib/types';
import { VintageCard, VintageCardContent, VintageCardHeader, VintageCardTitle } from './VintageCard';
import { Button } from '@/components/ui/button';
import { MapPin, Lock, Check, RefreshCw } from 'lucide-react';
import { usePlaytestSetting } from '@/hooks/usePlaytestSetting';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface CityCardProps {
  city: City;
  isPurchased: boolean;
  onSelect: () => void;
  onPurchase: () => void;
  onPlaytestUnlock?: () => void;
  onReplay?: () => void;
}

export function CityCard({ city, isPurchased, onSelect, onPurchase, onPlaytestUnlock, onReplay }: CityCardProps) {
  const { data: playtestEnabled } = usePlaytestSetting();
  const priceDisplay = city.price_cents > 0 
    ? `€${(city.price_cents / 100).toFixed(2)}` 
    : 'Free';

  return (
    <VintageCard variant="parchment" className="animate-fade-in overflow-hidden">
      {city.image_url && (
        <div className="w-full h-36 sm:h-44 overflow-hidden">
          <img
            src={city.image_url}
            alt={city.name}
            className="w-full h-full object-cover object-[center_30%]"
          />
        </div>
      )}
      <VintageCardHeader>
        <div className="flex items-start justify-between">
          <div>
            <VintageCardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" />
              {city.name}
            </VintageCardTitle>
          </div>
          <div className="flex flex-col items-end gap-2">
            {isPurchased ? (
              <span className="bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                <Check className="h-3 w-3" /> Purchased
              </span>
            ) : (
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                {priceDisplay}
              </span>
            )}
            {isPurchased && onReplay && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded flex items-center gap-1 hover:opacity-80 transition-opacity">
                    <RefreshCw className="h-3 w-3" />
                    Replay
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Restart {city.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will delete all your progress for {city.name}. All locations will be locked again and you'll start from the beginning. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onReplay}>
                      Yes, restart
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </VintageCardHeader>
      <VintageCardContent className="space-y-4">
        <p className="text-muted-foreground whitespace-pre-line leading-tight">{city.description}</p>
        
        {isPurchased ? (
          <Button onClick={onSelect} className="w-full">
            Continue StoryTrail
          </Button>
        ) : (
          <div className="space-y-2">
            <Button onClick={onPurchase} className="w-full">
              <Lock className="h-4 w-4 mr-2" />
              Sign Up
            </Button>
            {playtestEnabled && onPlaytestUnlock && (
              <Button 
                variant="outline" 
                onClick={onPlaytestUnlock}
                className="w-full text-accent border-accent hover:bg-accent hover:text-accent-foreground"
              >
                🎮 Playtest: Unlock Free
              </Button>
            )}
          </div>
        )}
      </VintageCardContent>
    </VintageCard>
  );
}
