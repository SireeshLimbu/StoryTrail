
-- Revert: the SECURITY DEFINER view is intentional to hide sensitive columns
-- while allowing read access to safe columns only through the view
ALTER VIEW public.locations_public SET (security_invoker = off);

-- Remove the policy that would expose sensitive columns on the base table
DROP POLICY IF EXISTS "Users can view locations of published cities" ON public.locations;
