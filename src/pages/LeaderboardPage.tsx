import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCities } from '@/hooks/useGameData';
import { Header, MobileNav } from '@/components/Navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Clock, Loader2, Medal } from 'lucide-react';
import { OrnamentalDivider } from '@/components/VintageCard';

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
      <Trophy className="h-5 w-5 text-primary" />
    </div>
  );
  if (rank === 2) return (
    <div className="w-10 h-10 rounded-full bg-muted border-2 border-muted-foreground/40 flex items-center justify-center">
      <Medal className="h-5 w-5 text-muted-foreground" />
    </div>
  );
  if (rank === 3) return (
    <div className="w-10 h-10 rounded-full bg-orange-900/20 border-2 border-orange-700/50 flex items-center justify-center">
      <Medal className="h-5 w-5 text-orange-700" />
    </div>
  );
  return (
    <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
      <span className="font-display font-bold text-sm text-muted-foreground">{rank}</span>
    </div>
  );
}

export default function LeaderboardPage() {
  const { data: cities, isLoading: citiesLoading } = useCities();
  const [selectedCityId, setSelectedCityId] = useState<string>('');

  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['leaderboard', selectedCityId],
    queryFn: async () => {
      if (!selectedCityId) return [];
      const { data: completions, error: cErr } = await supabase
        .from('trail_completions')
        .select('user_id, completion_time_ms, completed_at')
        .eq('city_id', selectedCityId)
        .order('completion_time_ms', { ascending: true });
      if (cErr) throw cErr;
      if (!completions?.length) return [];

      const userIds = [...new Set(completions.map(c => c.user_id))];
      const { data: profiles, error: pErr } = await supabase
        .from('profiles')
        .select('user_id, player_name')
        .in('user_id', userIds);
      if (pErr) throw pErr;

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.player_name]) || []);

      return completions.map((c, i) => ({
        rank: i + 1,
        name: profileMap.get(c.user_id) || 'Anonymous',
        time: c.completion_time_ms,
        completedAt: c.completed_at,
      }));
    },
    enabled: !!selectedCityId,
  });

  const topThree = leaderboard?.slice(0, 3) || [];
  const rest = leaderboard?.slice(3) || [];

  return (
    <div className="min-h-screen pb-20">
      <Header />
      <main className="container py-6 space-y-6">
        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="font-display text-3xl font-bold">Top Story<span className="text-primary">Trailers</span></h1>
          <p className="text-muted-foreground text-sm">The fastest adventurers to complete the trail</p>
        </div>

        <OrnamentalDivider />

        {/* City Selector */}
        <div className="max-w-xs mx-auto">
          <Select value={selectedCityId} onValueChange={setSelectedCityId}>
            <SelectTrigger className="bg-card border-primary/30 font-display">
              <SelectValue placeholder={citiesLoading ? 'Loading...' : 'Choose a StoryTrail'} />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              {cities?.map(city => (
                <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!selectedCityId && (
          <p className="text-center text-muted-foreground text-sm py-8">Select a StoryTrail to see the leaderboard</p>
        )}

        {leaderboardLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {selectedCityId && !leaderboardLoading && leaderboard && leaderboard.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">No completions yet for this trail.</p>
        )}

        {/* Podium - Top 3 */}
        {topThree.length > 0 && (
          <div className="flex items-end justify-center gap-3 pt-4 pb-2">
            {/* 2nd place */}
            {topThree[1] ? (
              <div className="flex flex-col items-center w-24">
                <div className="w-14 h-14 rounded-full bg-muted border-2 border-muted-foreground/40 flex items-center justify-center mb-1">
                  <span className="font-display font-bold text-lg text-muted-foreground">#2</span>
                </div>
                <p className="font-semibold text-sm text-foreground truncate w-full text-center">{topThree[1].name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(topThree[1].time)}</span>
                </div>
                <div className="w-full h-16 bg-muted/60 rounded-t-lg mt-2 border border-b-0 border-muted-foreground/20" />
              </div>
            ) : <div className="w-24" />}

            {/* 1st place */}
            {topThree[0] && (
              <div className="flex flex-col items-center w-28">
                <Trophy className="h-6 w-6 text-primary mb-1" />
                <div className="w-16 h-16 rounded-full bg-primary/15 border-3 border-primary flex items-center justify-center mb-1 ring-2 ring-primary/30 ring-offset-2 ring-offset-background">
                  <span className="font-display font-bold text-xl text-primary">#1</span>
                </div>
                <p className="font-bold text-sm text-foreground truncate w-full text-center">{topThree[0].name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(topThree[0].time)}</span>
                </div>
                <div className="w-full h-24 bg-primary/10 rounded-t-lg mt-2 border border-b-0 border-primary/30" />
              </div>
            )}

            {/* 3rd place */}
            {topThree[2] ? (
              <div className="flex flex-col items-center w-24">
                <div className="w-14 h-14 rounded-full bg-orange-900/10 border-2 border-orange-700/40 flex items-center justify-center mb-1">
                  <span className="font-display font-bold text-lg text-orange-700">#3</span>
                </div>
                <p className="font-semibold text-sm text-foreground truncate w-full text-center">{topThree[2].name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(topThree[2].time)}</span>
                </div>
                <div className="w-full h-10 bg-orange-900/5 rounded-t-lg mt-2 border border-b-0 border-orange-700/20" />
              </div>
            ) : <div className="w-24" />}
          </div>
        )}

        {/* Remaining entries */}
        {rest.length > 0 && (
          <div className="max-w-md mx-auto">
            <OrnamentalDivider />
            <div className="space-y-1">
              {rest.map((entry) => (
                <div
                  key={entry.rank}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border/50 bg-card/50 hover:bg-card transition-colors"
                >
                  <RankBadge rank={entry.rank} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{entry.name}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-primary font-display font-semibold">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatTime(entry.time)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <MobileNav />
    </div>
  );
}
