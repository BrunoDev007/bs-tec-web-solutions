
import React, { useState, useEffect } from 'react';
import { FileText, Download, Search, Plus, Edit, LogOut, Settings, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/LoginForm';
import FileForm from '@/components/FileForm';
import UserManagement from '@/components/UserManagement';
import { toast } from 'sonner';

const ArquivosContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showFileForm, setShowFileForm] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  
  const { isAuthenticated, logout } = useAuth();

  const loadFiles = async () => {
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

  useEffect(() => {
    loadFiles();
  }, []);

  const handleDeleteFile = async (fileId: string, fileName: string) => {
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

  const thermalFiles = files.filter(file => file.category === 'thermal');
  const multifunctionFiles = files.filter(file => file.category === 'multifunction');

  const filterFiles = (filesList) => {
    return filesList.filter(file =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredThermalFiles = filterFiles(thermalFiles);
  const filteredMultifunctionFiles = filterFiles(multifunctionFiles);

  const handleEditFile = (file) => {
    setEditingFile(file);
    setShowFileForm(true);
  };

  const handleAddFile = () => {
    setEditingFile(null);
    setShowFileForm(true);
  };

  const handleFormSuccess = () => {
    loadFiles();
  };

  const FilesList = ({ files, title }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {title} ({files.length} arquivos)
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {files.length > 0 ? (
          files.map((file, index) => (
            <div key={file.id || index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{file.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      {file.size && <span>{file.size}</span>}
                      {file.size && <span>•</span>}
                      <span>{file.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isAuthenticated && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditFile(file)}
                        className="text-gray-600 hover:text-blue-600"
                        title="Editar arquivo"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFile(file.id, file.name)}
                        className="text-gray-600 hover:text-red-600"
                        title="Excluir arquivo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <a
                    href={file.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    title={`Download ${file.name}`}
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhum arquivo encontrado{searchTerm && ` para "${searchTerm}"`}</p>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Carregando arquivos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Arquivos Técnicos
              </h1>
              <p className="text-gray-600">
                Repositório de drivers e ferramentas técnicas organizados por categoria
              </p>
            </div>
            
            {/* Admin Controls */}
            <div className="flex gap-2">
              {isAuthenticated ? (
                <>
                  <Button onClick={handleAddFile} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Arquivo
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowUserManagement(true)}
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Gerenciar Usuários
                  </Button>
                  <Button variant="outline" onClick={logout} className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setShowLogin(true)}
                  className="text-sm"
                >
                  Login Admin
                </Button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar arquivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tabs for File Categories */}
        <Tabs defaultValue="thermal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="thermal">Drivers Impressoras Térmicas</TabsTrigger>
            <TabsTrigger value="multifunction">Drivers Impressoras Multifuncionais</TabsTrigger>
          </TabsList>
          
          <TabsContent value="thermal" className="space-y-4">
            <FilesList 
              files={filteredThermalFiles} 
              title="Drivers para Impressoras Térmicas" 
            />
          </TabsContent>
          
          <TabsContent value="multifunction" className="space-y-4">
            <FilesList 
              files={filteredMultifunctionFiles} 
              title="Drivers para Impressoras Multifuncionais" 
            />
          </TabsContent>
        </Tabs>

        {/* Login Dialog */}
        <Dialog open={showLogin} onOpenChange={setShowLogin}>
          <DialogContent className="max-w-md">
            <LoginForm onClose={() => setShowLogin(false)} />
          </DialogContent>
        </Dialog>

        {/* File Form Dialog */}
        <Dialog open={showFileForm} onOpenChange={setShowFileForm}>
          <DialogContent className="max-w-md">
            <FileForm 
              file={editingFile}
              onClose={() => setShowFileForm(false)}
              onSuccess={handleFormSuccess}
            />
          </DialogContent>
        </Dialog>

        {/* User Management Dialog */}
        <Dialog open={showUserManagement} onOpenChange={setShowUserManagement}>
          <DialogContent className="max-w-2xl">
            <UserManagement 
              open={showUserManagement}
              onClose={() => setShowUserManagement(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const Arquivos = () => {
  return (
    <AuthProvider>
      <ArquivosContent />
    </AuthProvider>
  );
};

export default Arquivos;
