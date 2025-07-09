
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generatePasswordHash, verifyPassword } from '@/utils/passwordUtils';

interface User {
  id: string;
  username: string;
  created_at: string;
}

interface ChangePasswordFormProps {
  open: boolean;
  onClose: () => void;
  users: User[];
}

const ChangePasswordForm = ({ open, onClose, users }: ChangePasswordFormProps) => {
  const [selectedUserForPassword, setSelectedUserForPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForPassword || !currentPassword || !newPassword) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);

      // Buscar usuário selecionado
      const { data: user, error: userError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', selectedUserForPassword)
        .single();

      if (userError || !user) {
        console.error('Usuário não encontrado:', userError);
        toast.error('Usuário não encontrado');
        return;
      }

      console.log('Usuário encontrado para alteração de senha:', user.username);

      // Verificar senha atual usando a função utilitária
      if (!verifyPassword(currentPassword, user.password_hash)) {
        console.error('Senha atual incorreta');
        toast.error('Senha atual incorreta');
        return;
      }

      // Gerar hash da nova senha usando a função utilitária
      const newPasswordHash = generatePasswordHash(newPassword);
      console.log('Alterando senha para o hash:', newPasswordHash);
      
      const { error } = await supabase
        .from('admin_users')
        .update({ password_hash: newPasswordHash })
        .eq('username', selectedUserForPassword);

      if (error) throw error;

      toast.success(`Senha do usuário ${selectedUserForPassword} alterada com sucesso!`);
      setSelectedUserForPassword('');
      setCurrentPassword('');
      setNewPassword('');
      onClose();
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast.error('Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar Senha</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="selectedUser">Selecionar Usuário</Label>
            <Select value={selectedUserForPassword} onValueChange={setSelectedUserForPassword}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o usuário" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.username}>
                    {user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
