
-- Drop all existing RLS policies on pending_admin_emails
DROP POLICY IF EXISTS "Admins can view pending admin emails" ON public.pending_admin_emails;
DROP POLICY IF EXISTS "Admins can insert pending admin emails" ON public.pending_admin_emails;
DROP POLICY IF EXISTS "Admins can delete pending admin emails" ON public.pending_admin_emails;

-- Ensure RLS is enabled (denies all access by default with no permissive policies)
ALTER TABLE public.pending_admin_emails ENABLE ROW LEVEL SECURITY;

-- Revoke direct access from all roles
REVOKE ALL ON public.pending_admin_emails FROM anon, authenticated;

-- Grant usage only to service_role (for the SECURITY DEFINER trigger)
GRANT ALL ON public.pending_admin_emails TO service_role;
