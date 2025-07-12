
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { useFileManagement } from '@/hooks/useFileManagement';
import LoginForm from '@/components/LoginForm';
import FileForm from '@/components/FileForm';
import UserManagement from '@/components/UserManagement';
import ArquivosHeader from '@/components/ArquivosHeader';
import FilesList from '@/components/FilesList';

const ArquivosContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showFileForm, setShowFileForm] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { files, loading, loadFiles, handleDeleteFile, filterFiles } = useFileManagement();

  const thermalFiles = files.filter(file => file.category === 'thermal');
  const multifunctionFiles = files.filter(file => file.category === 'multifunction');

  const filteredThermalFiles = filterFiles(thermalFiles, searchTerm);
  const filteredMultifunctionFiles = filterFiles(multifunctionFiles, searchTerm);

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
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          onAddFile={handleAddFile}
          onUserManagement={() => setShowUserManagement(true)}
          onLogin={() => setShowLogin(true)}
          onLogout={logout}
        />

        {/* Tabs for File Categories */}
        <Tabs defaultValue="thermal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-auto">
            <TabsTrigger value="thermal" className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3">
              <span className="hidden sm:inline">Drivers Impressoras Térmicas</span>
              <span className="sm:hidden">Térmicas</span>
            </TabsTrigger>
            <TabsTrigger value="multifunction" className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3">
              <span className="hidden sm:inline">Drivers Impressoras Multifuncionais</span>
              <span className="sm:hidden">Multifuncionais</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="thermal" className="space-y-4">
            <FilesList 
              files={filteredThermalFiles} 
              title="Drivers para Impressoras Térmicas"
              isAuthenticated={isAuthenticated}
              onEditFile={handleEditFile}
              onDeleteFile={handleDeleteFile}
              searchTerm={searchTerm}
            />
          </TabsContent>
          
          <TabsContent value="multifunction" className="space-y-4">
            <FilesList 
              files={filteredMultifunctionFiles} 
              title="Drivers para Impressoras Multifuncionais"
              isAuthenticated={isAuthenticated}
              onEditFile={handleEditFile}
              onDeleteFile={handleDeleteFile}
              searchTerm={searchTerm}
            />
          </TabsContent>
        </Tabs>

        {/* Login Dialog */}
        <Dialog open={showLogin} onOpenChange={setShowLogin}>
          <DialogContent className="max-w-sm sm:max-w-md mx-4">
            <LoginForm onClose={() => setShowLogin(false)} />
          </DialogContent>
        </Dialog>

        {/* File Form Dialog */}
        <Dialog open={showFileForm} onOpenChange={setShowFileForm}>
          <DialogContent className="max-w-sm sm:max-w-md mx-4">
            <FileForm 
              file={editingFile}
              onClose={() => setShowFileForm(false)}
              onSuccess={handleFormSuccess}
            />
          </DialogContent>
        </Dialog>

        {/* User Management Dialog - Apenas para admin */}
        {currentUser === 'admin' && (
          <Dialog open={showUserManagement} onOpenChange={setShowUserManagement}>
            <DialogContent className="max-w-sm sm:max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <UserManagement 
                open={showUserManagement}
                onClose={() => setShowUserManagement(false)}
              />
            </DialogContent>
          </Dialog>
        )}
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
