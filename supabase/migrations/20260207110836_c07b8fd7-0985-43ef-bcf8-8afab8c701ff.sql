-- Drop the existing user SELECT policy
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.user_purchases;

-- Create admin-only SELECT policy
CREATE POLICY "Only admins can view purchases"
ON public.user_purchases FOR SELECT
TO authenticated
USING (is_admin());

-- Create a SECURITY DEFINER function to check if user has purchased a city
-- This allows checking purchase status without exposing the table data
CREATE OR REPLACE FUNCTION public.has_purchased_city(_city_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_purchases
    WHERE user_id = auth.uid()
      AND city_id = _city_id
  )
$$;