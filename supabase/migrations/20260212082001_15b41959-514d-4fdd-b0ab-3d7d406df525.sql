-- Allow admins to view all user progress
CREATE POLICY "Admins can view all user progress"
ON public.user_progress
FOR SELECT
USING (is_admin());