
-- Add new columns to locations table
ALTER TABLE public.locations
ADD COLUMN IF NOT EXISTS answer_type text NOT NULL DEFAULT 'multiple_choice',
ADD COLUMN IF NOT EXISTS correct_answer_indices integer[] DEFAULT NULL,
ADD COLUMN IF NOT EXISTS free_text_answer text DEFAULT NULL;

-- Migrate existing correct_answer_index data to correct_answer_indices array
UPDATE public.locations 
SET correct_answer_indices = ARRAY[correct_answer_index]
WHERE correct_answer_index IS NOT NULL AND correct_answer_indices IS NULL;

-- Drop and recreate the public view to include answer_type but exclude sensitive columns
DROP VIEW IF EXISTS public.locations_public;

CREATE VIEW public.locations_public AS
SELECT
  id,
  city_id,
  name,
  intro_text,
  riddle_text,
  answer_options,
  latitude,
  longitude,
  sequence_order,
  is_intro_location,
  image_url,
  answer_type,
  created_at,
  updated_at
FROM public.locations;
