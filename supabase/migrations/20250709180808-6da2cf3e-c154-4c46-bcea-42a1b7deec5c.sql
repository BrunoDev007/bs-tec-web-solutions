
-- Criar tabela para usuários administrativos
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para arquivos
CREATE TABLE public.files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('thermal', 'multifunction')),
  url TEXT NOT NULL,
  size TEXT,
  type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para tokens de recuperação de senha
CREATE TABLE public.password_reset_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO public.admin_users (username, password_hash) 
VALUES ('admin', '$2b$10$00000000');

-- Inserir alguns arquivos de exemplo
INSERT INTO public.files (name, category, url, size, type) VALUES
('Driver Epson TM-T20', 'thermal', 'https://mega.nz/file/HUUARCwJ#VxyvGhHL6z5rDBPG7dcgxrQIE8xQa3I4NOA1UhDWegA', '58.4 MB', 'ZIP'),
('Driver Epson TM-T20X', 'thermal', 'https://mega.nz/file/iVND1YaD#ut1bl9z0gQioChxxJyfdNSSuKa7FfEbto1Ps8dmXpZ4', '2.5 MB', 'PDF'),
('Driver HP LaserJet Pro MFP M428', 'multifunction', 'https://mega.nz/file/example3', '125 MB', 'ZIP'),
('Driver Canon PIXMA G3110', 'multifunction', 'https://mega.nz/file/example4', '89 MB', 'ZIP');
