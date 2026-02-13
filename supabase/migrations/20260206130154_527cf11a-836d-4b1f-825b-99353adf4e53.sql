-- Create table for pending admin emails
CREATE TABLE public.pending_admin_emails (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    added_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pending_admin_emails ENABLE ROW LEVEL SECURITY;

-- Only admins can manage pending admin emails
CREATE POLICY "Admins can view pending admin emails"
ON public.pending_admin_emails FOR SELECT
USING (is_admin());

CREATE POLICY "Admins can insert pending admin emails"
ON public.pending_admin_emails FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admins can delete pending admin emails"
ON public.pending_admin_emails FOR DELETE
USING (is_admin());

-- Create trigger function to auto-assign admin role on signup
CREATE OR REPLACE FUNCTION public.check_pending_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the new user's email is in pending_admin_emails
  IF EXISTS (
    SELECT 1 FROM public.pending_admin_emails 
    WHERE LOWER(email) = LOWER(NEW.email)
  ) THEN
    -- Insert admin role for this user
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
    
    -- Remove from pending list
    DELETE FROM public.pending_admin_emails 
    WHERE LOWER(email) = LOWER(NEW.email);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created_check_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.check_pending_admin();

-- Add the requested email now
INSERT INTO public.pending_admin_emails (email) 
VALUES ('jonas.wangso@gmail.com');