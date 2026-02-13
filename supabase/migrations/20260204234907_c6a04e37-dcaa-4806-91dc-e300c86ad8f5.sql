-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can read app settings" ON public.app_settings;

-- Create a new policy that only allows authenticated users to read
CREATE POLICY "Authenticated users can read app settings"
ON public.app_settings
FOR SELECT
TO authenticated
USING (true);