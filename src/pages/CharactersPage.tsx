import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCharacters } from '@/hooks/useGameData';
import { Header, MobileNav } from '@/components/Navigation';
import { CharacterCard, CharacterDetail } from '@/components/CharacterCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { OrnamentalDivider } from '@/components/VintageCard';

// Default to Vaxholm city
const VAXHOLM_CITY_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

export default function CharactersPage() {
  const navigate = useNavigate();
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  
  const { data: characters, isLoading } = useCharacters(VAXHOLM_CITY_ID);

  const selectedCharacter = characters?.find(c => c.id === selectedCharacterId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Character detail view
  if (selectedCharacter) {
    return (
      <div className="min-h-screen pb-20">
        <Header />
        <main className="container py-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedCharacterId(null)}
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Characters
          </Button>
          <CharacterDetail character={selectedCharacter} />
        </main>
        <MobileNav />
      </div>
    );
  }

  // Character list view
  return (
    <div className="min-h-screen pb-20">
      <Header />
      <main className="container py-6 space-y-4">
        <h1 className="font-display text-2xl font-bold">Characters</h1>
        <p className="text-muted-foreground">
          Learn about the main characters in story, all of them have important roles to play.
        </p>

        <OrnamentalDivider />

        <div className="space-y-4">
          {characters?.filter(c => !c.is_suspect).map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onClick={() => setSelectedCharacterId(character.id)}
            />
          ))}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
