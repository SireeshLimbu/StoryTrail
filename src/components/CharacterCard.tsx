import type { Character } from '@/lib/types';
import { VintageCard, VintageCardContent, VintageCardHeader, VintageCardTitle } from './VintageCard';
import { User } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  onClick?: () => void;
}

export function CharacterCard({ character, onClick }: CharacterCardProps) {
  return (
    <VintageCard 
      variant="parchment" 
      className="cursor-pointer hover:shadow-lg transition-shadow animate-fade-in"
      onClick={onClick}
    >
      <VintageCardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
            {character.image_url ? (
              <img 
                src={character.image_url} 
                alt={character.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <VintageCardTitle className="text-lg">{character.name}</VintageCardTitle>
            <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
              {character.age && <span>Age {character.age}</span>}
              {character.gender && <span>• {character.gender}</span>}
              {character.height && <span>• {character.height}</span>}
            </div>
          </div>
        </div>
      </VintageCardHeader>
      <VintageCardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3">{character.bio}</p>
      </VintageCardContent>
    </VintageCard>
  );
}

interface CharacterDetailProps {
  character: Character;
}

export function CharacterDetail({ character }: CharacterDetailProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col items-center text-center">
        <div className="h-32 w-32 rounded-full bg-secondary flex items-center justify-center overflow-hidden mb-4 vintage-border">
          {character.image_url ? (
            <img 
              src={character.image_url} 
              alt={character.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-16 w-16 text-muted-foreground" />
          )}
        </div>
        <h1 className="font-display text-2xl font-bold">{character.name}</h1>
        <div className="flex flex-wrap gap-3 mt-2 text-sm justify-center">
          {character.age && (
            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full">Age {character.age}</span>
          )}
          {character.gender && (
            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full">{character.gender}</span>
          )}
          {character.height && (
            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full">{character.height}</span>
          )}
        </div>
      </div>
      
      <VintageCard variant="parchment">
        <VintageCardContent className="pt-6">
          <p className="text-base leading-relaxed">{character.bio}</p>
        </VintageCardContent>
      </VintageCard>
    </div>
  );
}
