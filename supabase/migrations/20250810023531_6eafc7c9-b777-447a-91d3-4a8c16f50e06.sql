-- Allow 'diagnostic' as a valid category in public.files
ALTER TABLE public.files DROP CONSTRAINT IF EXISTS files_category_check;

ALTER TABLE public.files
ADD CONSTRAINT files_category_check
CHECK (category IN ('thermal', 'multifunction', 'diagnostic'));
