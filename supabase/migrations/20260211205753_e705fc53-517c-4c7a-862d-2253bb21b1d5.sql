
-- Add completion_time_ms column to user_progress is not ideal since it's per-location.
-- Better to create a dedicated table for trail completion times.
CREATE TABLE public.trail_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  city_id UUID NOT NULL REFERENCES public.cities(id),
  completion_time_ms BIGINT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trail_completions ENABLE ROW LEVEL SECURITY;

-- Users can view their own completions
CREATE POLICY "Users can view their own completions"
  ON public.trail_completions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own completions
CREATE POLICY "Users can insert their own completions"
  ON public.trail_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all completions
CREATE POLICY "Admins can view all completions"
  ON public.trail_completions FOR SELECT
  USING (is_admin());
