import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useIsAdmin() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: async (): Promise<boolean> => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .rpc('is_admin');
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      return data === true;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function useAdminCities() {
  const { data: isAdmin } = useIsAdmin();
  
  return useQuery({
    queryKey: ['admin-cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('display_order')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
    enabled: isAdmin === true,
  });
}

export function useAdminLocations(cityId: string | null) {
  const { data: isAdmin } = useIsAdmin();
  
  return useQuery({
    queryKey: ['admin-locations', cityId],
    queryFn: async () => {
      if (!cityId) return [];
      
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('city_id', cityId)
        .order('sequence_order');
      
      if (error) throw error;
      return data || [];
    },
    enabled: isAdmin === true && !!cityId,
  });
}

export function useAdminCharacters(cityId: string | null) {
  const { data: isAdmin } = useIsAdmin();
  
  return useQuery({
    queryKey: ['admin-characters', cityId],
    queryFn: async () => {
      if (!cityId) return [];
      
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('city_id', cityId)
        .order('display_order');
      
      if (error) throw error;
      return data || [];
    },
    enabled: isAdmin === true && !!cityId,
  });
}
