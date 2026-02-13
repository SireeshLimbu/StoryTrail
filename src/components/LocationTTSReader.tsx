import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Square, Loader2, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Location } from '@/lib/types';

interface LocationTTSReaderProps {
  location: Location;
  isCompleted: boolean;
}

export function LocationTTSReader({ location, isCompleted }: LocationTTSReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      // Filter to English voices for better UX
      const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
      setVoices(englishVoices.length > 0 ? englishVoices : availableVoices);
      
      // Auto-select best voice if none selected
      if (!selectedVoice && availableVoices.length > 0) {
        const preferred = availableVoices.find(v => 
          v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))
        ) || availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
        setSelectedVoice(preferred);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  const buildTextToRead = () => {
    let text = '';
    
    if (location.intro_text) {
      text += location.intro_text + '\n\n';
    }
    
    if (location.riddle_text && !isCompleted && !location.is_intro_location) {
      text += 'Now, here is your riddle: ' + location.riddle_text + '\n\n';
      
      if (location.answer_options && Array.isArray(location.answer_options)) {
        text += 'Your options are: ';
        location.answer_options.forEach((option, index) => {
          text += `Option ${index + 1}: ${option}. `;
        });
      }
    }
    
    return text.trim();
  };

  const startReading = () => {
    const textToRead = buildTextToRead();
    if (!textToRead) return;

    window.speechSynthesis.cancel();
    setIsLoading(true);
    
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utteranceRef.current = utterance;
    
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopReading = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const getVoiceLabel = (voice: SpeechSynthesisVoice) => {
    const name = voice.name.replace(/^(Microsoft|Google)\s+/i, '');
    return `${name} (${voice.lang})`;
  };

  return (
    <div className="flex gap-1 flex-1">
      {!isPlaying ? (
        <Button 
          onClick={startReading} 
          disabled={isLoading}
          variant="outline"
          className="gap-2 flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4" />
              Read Aloud
            </>
          )}
        </Button>
      ) : (
        <Button 
          onClick={stopReading}
          variant="outline"
          className="gap-2 flex-1"
        >
          <Square className="h-4 w-4" />
          Stop
        </Button>
      )}
      
      {voices.length > 1 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-60 overflow-y-auto">
            {voices.map((voice, index) => (
              <DropdownMenuItem
                key={`${voice.name}-${index}`}
                onClick={() => setSelectedVoice(voice)}
                className={selectedVoice?.name === voice.name ? 'bg-accent' : ''}
              >
                {getVoiceLabel(voice)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
