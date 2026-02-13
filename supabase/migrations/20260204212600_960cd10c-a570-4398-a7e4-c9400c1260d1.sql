-- Create a public view that EXCLUDES sensitive columns (correct_answer_index, clue_text)
CREATE VIEW public.locations_public
WITH (security_invoker = on) AS
SELECT 
  id,
  city_id,
  name,
  sequence_order,
  latitude,
  longitude,
  intro_text,
  riddle_text,
  answer_options,
  image_url,
  is_intro_location,
  created_at,
  updated_at
FROM public.locations;

-- Drop the existing public SELECT policy on locations
DROP POLICY IF EXISTS "Anyone can view locations from published cities" ON public.locations;

-- Create a new restrictive policy that only allows admins to SELECT from the base table
CREATE POLICY "Only admins can view base locations table"
ON public.locations
FOR SELECT
USING (is_admin());

-- Grant SELECT on the view to anon and authenticated roles
GRANT SELECT ON public.locations_public TO anon, authenticated;