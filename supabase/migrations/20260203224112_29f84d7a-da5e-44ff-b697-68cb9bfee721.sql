-- Create app_role enum type
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
$$;

-- RLS policies for user_roles table
-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.is_admin());

-- Admins can insert roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.is_admin());

-- Admins can delete roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.is_admin());

-- Update RLS policies for cities to allow admin management
CREATE POLICY "Admins can insert cities"
ON public.cities
FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update cities"
ON public.cities
FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admins can delete cities"
ON public.cities
FOR DELETE
USING (public.is_admin());

-- Also allow admins to view unpublished cities
CREATE POLICY "Admins can view all cities"
ON public.cities
FOR SELECT
USING (public.is_admin());

-- Update RLS policies for locations to allow admin management
CREATE POLICY "Admins can insert locations"
ON public.locations
FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update locations"
ON public.locations
FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admins can delete locations"
ON public.locations
FOR DELETE
USING (public.is_admin());

CREATE POLICY "Admins can view all locations"
ON public.locations
FOR SELECT
USING (public.is_admin());

-- Update RLS policies for characters to allow admin management
CREATE POLICY "Admins can insert characters"
ON public.characters
FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update characters"
ON public.characters
FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admins can delete characters"
ON public.characters
FOR DELETE
USING (public.is_admin());

CREATE POLICY "Admins can view all characters"
ON public.characters
FOR SELECT
USING (public.is_admin());