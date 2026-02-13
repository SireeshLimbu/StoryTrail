-- Drop the existing SELECT policy
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.user_purchases;

-- Recreate with explicit authenticated role targeting
CREATE POLICY "Users can view their own purchases"
ON public.user_purchases
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Also fix the INSERT policy to be explicit
DROP POLICY IF EXISTS "Users can insert their own purchases" ON public.user_purchases;

CREATE POLICY "Users can insert their own purchases"
ON public.user_purchases
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);