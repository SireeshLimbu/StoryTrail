
ALTER TABLE public.cities
ADD COLUMN how_it_works jsonb DEFAULT NULL;

COMMENT ON COLUMN public.cities.how_it_works IS 'Custom "How it works" steps as JSON array of strings, shown on story landing page';
