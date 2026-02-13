-- Allow all authenticated users to read trail_completions for leaderboard
CREATE POLICY "Authenticated users can view all completions for leaderboard"
ON public.trail_completions
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Allow all authenticated users to read all profiles for leaderboard display names
CREATE POLICY "Authenticated users can view all profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);
