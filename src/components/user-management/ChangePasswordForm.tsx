
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { generatePasswordHash, verifyPassword } from '@/utils/passwordUtils';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
}

interface ChangePasswordFormProps {
  open: boolean;
  onClose: () => void;
  users: User[];
}

const ChangePasswordForm = ({ open, onClose, users }: ChangePasswordFormProps) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId || !currentPassword || !newPassword || !confirmPassword) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Buscar o usuário selecionado
      const { data: user, error: userError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', selectedUserId)
        .single();

      if (userError || !user) {
        toast.error('Usuário não encontrado');
        return;
      }

      console.log('Verificando senha atual para usuário:', user.username);

      // Verificar senha atual
      if (!verifyPassword(currentPassword, user.password_hash)) {
        toast.error('Senha atual incorreta');
        return;
      }

      // Gerar hash da nova senha
      const newPasswordHash = generatePasswordHash(newPassword);
      console.log('Atualizando senha para usuário:', user.username);
      console.log('Novo hash gerado:', newPasswordHash);

      // Atualizar senha no banco
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ password_hash: newPasswordHash })
        .eq('id', selectedUserId);

      if (updateError) {
        console.error('Erro ao atualizar senha no banco:', updateError);
        throw updateError;
      }

      // Verificar se a atualização foi bem-sucedida
      const { data: updatedUser, error: verifyError } = await supabase
        .from('admin_users')
        .select('password_hash')
        .eq('id', selectedUserId)
        .single();

      if (verifyError || !updatedUser) {
        throw new Error('Erro ao verificar atualização da senha');
      }

      console.log('Senha atualizada no banco. Hash armazenado:', updatedUser.password_hash);

      // Se for o usuário admin e estiver logado, limpar sessão para forçar novo login
      const currentUser = localStorage.getItem('current_admin_user');
      if (user.username === 'admin' && currentUser === 'admin') {
        console.log('Limpando sessão do admin para forçar novo login');
        localStorage.removeItem('admin_session');
        localStorage.removeItem('current_admin_user');
        
        toast.success('Senha alterada com sucesso! Faça login novamente com a nova senha.');
        
        // Recarregar página para limpar estado
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.success(`Senha do usuário ${user.username} alterada com sucesso!`);
      }

      // Limpar formulário
      setSelectedUserId('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();

    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast.error('Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  const selectedUser = users.find(user => user.id === selectedUserId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar Senha de Usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="user-select">Selecionar Usuário</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId} required>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um usuário" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedUser && (
            <>
              <div>
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Digite a senha atual"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite a nova senha"
                  required
                  minLength={6}
                />
              </div>
              
              <div>
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme a nova senha"
                  required
                  minLength={6}
                />
              </div>
            </>
          )}
          
          <div className="flex gap-2">
            <Button type="submit" disabled={loading || !selectedUserId} className="flex-1">
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordForm;
