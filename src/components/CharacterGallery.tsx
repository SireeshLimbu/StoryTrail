import { useState, useEffect, useRef } from 'react';
import type { Character } from '@/lib/types';
import { VintageCard, VintageCardContent, VintageCardHeader, VintageCardTitle } from './VintageCard';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, Volume2, Square } from 'lucide-react';

interface CharacterGalleryProps {
  characters: Character[];
}

export function CharacterGallery({ characters }: CharacterGalleryProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isReading, setIsReading] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const buildCharacterText = () => {
    if (!characters.length) return '';
    
    let text = 'Meet the characters. ';
    characters.forEach((char, index) => {
      text += `${char.name}. `;
      if (char.bio) {
        text += `${char.bio} `;
      }
      if (index < characters.length - 1) {
        text += 'Next character. ';
      }
    });
    return text;
  };

  const startReading = () => {
    const text = buildCharacterText();
    if (!text) return;

    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to use a natural-sounding English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))
    ) || voices.find(v => v.lang.startsWith('en'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopReading = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
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

  if (!characters.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-semibold">Meet the Characters</h2>
        {!isReading ? (
          <Button 
            onClick={startReading} 
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Volume2 className="h-4 w-4" />
            Read Characters
          </Button>
        ) : (
          <Button 
            onClick={stopReading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Square className="h-4 w-4" />
            Stop
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {characters.filter(c => !c.is_suspect).map((character) => (
          <CharacterProfileCard 
            key={character.id} 
            character={character} 
            onClick={() => setSelectedCharacter(character)}
          />
        ))}
      </div>

      {/* Character Detail Modal */}
      <Dialog open={!!selectedCharacter} onOpenChange={(open) => !open && setSelectedCharacter(null)}>
        <DialogContent className="max-w-2xl w-[90vw] p-0 overflow-hidden border-0">
          {selectedCharacter && (
            <CharacterDetailModal character={selectedCharacter} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface CharacterProfileCardProps {
  character: Character;
  onClick: () => void;
}

function CharacterProfileCard({ character, onClick }: CharacterProfileCardProps) {
  return (
    <VintageCard 
      variant="parchment" 
      className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <VintageCardHeader className="pb-2 flex-shrink-0">
        {/* Tap to Enlarge Caption */}
        <p className="text-sm text-secondary-foreground/70 text-center mb-2 italic">Tap to Enlarge</p>
        
        {/* Profile Picture */}
        <div className="w-full aspect-square rounded-lg bg-secondary flex items-center justify-center overflow-hidden mb-3">
          {character.image_url ? (
            <img 
              src={character.image_url} 
              alt={character.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-12 w-12 text-muted-foreground" />
          )}
        </div>
        <VintageCardTitle className="text-base text-center">{character.name}</VintageCardTitle>
      </VintageCardHeader>
      
      <VintageCardContent className="pt-0 flex-1 flex flex-col">
        {/* Bio Data */}
        <div className="flex flex-wrap justify-center gap-2 text-xs mb-3">
          {character.age && (
            <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">Age {character.age}</span>
          )}
          {character.gender && (
            <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{character.gender}</span>
          )}
          {character.height && (
            <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{character.height}</span>
          )}
        </div>
        
        {/* Bio Box - truncated */}
        {character.bio && (
          <div className="flex-1 bg-secondary/50 rounded-md p-3 border border-border">
            <p className="text-sm text-secondary-foreground line-clamp-4">{character.bio}</p>
          </div>
        )}
      </VintageCardContent>
    </VintageCard>
  );
}

interface CharacterDetailModalProps {
  character: Character;
}

function CharacterDetailModal({ character }: CharacterDetailModalProps) {
  return (
    <VintageCard variant="parchment" className="border-0 shadow-none">
      <VintageCardHeader className="pb-4">
        {/* Profile Picture - larger in modal */}
        <div className="w-64 h-64 mx-auto rounded-lg bg-secondary flex items-center justify-center overflow-hidden mb-4">
          {character.image_url ? (
            <img 
              src={character.image_url} 
              alt={character.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-24 w-24 text-muted-foreground" />
          )}
        </div>
        <VintageCardTitle className="text-2xl text-center">{character.name}</VintageCardTitle>
      </VintageCardHeader>
      
      <VintageCardContent className="pt-0 px-8 pb-8">
        {/* Bio Data */}
        <div className="flex flex-wrap justify-center gap-3 text-base mb-6">
          {character.age && (
            <span className="bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full">Age {character.age}</span>
          )}
          {character.gender && (
            <span className="bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full">{character.gender}</span>
          )}
          {character.height && (
            <span className="bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full">{character.height}</span>
          )}
        </div>
        
        {/* Full Bio - no truncation */}
        {character.bio && (
          <div className="bg-secondary/50 rounded-md p-6 border border-border max-h-80 overflow-y-auto">
            <p className="text-base text-secondary-foreground leading-relaxed">{character.bio}</p>
          </div>
        )}
      </VintageCardContent>
    </VintageCard>
  );
}
