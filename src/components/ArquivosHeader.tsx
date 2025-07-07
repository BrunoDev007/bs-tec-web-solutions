
import React from 'react';
import { Search, Plus, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArquivosHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isAuthenticated: boolean;
  onAddFile: () => void;
  onUserManagement: () => void;
  onLogin: () => void;
  onLogout: () => void;
}

const ArquivosHeader = ({
  searchTerm,
  onSearchChange,
  isAuthenticated,
  onAddFile,
  onUserManagement,
  onLogin,
  onLogout
}: ArquivosHeaderProps) => {
  return (
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
              <Button onClick={onAddFile} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Arquivo
              </Button>
              <Button 
                variant="outline" 
                onClick={onUserManagement}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Gerenciar Usuários
              </Button>
              <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              onClick={onLogin}
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
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default ArquivosHeader;
