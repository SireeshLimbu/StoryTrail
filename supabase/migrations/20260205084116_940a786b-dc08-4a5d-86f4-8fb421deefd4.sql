-- Drop and recreate the locations_public view WITHOUT security_invoker
-- This allows the view to use the view owner's (postgres/admin) permissions
-- which can read the base locations table, while still hiding sensitive columns

DROP VIEW IF EXISTS public.locations_public;

CREATE VIEW public.locations_public AS
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

-- Grant SELECT on the view to authenticated and anon roles
GRANT SELECT ON public.locations_public TO authenticated;
GRANT SELECT ON public.locations_public TO anon;