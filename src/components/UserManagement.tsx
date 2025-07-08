
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserPlus, Key, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AddUserForm from './user-management/AddUserForm';
import ChangePasswordForm from './user-management/ChangePasswordForm';
import PasswordRecoveryForm from './user-management/PasswordRecoveryForm';
import UsersList from './user-management/UsersList';

interface User {
  id: string;
  username: string;
  created_at: string;
}

interface UserManagementProps {
  open: boolean;
  onClose: () => void;
}

const UserManagement = ({ open, onClose }: UserManagementProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);

  const { currentUser } = useAuth();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, username, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadUsers();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Usuários</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Botões de ação */}
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => setShowAddUser(true)} 
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Cadastrar Usuário
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowChangePassword(true)} 
              className="flex items-center gap-2"
            >
              <Key className="h-4 w-4" />
              Alterar Senha
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowPasswordRecovery(true)} 
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Recuperar Senha
            </Button>
          </div>

          {/* Lista de usuários */}
          <UsersList 
            users={users}
            currentUser={currentUser}
            loading={loading}
            onRefresh={loadUsers}
          />

          {/* Formulários */}
          <AddUserForm 
            open={showAddUser}
            onClose={() => setShowAddUser(false)}
            onSuccess={loadUsers}
          />

          <ChangePasswordForm 
            open={showChangePassword}
            onClose={() => setShowChangePassword(false)}
            users={users}
          />

          <PasswordRecoveryForm 
            open={showPasswordRecovery}
            onClose={() => setShowPasswordRecovery(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagement;
