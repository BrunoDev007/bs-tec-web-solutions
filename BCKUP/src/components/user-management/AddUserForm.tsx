
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generatePasswordHash } from '@/utils/passwordUtils';

interface AddUserFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddUserForm = ({ open, onClose, onSuccess }: AddUserFormProps) => {
  const [newUsername, setNewUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newUserPassword) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      
      // Verificar se usuário já existe
      const { data: existingUser } = await supabase
        .from('admin_users')
        .select('username')
        .eq('username', newUsername)
        .single();

      if (existingUser) {
        toast.error('Usuário já existe');
        return;
      }

      // Gerar hash da senha usando a função utilitária
      const hashedPassword = generatePasswordHash(newUserPassword);
      console.log('Criando usuário com hash:', hashedPassword);
      
      const { error } = await supabase
        .from('admin_users')
        .insert([
          { username: newUsername, password_hash: hashedPassword }
        ]);

      if (error) throw error;

      toast.success('Usuário cadastrado com sucesso!');
      setNewUsername('');
      setNewUserPassword('');
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      toast.error('Erro ao cadastrar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserForm;
