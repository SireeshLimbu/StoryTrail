-- Remove the redundant old admin SELECT policy
DROP POLICY IF EXISTS "Admins can view all locations" ON public.locations;