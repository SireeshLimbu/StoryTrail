import { useNavigate } from 'react-router-dom';
import { useCities, useUserPurchase, useAddPurchase } from '@/hooks/useGameData';
import { useAuth } from '@/hooks/useAuth';
import { CityCard } from '@/components/CityCard';
import { Header, MobileNav } from '@/components/Navigation';
import { OrnamentalDivider } from '@/components/VintageCard';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient, useQuery } from '@tanstack/react-query';

export default function Home() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: cities, isLoading } = useCities();
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });
  // For now, we only have Vaxholm
  const vaxholmId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  const { data: purchase } = useUserPurchase(vaxholmId);
  const addPurchase = useAddPurchase();

  const handlePlaytestUnlock = async (cityId: string) => {
    await addPurchase.mutateAsync({
      cityId,
      stripePaymentId: 'playtest'
    });
  };

  const handleReplay = async (cityId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('city_id', cityId);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      toast.success('Restart successful! Your StoryTrail has been reset.', { position: 'top-center' });
    } catch (error) {
      console.error('Failed to reset progress:', error);
      toast.error('Failed to reset progress. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  return <div className="min-h-screen pb-20">
      <Header />
      
      <main className="container py-6 space-y-6">
        {/* Welcome + Hero Section */}
        {profile?.display_name && (
          <p className="text-2xl text-muted-foreground font-display">
            Welcome, <span className="font-semibold text-foreground">{profile.display_name}</span>
          </p>
        )}
        <div className="text-center space-y-4 py-4">
          <h1 className="font-display text-4xl font-bold">Story<span className="text-primary">Trail</span></h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Ready to walk the story?
          </p>
        </div>

        <OrnamentalDivider className="py-1" />

        {/* Available Mysteries */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4">Available StoryTrails</h2>
          <div className="space-y-4">
            {cities?.map(city => <CityCard key={city.id} city={city} isPurchased={purchase?.hasPurchased ?? false} onSelect={() => navigate(`/game/${city.id}`)} onPurchase={() => {
            alert('Stripe checkout coming soon!');
          }} onPlaytestUnlock={() => handlePlaytestUnlock(city.id)} onReplay={() => handleReplay(city.id)} />)}
          </div>
        </section>
      </main>

      <MobileNav />
    </div>;
}