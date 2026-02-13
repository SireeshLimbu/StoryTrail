import { useState, useEffect } from 'react';
import type { Location, Character } from '@/lib/types';
import { VintageCard, VintageCardContent, VintageCardHeader, VintageCardTitle, OrnamentalDivider } from './VintageCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MapPin, Lock, Check, Navigation, AlertCircle, Volume2, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLAYTEST_ENABLED } from '@/lib/playtest';
import { CharacterGallery } from './CharacterGallery';
import { LocationVoiceAgent } from './LocationVoiceAgent';
interface LocationCardProps {
  location: Location;
  isUnlocked: boolean;
  isCompleted: boolean;
  isAtLocation: boolean;
  distanceText?: string;
  onNavigate?: () => void;
  onPlaytestUnlock?: () => void;
}

export function LocationCard({ 
  location, 
  isUnlocked, 
  isCompleted, 
  isAtLocation,
  distanceText,
  onNavigate,
  onPlaytestUnlock,
}: LocationCardProps) {
  return (
    <VintageCard 
      variant={isCompleted ? 'elegant' : 'parchment'} 
      className={cn(
        'transition-all animate-fade-in',
        !isUnlocked && 'opacity-60',
        isCompleted && 'border-accent'
      )}
    >
      <VintageCardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded">
                Location {location.sequence_order}
              </span>
              {isCompleted && (
                <span className="bg-accent text-accent-foreground text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                  <Check className="h-3 w-3" /> Completed
                </span>
              )}
            </div>
            <VintageCardTitle className="text-lg">{location.name}</VintageCardTitle>
          </div>
          <div className="flex-shrink-0">
            {!isUnlocked ? (
              <Lock className="h-5 w-5 text-muted-foreground" />
            ) : isAtLocation ? (
              <MapPin className="h-5 w-5 text-accent" />
            ) : (
              <Navigation className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </VintageCardHeader>
      <VintageCardContent className="pt-0 space-y-3">
        {location.image_url && (
          <div className="rounded-md overflow-hidden">
            <img 
              src={location.image_url} 
              alt={location.name}
              className={cn(
                "w-full h-24 object-cover",
                !isUnlocked && 'grayscale'
              )}
              loading="lazy"
            />
          </div>
        )}
        {!isUnlocked ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground italic">
              Complete the previous location to unlock this one.
            </p>
            {PLAYTEST_ENABLED && onPlaytestUnlock && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onPlaytestUnlock}
                className="text-accent border-accent hover:bg-accent hover:text-accent-foreground"
              >
                🎮 Playtest: Unlock
              </Button>
            )}
          </div>
        ) : (
          <>
            {distanceText && !isAtLocation && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Navigation className="h-4 w-4" />
                {distanceText} away
              </p>
            )}
            {onNavigate && !isAtLocation && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={onNavigate}
                className="w-full"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Navigate to location
              </Button>
            )}
            {PLAYTEST_ENABLED && !isAtLocation && onPlaytestUnlock && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onPlaytestUnlock}
                className="w-full text-accent border-accent hover:bg-accent hover:text-accent-foreground"
              >
                🎮 Playtest: I'm here
              </Button>
            )}
          </>
        )}
      </VintageCardContent>
    </VintageCard>
  );
}

interface LocationDetailProps {
  location: Location;
  isCompleted: boolean;
  isLastLocation?: boolean;
  onAnswerSubmit: (answerIndex: number, freeTextAnswer?: string) => Promise<{ correct: boolean; clue_text: string | null }>;
  onComplete: () => void;
  onGoToNextLocation?: () => void;
  revealedClue?: string | null;
  characters?: Character[];
}

export function LocationDetail({ 
  location, 
  isCompleted,
  isLastLocation = false,
  onAnswerSubmit, 
  onComplete,
  onGoToNextLocation,
  revealedClue,
  characters 
}: LocationDetailProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [freeTextInput, setFreeTextInput] = useState('');
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localClue, setLocalClue] = useState<string | null>(revealedClue || null);
  const [isReadingRiddle, setIsReadingRiddle] = useState(false);
  const [isReadingClue, setIsReadingClue] = useState(false);

  const readClueAloud = (clueText: string) => {
    if (!clueText) return;

    window.speechSynthesis.cancel();
    
    const fullText = `That's correct! ${clueText}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))
    ) || voices.find(v => v.lang.startsWith('en'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsReadingClue(true);
    utterance.onend = () => setIsReadingClue(false);
    utterance.onerror = () => setIsReadingClue(false);

    window.speechSynthesis.speak(utterance);
  };

  const buildRiddleText = () => {
    if (!location.riddle_text) return '';
    let text = location.riddle_text + ' ';
    if (location.answer_options && Array.isArray(location.answer_options)) {
      const filledOptions = location.answer_options.filter((o: string) => o && o.trim());
      text += 'Your options are: ';
      filledOptions.forEach((option: string, index: number) => {
        text += `Option ${index + 1}: ${option}. `;
      });
    }
    return text;
  };

  const startReadingRiddle = () => {
    const text = buildRiddleText();
    if (!text) return;

    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))
    ) || voices.find(v => v.lang.startsWith('en'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsReadingRiddle(true);
    utterance.onend = () => setIsReadingRiddle(false);
    utterance.onerror = () => setIsReadingRiddle(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopReadingRiddle = () => {
    window.speechSynthesis.cancel();
    setIsReadingRiddle(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Preload voices
  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  const handleSubmit = async () => {
    const isFreeText = location.answer_type === 'free_text';
    
    if (!isFreeText && selectedAnswer === null) return;
    if (isFreeText && !freeTextInput.trim()) return;
    
    setIsSubmitting(true);
    setShowError(false);
    
    try {
      const answerIndex = isFreeText ? -1 : parseInt(selectedAnswer!, 10);
      const result = await onAnswerSubmit(answerIndex, isFreeText ? freeTextInput.trim() : undefined);
      
      if (result.correct) {
        setLocalClue(result.clue_text);
        if (result.clue_text) {
          setTimeout(() => readClueAloud(result.clue_text!), 300);
        }
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIntroComplete = async () => {
    setIsSubmitting(true);
    try {
      await onAnswerSubmit(-1); // -1 for intro locations
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  const showClue = isCompleted || localClue;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Location Header */}
      <div className="text-center">
        <span className="bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded">
          Location {location.sequence_order}
        </span>
        <h1 className="font-display text-2xl font-bold mt-3">{location.name}</h1>
      </div>

      {/* Location Image */}
      {location.image_url && (
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img 
            src={location.image_url} 
            alt={location.name}
            className="w-full h-72 sm:h-96 object-cover object-top"
          />
        </div>
      )}

      {/* Voice Agent */}
      <LocationVoiceAgent 
        location={location} 
        isCompleted={isCompleted} 
      />

      {/* Intro Text */}
      <VintageCard variant="parchment">
        <VintageCardContent className="pt-6">
          <p className="text-base leading-relaxed whitespace-pre-line">{location.intro_text}</p>
        </VintageCardContent>
      </VintageCard>

      {/* Reveal Image - shown between intro text and question for reveal locations */}
      {location.is_reveal && location.reveal_image_url && !location.is_intro_location && (
        <div className="rounded-lg overflow-hidden shadow-lg border border-accent/30">
          <img 
            src={location.reveal_image_url} 
            alt="Reveal evidence"
            className="w-full object-contain"
          />
        </div>
      )}

      {/* Riddle Section */}
      {location.riddle_text && !location.is_intro_location && (
        <>
          <OrnamentalDivider />
          
          {!showClue ? (
            <VintageCard variant="elegant">
              <VintageCardHeader>
                <div className="flex items-center justify-between gap-2">
                  <VintageCardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-accent" />
                    The Question
                  </VintageCardTitle>
                  {!isReadingRiddle ? (
                    <Button 
                      onClick={startReadingRiddle} 
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Volume2 className="h-4 w-4" />
                      Read
                    </Button>
                  ) : (
                    <Button 
                      onClick={stopReadingRiddle}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Square className="h-4 w-4" />
                      Stop
                    </Button>
                  )}
                </div>
              </VintageCardHeader>
              <VintageCardContent className="space-y-4">
                <p className="text-base italic whitespace-pre-line">{location.riddle_text}</p>
                
                {location.answer_type === 'free_text' ? (
                  <div className="space-y-3">
                    <Input
                      value={freeTextInput}
                      onChange={(e) => {
                        setFreeTextInput(e.target.value);
                        setShowError(false);
                      }}
                      placeholder="Type your answer here..."
                      className="text-base"
                    />
                  </div>
                ) : (
                  <RadioGroup 
                    value={selectedAnswer || ''} 
                    onValueChange={(value) => {
                      setSelectedAnswer(value);
                      setShowError(false);
                    }}
                    className="space-y-3"
                  >
                    {location.answer_options.map((option, index) => {
                      if (!option || (typeof option === 'string' && !option.trim())) return null;
                      return (
                      <div 
                        key={index}
                        className={cn(
                          'flex items-center space-x-3 p-3 rounded-md border transition-colors',
                          selectedAnswer === index.toString() 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label 
                          htmlFor={`option-${index}`} 
                          className="flex-1 cursor-pointer text-base"
                        >
                          {option}
                        </Label>
                      </div>
                      );
                    })}
                  </RadioGroup>
                )}

                {showError && (
                  <p className="text-destructive text-sm font-medium animate-fade-in">
                    That's not quite right. Try again!
                  </p>
                )}

                <Button 
                  onClick={handleSubmit} 
                  disabled={(location.answer_type === 'free_text' ? !freeTextInput.trim() : selectedAnswer === null) || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Checking...' : 'Submit Answer'}
                </Button>
              </VintageCardContent>
            </VintageCard>
          ) : (
            /* Clue Revealed */
            <VintageCard variant="elegant" className="border-accent">
              <VintageCardHeader>
                <VintageCardTitle className="text-lg flex items-center gap-2 text-accent">
                  <Check className="h-5 w-5" />
                  {isLastLocation ? 'Your StoryTrail successfully finished!' : 'Next location un-locked!'}
                </VintageCardTitle>
              </VintageCardHeader>
              <VintageCardContent className="space-y-4">
                <p className="text-base leading-relaxed whitespace-pre-line">{localClue || revealedClue}</p>
                {!isLastLocation && (
                  <Button 
                    onClick={onGoToNextLocation} 
                    className="w-full"
                  >
                    Go to Next Location
                  </Button>
                )}
              </VintageCardContent>
            </VintageCard>
          )}
        </>
      )}

      {/* Intro location - show characters and mark as read */}
      {location.is_intro_location && (
        <>
          {characters && characters.length > 0 && !isLastLocation && (
            <>
              <OrnamentalDivider />
              <CharacterGallery characters={characters} />
            </>
          )}
          
          {!isLastLocation && (
            isCompleted ? (
              <Button 
                onClick={onGoToNextLocation} 
                className="w-full mt-4"
              >
                Go to Next Location
              </Button>
            ) : (
              <Button 
                onClick={handleIntroComplete} 
                disabled={isSubmitting}
                className="w-full mt-4"
              >
                {isSubmitting ? 'Saving...' : 'Continue to Next Location'}
              </Button>
            )
          )}
        </>
      )}
    </div>
  );
}
