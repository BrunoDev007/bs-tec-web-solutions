
import React from 'react';
import { User, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  created_at: string;
}

interface UsersListProps {
  users: User[];
  currentUser: string | null;
  loading: boolean;
  onRefresh: () => void;
}

const UsersList = ({ users, currentUser, loading, onRefresh }: UsersListProps) => {
  const handleDeleteUser = async (userId: string, username: string) => {
    if (username === 'admin') {
      toast.error('Não é possível excluir o usuário admin');
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir o usuário "${username}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast.success('Usuário excluído com sucesso!');
      onRefresh();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2">Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">Usuários Cadastrados</h3>
      <div className="border rounded-lg overflow-hidden">
        {users.map((user) => (
          <div 
            key={user.id} 
            className="flex items-center justify-between p-3 border-b last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-gray-500">
                  Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            {user.username !== 'admin' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteUser(user.id, user.username)}
                className="text-red-600 hover:text-red-700"
                title="Excluir usuário"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersList;
