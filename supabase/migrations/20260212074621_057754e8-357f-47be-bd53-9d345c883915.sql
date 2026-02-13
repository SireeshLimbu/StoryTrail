
-- Add player_name column to profiles
ALTER TABLE public.profiles ADD COLUMN player_name text;

-- Update the handle_new_user trigger to also save player_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, player_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'player_name');
  RETURN NEW;
END;
$$;
