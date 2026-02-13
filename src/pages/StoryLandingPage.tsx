import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCity, useLocations, useCharacters } from '@/hooks/useGameData';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { VintageCard, VintageCardContent, OrnamentalDivider } from '@/components/VintageCard';
import { ArrowLeft, ArrowRight, MapPin, Users, Route, Loader2, Footprints, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StoryLandingPage() {
  const { cityId } = useParams<{ cityId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: city, isLoading: cityLoading } = useCity(cityId);
  const { data: locations } = useLocations(cityId);
  const { data: characters } = useCharacters(cityId);

  if (cityLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Story not found</p>
      </div>
    );
  }

  const locationCount = locations?.length ?? 0;
  const characterCount = characters?.length ?? 0;

  const handleSignUp = () => {
    navigate(`/login?mode=signup&redirect=/home`);
  };

  const handleLogin = () => {
    navigate(`/login?redirect=/home`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="container flex items-center justify-between py-6 px-6">
        <Link to="/stories" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-display text-sm">
          <ArrowLeft className="h-4 w-4" />
          All Stories
        </Link>
        <Link to="/" className="font-display text-xl font-bold">
          Story<span className="text-primary">Trail</span>
        </Link>
        <div className="w-16" />
      </nav>

      {/* Full-width Hero Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden"
      >
        {city.image_url ? (
          <img
            src={city.image_url}
            alt={city.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-primary mb-3">
            <MapPin className="h-5 w-5" />
            <span className="font-display text-sm tracking-wide uppercase">StoryTrail</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold drop-shadow-lg">{city.name}</h1>
        </div>
      </motion.div>

      <main className="container px-6 pb-20 max-w-2xl mx-auto">

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-6 py-6"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Route className="h-4 w-4 text-primary" />
            <span className="text-sm">{locationCount} locations</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm">{characterCount} characters</span>
          </div>
          {(city as any).distance_km && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Footprints className="h-4 w-4 text-primary" />
              <span className="text-sm">{(city as any).distance_km} km</span>
            </div>
          )}
          {city.price_cents > 0 ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Coins className="h-4 w-4 text-primary" />
              <span className="text-sm">{(city.price_cents / 100).toFixed(0)} SEK</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Coins className="h-4 w-4 text-primary" />
              <span className="text-sm">Free</span>
            </div>
          )}
        </motion.div>

        <OrnamentalDivider />

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <VintageCard variant="parchment" className="mt-8">
            <VintageCardContent className="py-6">
              <p className="font-bold mb-4">About this Story</p>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                {((city as any).story_description || city.description || '').split('\n').map((line: string, i: number) => {
                  if (line.startsWith('##')) {
                    return <p key={i} className="font-bold text-foreground">{line.replace(/^##\s?/, '')}</p>;
                  }
                  if (line.trim() === '') return <div key={i} className="h-2" />;
                  return <p key={i} className="whitespace-pre-line">{line}</p>;
                })}
              </div>
            </VintageCardContent>
          </VintageCard>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <VintageCard variant="parchment" className="mt-4">
            <VintageCardContent className="py-6">
              <p className="font-bold mb-4">How it works</p>
              <ol className="space-y-3 text-muted-foreground">
                {(Array.isArray((city as any).how_it_works) && (city as any).how_it_works.length > 0
                  ? (city as any).how_it_works
                  : [
                      'Create your free account to get started',
                      'Travel to each location using the map',
                      'Solve riddles to unlock clues and progress',
                      'Piece together the mystery as you explore',
                    ]
                ).map((step: string, i: number) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </VintageCardContent>
          </VintageCard>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 space-y-3"
        >
          {user ? (
            <Button
              onClick={() => navigate(`/game/${city.id}`)}
              className="w-full bg-gradient-warm shadow-warm hover:opacity-90 transition-opacity font-display text-lg py-6"
            >
              Start the Story
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <>
              <Button
                onClick={handleSignUp}
                className="w-full bg-gradient-warm shadow-warm hover:opacity-90 transition-opacity font-display text-lg py-6"
              >
                Sign Up to Walk The Story
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <button onClick={handleLogin} className="text-primary hover:underline font-medium">
                  Sign in
                </button>
              </p>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
