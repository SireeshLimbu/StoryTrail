-- Create app settings table for admin-controlled settings
CREATE TABLE public.app_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text UNIQUE NOT NULL,
    value jsonb NOT NULL DEFAULT '{}'::jsonb,
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (needed for playtest check on frontend)
CREATE POLICY "Anyone can read app settings"
ON public.app_settings
FOR SELECT
USING (true);

-- Only admins can modify settings
CREATE POLICY "Admins can update app settings"
ON public.app_settings
FOR UPDATE
USING (is_admin());

CREATE POLICY "Admins can insert app settings"
ON public.app_settings
FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "Admins can delete app settings"
ON public.app_settings
FOR DELETE
USING (is_admin());

-- Insert default playtest setting (disabled by default for production safety)
INSERT INTO public.app_settings (key, value) 
VALUES ('playtest_enabled', '{"enabled": false}'::jsonb);