
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
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
      toast.error('Não é possível excluir o usuário admin principal');
      return;
    }

    if (username === currentUser) {
      toast.error('Não é possível excluir seu próprio usuário');
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir o usuário ${username}?`)) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuários Cadastrados</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Carregando...</div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-gray-500">
                    Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {user.username !== 'admin' && user.username !== currentUser && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id, user.username)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersList;
