
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { useFileManagement } from '@/hooks/useFileManagement';
import FileForm from '@/components/FileForm';
import ArquivosHeader from '@/components/ArquivosHeader';
import FilesList from '@/components/FilesList';

const Arquivos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFileForm, setShowFileForm] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  
  const { user } = useSecureAuth();
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
          isAuthenticated={!!user}
          currentUser={user?.email}
          onAddFile={handleAddFile}
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
        </Tabs>

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
      </div>
    </div>
  );
};


export default Arquivos;
