import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { City, Character, Location, UserProgress, UserPurchase } from '@/lib/types';

export function useCities() {
  return useQuery({
    queryKey: ['cities'],
    queryFn: async (): Promise<City[]> => {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('is_published', true)
        .order('display_order')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useCity(cityId: string | undefined) {
  return useQuery({
    queryKey: ['city', cityId],
    queryFn: async (): Promise<City | null> => {
      if (!cityId) return null;
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('id', cityId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!cityId,
  });
}

export function useCharacters(cityId: string | undefined) {
  return useQuery({
    queryKey: ['characters', cityId],
    queryFn: async (): Promise<Character[]> => {
      if (!cityId) return [];
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('city_id', cityId)
        .order('display_order');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!cityId,
  });
}

export function useLocations(cityId: string | undefined) {
  return useQuery({
    queryKey: ['locations', cityId],
    queryFn: async (): Promise<Location[]> => {
      if (!cityId) return [];
      // Use the public view that excludes sensitive columns (correct_answer_index, clue_text)
      const { data, error } = await supabase
        .from('locations_public')
        .select('*')
        .eq('city_id', cityId)
        .order('sequence_order');
      
      if (error) throw error;
      return (data || []).map(loc => ({
        ...loc,
        // These are hidden server-side, set to null on client
        correct_answer_index: null,
        clue_text: null,
        answer_type: (loc as any).answer_type || 'multiple_choice',
        is_reveal: (loc as any).is_reveal || false,
        reveal_image_url: (loc as any).reveal_image_url || null,
        is_end_location: (loc as any).is_end_location || false,
        answer_options: Array.isArray(loc.answer_options) 
          ? loc.answer_options as string[]
          : JSON.parse(loc.answer_options as string || '[]'),
      }));
    },
    enabled: !!cityId,
  });
}

export function useUserProgress(cityId: string | undefined) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-progress', cityId, user?.id],
    queryFn: async (): Promise<UserProgress[]> => {
      if (!cityId || !user) return [];
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('city_id', cityId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!cityId && !!user,
  });
}

export function useUserPurchase(cityId: string | undefined) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-purchase', cityId, user?.id],
    queryFn: async (): Promise<{ hasPurchased: boolean } | null> => {
      if (!cityId || !user) return null;
      // Use secure RPC function instead of direct table access
      const { data, error } = await supabase
        .rpc('has_purchased_city', { _city_id: cityId });
      
      if (error) throw error;
      return { hasPurchased: data === true };
    },
    enabled: !!cityId && !!user,
  });
}

export function useValidateAnswer() {
  const { user, session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cityId, locationId, answerIndex, freeTextAnswer }: { 
      cityId: string; 
      locationId: string; 
      answerIndex: number;
      freeTextAnswer?: string;
    }): Promise<{ correct: boolean; clue_text: string | null }> => {
      if (!user || !session?.access_token) throw new Error('Must be logged in');
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-answer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ cityId, locationId, answerIndex, freeTextAnswer }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to validate answer');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-progress', variables.cityId] });
    },
  });
}

export function useTrailCompletion(cityId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['trail-completion', cityId, user?.id],
    queryFn: async () => {
      if (!user || !cityId) return null;
      const { data, error } = await supabase
        .from('trail_completions')
        .select('*')
        .eq('user_id', user.id)
        .eq('city_id', cityId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!cityId,
  });
}

export function useSaveTrailCompletion() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ cityId, completionTimeMs }: { cityId: string; completionTimeMs: number }) => {
      if (!user) throw new Error('Must be logged in');
      
      const { error } = await supabase
        .from('trail_completions')
        .upsert({
          user_id: user.id,
          city_id: cityId,
          completion_time_ms: completionTimeMs,
        }, { onConflict: 'user_id,city_id', ignoreDuplicates: true });
      
      if (error) throw error;
    },
  });
}

export function useAddPurchase() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cityId, stripePaymentId }: { cityId: string; stripePaymentId?: string }) => {
      if (!user) throw new Error('Must be logged in');
      
      const { error } = await supabase
        .from('user_purchases')
        .insert({
          user_id: user.id,
          city_id: cityId,
          stripe_payment_id: stripePaymentId,
        });
      
      if (error && !error.message.includes('duplicate')) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-purchase', variables.cityId] });
    },
  });
}
