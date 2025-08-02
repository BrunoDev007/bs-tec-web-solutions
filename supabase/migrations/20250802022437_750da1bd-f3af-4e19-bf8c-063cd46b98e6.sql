-- Fix security warnings for function search paths

-- Update cleanup_expired_tokens function with proper search_path
CREATE OR REPLACE FUNCTION public.cleanup_expired_tokens()
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.password_reset_tokens 
  WHERE expires_at < NOW() OR used = true;
END;
$$;

-- Update trigger_cleanup_tokens function with proper search_path  
CREATE OR REPLACE FUNCTION public.trigger_cleanup_tokens()
RETURNS trigger 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.cleanup_expired_tokens();
  RETURN NEW;
END;
$$;