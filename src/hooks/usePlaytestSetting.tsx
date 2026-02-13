import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function usePlaytestSetting() {
  return useQuery({
    queryKey: ['playtest-setting'],
    queryFn: async (): Promise<boolean> => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'playtest_enabled')
        .single();
      
      if (error) {
        console.error('Error fetching playtest setting:', error);
        return false; // Default to disabled for safety
      }
      
      const value = data?.value as { enabled?: boolean } | null;
      return value?.enabled ?? false;
    },
    staleTime: 30 * 1000, // Cache for 30 seconds
  });
}

export function useUpdatePlaytestSetting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (enabled: boolean) => {
      const { error } = await supabase
        .from('app_settings')
        .update({ 
          value: { enabled },
          updated_at: new Date().toISOString()
        })
        .eq('key', 'playtest_enabled');
      
      if (error) throw error;
      return enabled;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playtest-setting'] });
    },
  });
}
