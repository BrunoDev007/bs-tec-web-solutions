
import React from 'react';
import { Search, Plus, Settings, LogOut, FilePlus, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArquivosHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isAuthenticated: boolean;
  currentUser: string | null;
  onAddFile: () => void;
  onUserManagement: () => void;
  onLogin: () => void;
  onLogout: () => void;
}

const ArquivosHeader = ({
  searchTerm,
  onSearchChange,
  isAuthenticated,
  currentUser,
  onAddFile,
  onUserManagement,
  onLogin,
  onLogout
}: ArquivosHeaderProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start sm:space-y-0 mb-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Arquivos Técnicos
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Repositório de drivers e ferramentas técnicas organizados por categoria
          </p>
        </div>
        
        {/* Admin Controls - Stack vertically on mobile */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {isAuthenticated ? (
            <>
              <Button onClick={onAddFile} className="flex items-center justify-center gap-2 text-sm">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Adicionar Arquivo</span>
                <span className="sm:hidden">Adicionar</span>
              </Button>
              {/* Apenas admin pode gerenciar usuários */}
              {currentUser === 'admin' && (
                <Button 
                  variant="outline" 
                  onClick={onUserManagement}
                  className="flex items-center justify-center gap-2 text-sm"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Gerenciar Usuários</span>
                  <span className="sm:hidden">Usuários</span>
                </Button>
              )}
              <Button variant="outline" onClick={onLogout} className="flex items-center justify-center gap-2 text-sm">
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              onClick={onLogin}
              className="text-sm w-full sm:w-auto"
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
          className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default ArquivosHeader;
