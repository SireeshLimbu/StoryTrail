
-- Add end location flag to locations table
ALTER TABLE public.locations ADD COLUMN IF NOT EXISTS is_end_location boolean NOT NULL DEFAULT false;

-- Drop and recreate the public view with new column
DROP VIEW IF EXISTS public.locations_public;
CREATE VIEW public.locations_public AS
SELECT
  id, city_id, name, sequence_order, latitude, longitude,
  image_url, intro_text, riddle_text, answer_options, answer_type,
  is_intro_location, is_reveal, reveal_image_url, is_end_location,
  created_at, updated_at
FROM public.locations;

ALTER VIEW public.locations_public SET (security_invoker = false);
GRANT SELECT ON public.locations_public TO anon, authenticated;
