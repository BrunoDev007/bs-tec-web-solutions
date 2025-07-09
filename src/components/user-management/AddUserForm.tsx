
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { generatePasswordHash } from '@/utils/passwordUtils';
import { toast } from 'sonner';

interface AddUserFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddUserForm = ({ open, onClose, onSuccess }: AddUserFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const passwordHash = generatePasswordHash(password);
      
      const { error } = await supabase
        .from('admin_users')
        .insert([{
          username,
          password_hash: passwordHash
        }]);

      if (error) throw error;

      toast.success('Usuário cadastrado com sucesso!');
      setUsername('');
      setPassword('');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erro ao cadastrar usuário:', error);
      if (error.code === '23505') {
        toast.error('Este nome de usuário já existe!');
      } else {
        toast.error('Erro ao cadastrar usuário');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="new-username">Nome de Usuário</Label>
            <Input
              id="new-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="new-password">Senha</Label>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
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
