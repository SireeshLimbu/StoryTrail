CREATE POLICY "Users can delete their own progress"
ON public.user_progress
FOR DELETE
USING (auth.uid() = user_id);