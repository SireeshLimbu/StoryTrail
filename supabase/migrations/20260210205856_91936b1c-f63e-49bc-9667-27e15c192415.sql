
ALTER TABLE public.cities
ADD COLUMN tagline text,
ADD COLUMN story_description text;

COMMENT ON COLUMN public.cities.tagline IS 'Short text shown on the stories list card';
COMMENT ON COLUMN public.cities.story_description IS 'Longer text shown on the story landing page (About this Story section)';
