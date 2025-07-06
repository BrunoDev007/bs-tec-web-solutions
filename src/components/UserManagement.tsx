
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserPlus, Key, Trash2 } from 'lucide-react';

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
  
  // Form states
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');

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

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newUserPassword) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      
      // Simular hash da senha (em produção use bcrypt adequado)
      const hashedPassword = `$2b$10$${btoa(newUserPassword).replace(/[^A-Za-z0-9]/g, '').substring(0, 53)}`;
      
      const { error } = await supabase
        .from('admin_users')
        .insert([
          { username: newUsername, password_hash: hashedPassword }
        ]);

      if (error) throw error;

      toast.success('Usuário cadastrado com sucesso!');
      setNewUsername('');
      setNewUserPassword('');
      setShowAddUser(false);
      loadUsers();
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      toast.error('Erro ao cadastrar usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);

      // Verificar senha atual (simulação - em produção use verificação adequada)
      const currentUser = localStorage.getItem('current_admin_user');
      if (!currentUser) {
        toast.error('Usuário não encontrado');
        return;
      }

      // Simular hash da nova senha
      const hashedPassword = `$2b$10$${btoa(newPassword).replace(/[^A-Za-z0-9]/g, '').substring(0, 53)}`;
      
      const { error } = await supabase
        .from('admin_users')
        .update({ password_hash: hashedPassword })
        .eq('username', 'admin'); // Por enquanto apenas admin

      if (error) throw error;

      toast.success('Senha alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setShowChangePassword(false);
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast.error('Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (username === 'admin') {
      toast.error('Não é possível excluir o usuário admin principal');
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir o usuário ${username}?`)) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast.success('Usuário excluído com sucesso!');
      loadUsers();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Usuários</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Botões de ação */}
          <div className="flex gap-2">
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
          </div>

          {/* Lista de usuários */}
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
                      {user.username !== 'admin' && (
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

          {/* Modal Cadastrar Usuário */}
          <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <Label htmlFor="newUsername">Nome de Usuário</Label>
                  <Input
                    id="newUsername"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="newUserPassword">Senha</Label>
                  <Input
                    id="newUserPassword"
                    type="password"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddUser(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Modal Alterar Senha */}
          <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Alterar Senha</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Alterando...' : 'Alterar Senha'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowChangePassword(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagement;
