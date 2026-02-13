
ALTER TABLE public.locations ADD COLUMN is_reveal boolean NOT NULL DEFAULT false;
ALTER TABLE public.locations ADD COLUMN reveal_image_url text;

-- Also expose is_reveal in the public view (but NOT reveal_image_url, keep that admin-only if needed)
-- Actually, the reveal image needs to be shown to players too, so let's add both to the public view
DROP VIEW IF EXISTS public.locations_public;
CREATE VIEW public.locations_public AS
SELECT
  id, city_id, name, sequence_order, latitude, longitude,
  intro_text, riddle_text, answer_options, image_url,
  is_intro_location, answer_type, created_at, updated_at,
  is_reveal, reveal_image_url
FROM public.locations;
