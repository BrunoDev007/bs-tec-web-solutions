
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PasswordRecoveryFormProps {
  open: boolean;
  onClose: () => void;
}

const PasswordRecoveryForm = ({ open, onClose }: PasswordRecoveryFormProps) => {
  const [recoveryUsername, setRecoveryUsername] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryUsername || !recoveryEmail) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);

      // Verificar se usuário existe
      const { data: user, error } = await supabase
        .from('admin_users')
        .select('id, username')
        .eq('username', recoveryUsername)
        .single();

      if (error || !user) {
        toast.error('Usuário não encontrado');
        return;
      }

      // Gerar token de recuperação
      const recoveryToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // Token expira em 1 hora

      const { error: tokenError } = await supabase
        .from('password_reset_tokens')
        .insert([
          {
            user_id: user.id,
            token: recoveryToken,
            expires_at: expiresAt.toISOString()
          }
        ]);

      if (tokenError) throw tokenError;

      // Simular envio de email (implementar integração com serviço de email)
      console.log(`Token de recuperação para ${recoveryUsername}: ${recoveryToken}`);
      console.log(`Email de recuperação enviado para: ${recoveryEmail}`);

      toast.success(`Instruções de recuperação enviadas para ${recoveryEmail}`);
      setRecoveryUsername('');
      setRecoveryEmail('');
      onClose();
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      toast.error('Erro ao processar recuperação de senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recuperar Senha</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="recoveryUsername">Nome de Usuário</Label>
            <Input
              id="recoveryUsername"
              value={recoveryUsername}
              onChange={(e) => setRecoveryUsername(e.target.value)}
              placeholder="Digite o nome do usuário"
              required
            />
          </div>
          <div>
            <Label htmlFor="recoveryEmail">Email para Recuperação</Label>
            <Input
              id="recoveryEmail"
              type="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              placeholder="Digite o email para envio das instruções"
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Instruções'}
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

export default PasswordRecoveryForm;
