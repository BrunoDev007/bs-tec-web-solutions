
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSecureAuth } from './useSecureAuth';

interface File {
  id: string;
  name: string;
  size?: string;
  type: string;
  url: string;
  category: string;
  created_at?: string;
}

export const useFileManagement = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSecureAuth();

  const loadFiles = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Erro ao carregar arquivos:', error);
      toast.error('Erro ao carregar arquivos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (!user) {
      toast.error('Você precisa estar logado para excluir arquivos');
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir o arquivo "${fileName}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      toast.success('Arquivo excluído com sucesso!');
      loadFiles(); // Recarregar lista de arquivos
    } catch (error) {
      console.error('Erro ao excluir arquivo:', error);
      toast.error('Erro ao excluir arquivo');
    }
  };

  const filterFiles = (filesList: File[], searchTerm: string) => {
    return filesList.filter(file =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  useEffect(() => {
    if (user) {
      loadFiles();
    }
  }, [user]);

  return {
    files,
    loading,
    loadFiles,
    handleDeleteFile,
    filterFiles
  };
};
