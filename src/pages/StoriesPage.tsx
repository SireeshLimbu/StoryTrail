import { useNavigate } from 'react-router-dom';
import { useCities } from '@/hooks/useGameData';
import { VintageCard, VintageCardContent, VintageCardHeader, VintageCardTitle, OrnamentalDivider } from '@/components/VintageCard';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StoriesPage() {
  const navigate = useNavigate();
  const { data: cities, isLoading } = useCities();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Simple nav */}
      <nav className="container flex items-center justify-between py-6 px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-display text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <Link to="/" className="font-display text-xl font-bold">
          Story<span className="text-primary">Trail</span>
        </Link>
        <div className="w-16" /> {/* spacer */}
      </nav>

      <main className="container px-6 pb-16 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3 py-8"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold">
            Available Story<span className="text-gradient">Trails</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Choose a story to explore
          </p>
        </motion.div>

        <OrnamentalDivider className="py-1" />

        <div className="space-y-4 max-w-lg mx-auto">
          {cities?.map((city, index) => (
            <motion.div
              key={city.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <VintageCard variant="parchment" className="overflow-hidden">
                {city.image_url && (
                  <div className="w-full h-36 sm:h-44 overflow-hidden">
                    <img
                      src={city.image_url}
                      alt={city.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <VintageCardHeader>
                  <VintageCardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-accent" />
                    {city.name}
                  </VintageCardTitle>
                </VintageCardHeader>
                <VintageCardContent className="space-y-4">
                  <p className="text-muted-foreground whitespace-pre-line leading-tight">
                    {(city as any).tagline || city.description}
                  </p>
                  <Button
                    onClick={() => navigate(`/story/${city.id}`)}
                    className="w-full bg-gradient-warm shadow-warm hover:opacity-90 transition-opacity font-display"
                  >
                    Explore the Story
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </VintageCardContent>
              </VintageCard>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
