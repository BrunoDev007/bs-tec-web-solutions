-- Phase 1: Critical Database Security Fixes

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_users table
CREATE POLICY "Users can view their own profile" 
ON public.admin_users 
FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" 
ON public.admin_users 
FOR UPDATE 
USING (auth.uid()::text = id::text);

-- Create RLS policies for files table  
CREATE POLICY "Authenticated users can view files" 
ON public.files 
FOR SELECT 
TO authenticated 
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

-- Create RLS policies for password_reset_tokens table
CREATE POLICY "Users can view their own tokens" 
ON public.password_reset_tokens 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "System can insert tokens" 
ON public.password_reset_tokens 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update tokens" 
ON public.password_reset_tokens 
FOR UPDATE 
USING (true);

-- Add user_id column to admin_users table to link with auth.users
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON public.password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON public.password_reset_tokens(token);

-- Add constraints for data integrity
ALTER TABLE public.password_reset_tokens ADD CONSTRAINT valid_expiry_date CHECK (expires_at > created_at);

-- Create function to automatically clean up expired tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM public.password_reset_tokens 
  WHERE expires_at < NOW() OR used = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically clean tokens periodically
CREATE OR REPLACE FUNCTION public.trigger_cleanup_tokens()
RETURNS trigger AS $$
BEGIN
  PERFORM public.cleanup_expired_tokens();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger cleanup when new tokens are created
CREATE TRIGGER cleanup_tokens_trigger
  AFTER INSERT ON public.password_reset_tokens
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.trigger_cleanup_tokens();