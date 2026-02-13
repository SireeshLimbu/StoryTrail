-- Ensure only one completion per user per city
ALTER TABLE public.trail_completions
ADD CONSTRAINT trail_completions_user_city_unique UNIQUE (user_id, city_id);