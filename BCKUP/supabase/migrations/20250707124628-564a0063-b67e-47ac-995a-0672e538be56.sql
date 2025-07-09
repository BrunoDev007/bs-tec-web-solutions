
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "No public access to admin_users" ON public.admin_users;

-- Create policies that allow proper admin user management
-- Allow inserting new admin users (for initial setup and user creation)
CREATE POLICY "Allow insert admin users" ON public.admin_users
FOR INSERT 
WITH CHECK (true);

-- Allow authenticated users to view admin users (for login verification)
CREATE POLICY "Allow select admin users" ON public.admin_users
FOR SELECT
USING (true);

-- Allow updating admin users (for password changes, etc.)
CREATE POLICY "Allow update admin users" ON public.admin_users
FOR UPDATE
USING (true);

-- Allow deleting admin users (for user management)
CREATE POLICY "Allow delete admin users" ON public.admin_users
FOR DELETE
USING (true);
