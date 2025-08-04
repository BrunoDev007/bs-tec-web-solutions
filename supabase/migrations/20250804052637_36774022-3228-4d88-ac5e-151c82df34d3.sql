-- Update RLS policies for files table to allow public read access

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view files" ON public.files;
DROP POLICY IF EXISTS "Authenticated users can insert files" ON public.files;
DROP POLICY IF EXISTS "Authenticated users can update files" ON public.files;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON public.files;

-- Create new policies with public read access
CREATE POLICY "Anyone can view files"
ON public.files
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert files"
ON public.files
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update files"
ON public.files
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete files"
ON public.files
FOR DELETE
TO authenticated
USING (true);