import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trash2, Edit, Key, Plus } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at?: string;
}

interface UserManagementProps {
  onBack: () => void;
}

const UserManagement = ({ onBack }: UserManagementProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Criar usuário ADMIN se não existir
  const createAdminUser = async () => {
    try {
      // Usar edge function para criar o usuário ADMIN
      const { data, error } = await supabase.functions.invoke('create-admin');
      
      if (error) {
        console.error('Erro ao criar usuário ADMIN:', error);
        toast.error('Erro ao criar usuário ADMIN: ' + error.message);
      } else {
        console.log('Resposta da criação do usuário ADMIN:', data);
        toast.success(data.message || 'Usuário ADMIN configurado!');
      }
    } catch (error) {
      console.error('Erro ao criar usuário ADMIN:', error);
      toast.error('Erro ao criar usuário ADMIN');
    }
  };

  // Buscar usuários
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Sempre tentar criar o usuário ADMIN primeiro
      await createAdminUser();
      
      // Aguardar para garantir que foi criado
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) {
        toast.error('Erro ao buscar usuários: ' + error.message);
      } else {
        const formattedUsers = data.users.map((user: SupabaseUser) => ({
          id: user.id,
          email: user.email || '',
          created_at: user.created_at,
          email_confirmed_at: user.email_confirmed_at
        }));
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast.error('Erro ao buscar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Criar usuário
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true
      });

      if (error) {
        toast.error('Erro ao criar usuário: ' + error.message);
      } else {
        toast.success('Usuário criado com sucesso!');
        setFormData({ email: '', password: '', confirmPassword: '' });
        setShowCreateForm(false);
        fetchUsers();
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast.error('Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  // Excluir usuário
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) {
        toast.error('Erro ao excluir usuário: ' + error.message);
      } else {
        toast.success('Usuário excluído com sucesso!');
        fetchUsers();
      }
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário');
    } finally {
      setLoading(false);
    }
  };

  // Alterar senha do usuário
  const handleChangePassword = async (userId: string) => {
    const newPassword = prompt('Digite a nova senha (mínimo 6 caracteres):');
    if (!newPassword || newPassword.length < 6) {
      toast.error('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        password: newPassword
      });

      if (error) {
        toast.error('Erro ao alterar senha: ' + error.message);
      } else {
        toast.success('Senha alterada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast.error('Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  // Editar email do usuário
  const handleEditUser = async (userId: string) => {
    const newEmail = prompt('Digite o novo email:');
    if (!newEmail || !newEmail.includes('@')) {
      toast.error('Email inválido');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        email: newEmail
      });

      if (error) {
        toast.error('Erro ao editar usuário: ' + error.message);
      } else {
        toast.success('Usuário editado com sucesso!');
        fetchUsers();
      }
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      toast.error('Erro ao editar usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gerenciamento de Usuários</CardTitle>
            <div className="flex gap-2">
              <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Novo Usuário</DialogTitle>
                    <DialogDescription>
                      Preencha os dados para criar um novo usuário no sistema.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1"
                      >
                        {loading ? 'Criando...' : 'Criar Usuário'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <Button onClick={onBack} variant="outline">
                Voltar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && users.length === 0 ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.email_confirmed_at 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.email_confirmed_at ? 'Confirmado' : 'Pendente'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditUser(user.id)}
                          disabled={loading}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleChangePassword(user.id)}
                          disabled={loading}
                        >
                          <Key className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;