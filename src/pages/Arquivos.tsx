
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import SecureLoginForm from '@/components/auth/SecureLoginForm';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import ChangePasswordForm from '@/components/admin/ChangePasswordForm';
import CreateUserForm from '@/components/admin/CreateUserForm';
import UserManagement from '@/components/admin/UserManagement';
import { useFileManagement } from '@/hooks/useFileManagement';
import FileForm from '@/components/FileForm';
import ArquivosHeader from '@/components/ArquivosHeader';
import FilesList from '@/components/FilesList';

const Arquivos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFileForm, setShowFileForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [activeAdminForm, setActiveAdminForm] = useState<'password' | 'user' | 'management' | null>(null);
  
  const { user } = useSecureAuth();
  const { files, loading, loadFiles, handleDeleteFile: deleteFile, filterFiles } = useFileManagement();

  const thermalFiles = files.filter(file => file.category === 'thermal');
  const multifunctionFiles = files.filter(file => file.category === 'multifunction');
  const diagnosticFiles = files.filter(file => file.category === 'diagnostic');

  const filteredThermalFiles = filterFiles(thermalFiles, searchTerm);
  const filteredMultifunctionFiles = filterFiles(multifunctionFiles, searchTerm);
  const filteredDiagnosticFiles = filterFiles(diagnosticFiles, searchTerm);

  const handleEditFile = (file) => {
    if (!user) {
      setShowLoginForm(true);
      return;
    }
    setEditingFile(file);
    setShowFileForm(true);
  };

  const handleAddFile = () => {
    if (!user) {
      setShowLoginForm(true);
      return;
    }
    setEditingFile(null);
    setShowFileForm(true);
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    if (!user) {
      setShowLoginForm(true);
      return;
    }
    await deleteFile(fileId, fileName);
  };

  const handleFormSuccess = () => {
    loadFiles();
  };

  // Fechar modal de login quando usuário fizer login
  useEffect(() => {
    if (user && showLoginForm) {
      setShowLoginForm(false);
    }
  }, [user, showLoginForm]);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <ArquivosHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddFile={handleAddFile}
          onLogin={() => setShowLoginForm(true)}
          onChangePassword={() => setActiveAdminForm('password')}
          onManageUsers={() => setActiveAdminForm('management')}
          onCreateUser={() => setActiveAdminForm('user')}
        />

        {/* Admin Forms from submenu */}
        {user && activeAdminForm === 'password' && (
          <div className="mb-6">
            <ChangePasswordForm onBack={() => setActiveAdminForm(null)} />
          </div>
        )}
        {user && activeAdminForm === 'user' && (
          <div className="mb-6">
            <CreateUserForm onBack={() => setActiveAdminForm(null)} />
          </div>
        )}
        {user && activeAdminForm === 'management' && (
          <div className="mb-6">
            <UserManagement onBack={() => setActiveAdminForm(null)} />
          </div>
        )}

        {/* Tabs for File Categories */}
        <Tabs defaultValue="thermal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 h-auto">
            <TabsTrigger value="thermal" className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3">
              <span className="hidden sm:inline">Drivers Impressoras Térmicas</span>
              <span className="sm:hidden">Térmicas</span>
            </TabsTrigger>
            <TabsTrigger value="multifunction" className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3">
              <span className="hidden sm:inline">Drivers Impressoras Multifuncionais</span>
              <span className="sm:hidden">Multifuncionais</span>
            </TabsTrigger>
            <TabsTrigger value="diagnostic" className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3">
              <span className="hidden sm:inline">Software de Diagnóstico</span>
              <span className="sm:hidden">Diagnóstico</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="thermal" className="space-y-4">
            <FilesList 
              files={filteredThermalFiles} 
              title="Drivers para Impressoras Térmicas"
              isAuthenticated={!!user}
              onEditFile={handleEditFile}
              onDeleteFile={handleDeleteFile}
              searchTerm={searchTerm}
            />
          </TabsContent>
          
          <TabsContent value="multifunction" className="space-y-4">
            <FilesList 
              files={filteredMultifunctionFiles} 
              title="Drivers para Impressoras Multifuncionais"
              isAuthenticated={!!user}
              onEditFile={handleEditFile}
              onDeleteFile={handleDeleteFile}
              searchTerm={searchTerm}
            />
          </TabsContent>
          
          <TabsContent value="diagnostic" className="space-y-4">
            <FilesList 
              files={filteredDiagnosticFiles} 
              title="Software de Diagnóstico"
              isAuthenticated={!!user}
              onEditFile={handleEditFile}
              onDeleteFile={handleDeleteFile}
              searchTerm={searchTerm}
            />
          </TabsContent>
        </Tabs>

        {/* File Form Dialog */}
        <Dialog open={showFileForm} onOpenChange={setShowFileForm}>
          <DialogContent className="max-w-sm sm:max-w-md mx-4">
            <DialogTitle>Gerenciar Arquivo</DialogTitle>
            <DialogDescription>Adicione ou edite informações do arquivo.</DialogDescription>
            <FileForm 
              file={editingFile}
              onClose={() => setShowFileForm(false)}
              onSuccess={handleFormSuccess}
            />
          </DialogContent>
        </Dialog>

        {/* Login Form Dialog */}
        <Dialog open={showLoginForm} onOpenChange={setShowLoginForm}>
          <DialogContent className="max-w-sm sm:max-w-md mx-4">
            <DialogTitle>Acessar</DialogTitle>
            <DialogDescription>Entre para gerenciar os arquivos.</DialogDescription>
            <SecureLoginForm />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};


export default Arquivos;
