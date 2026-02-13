
-- Fix the security definer view warning by setting SECURITY INVOKER
-- But we need to grant access so players can read it
ALTER VIEW public.locations_public SET (security_invoker = on);

-- The base locations table has admin-only SELECT RLS, so we need a policy 
-- that allows reading through the view for published cities.
-- Add a policy for authenticated users to read locations of published cities
CREATE POLICY "Users can view locations of published cities"
ON public.locations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.cities
    WHERE cities.id = locations.city_id
    AND cities.is_published = true
  )
);
