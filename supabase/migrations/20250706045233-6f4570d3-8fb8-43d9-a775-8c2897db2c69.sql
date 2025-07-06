
-- Criar tabela para armazenar arquivos
CREATE TABLE public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  size TEXT,
  type TEXT DEFAULT 'ZIP',
  url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('thermal', 'multifunction')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para credenciais de admin
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir um usuário admin padrão (senha: admin123)
INSERT INTO public.admin_users (username, password_hash) 
VALUES ('admin', '$2b$10$K7L/VBPz6.Zx.6KG.6KG.6KG.6KG.6KG.6KG.6KG.6KG.6KG.6KG.6KG.6K');

-- Inserir alguns arquivos de exemplo
INSERT INTO public.files (name, size, type, url, category) VALUES
('Driver Epson TM-T20', '58.4 MB', 'ZIP', 'https://mega.nz/file/HUUARCwJ#VxyvGhHL6z5rDBPG7dcgxrQIE8xQa3I4NOA1UhDWegA', 'thermal'),
('Driver Epson TM-T20X', '2.5 MB', 'PDF', 'https://mega.nz/file/iVND1YaD#ut1bl9z0gQioChxxJyfdNSSuKa7FfEbto1Ps8dmXpZ4', 'thermal'),
('Driver Epson TM-T81-FBII', '598 KB', 'ZIP', 'https://mega.nz/file/DAkCVYKT#mefI5f3drtdqqUGTVhr0f9Oq9CR-NIEwrBM59u7OmnU', 'thermal'),
('Driver Bematech MP-4200 TH', '1.2 MB', 'ZIP', 'https://mega.nz/file/example1', 'thermal'),
('Driver Elgin i9', '3.1 MB', 'ZIP', 'https://mega.nz/file/example2', 'thermal'),
('Driver HP LaserJet Pro MFP M428', '125 MB', 'ZIP', 'https://mega.nz/file/example3', 'multifunction'),
('Driver Canon PIXMA G3110', '89 MB', 'ZIP', 'https://mega.nz/file/example4', 'multifunction'),
('Driver Epson EcoTank L3150', '156 MB', 'ZIP', 'https://mega.nz/file/example5', 'multifunction'),
('Driver Brother DCP-L2540DW', '78 MB', 'ZIP', 'https://mega.nz/file/example6', 'multifunction');

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública dos arquivos
CREATE POLICY "Anyone can view files" 
ON public.files FOR SELECT 
USING (true);

-- Políticas para admin_users (apenas acesso interno)
CREATE POLICY "No public access to admin_users" 
ON public.admin_users FOR ALL 
USING (false);
