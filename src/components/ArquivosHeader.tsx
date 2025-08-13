
import React from 'react';
import { Search, Plus, LogIn, LogOut, KeyRound, Users, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ArquivosHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddFile: () => void;
  onLogin: () => void;
  onChangePassword: () => void;
  onManageUsers: () => void;
  onCreateUser: () => void;
}

const ArquivosHeader = ({
  searchTerm,
  onSearchChange,
  onAddFile,
  onLogin,
  onChangePassword,
  onManageUsers,
  onCreateUser,
}: ArquivosHeaderProps) => {
  const { user, signOut } = useSecureAuth();
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
          {user ? (
            <>
              <Button onClick={onAddFile} className="flex items-center justify-center gap-2 text-sm">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Adicionar Arquivo</span>
                <span className="sm:hidden">Adicionar</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center justify-center gap-2 text-sm">
                    <span className="hidden sm:inline">Painel Admin</span>
                    <span className="sm:hidden">Admin</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="z-50 w-56 bg-popover">
                  <DropdownMenuItem onClick={onChangePassword} className="gap-2">
                    <KeyRound className="h-4 w-4" /> Alterar Senha
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onManageUsers} className="gap-2">
                    <Users className="h-4 w-4" /> Gerenciar Usuários
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onCreateUser} className="gap-2">
                    <UserPlus className="h-4 w-4" /> Cadastrar Novo Usuário
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                variant="outline" 
                onClick={signOut} 
                className="flex items-center justify-center gap-2 text-sm"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </>
          ) : (
            <Button 
              onClick={onLogin} 
              className="flex items-center justify-center gap-2 text-sm"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Login Admin</span>
              <span className="sm:hidden">Login</span>
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