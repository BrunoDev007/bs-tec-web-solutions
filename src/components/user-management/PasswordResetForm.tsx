
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { generatePasswordHash } from '@/utils/passwordUtils';
import { toast } from 'sonner';

interface PasswordResetFormProps {
  open: boolean;
  onClose: () => void;
}

const PasswordResetForm = ({ open, onClose }: PasswordResetFormProps) => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !newPassword || !confirmPassword) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    
    try {
      // Verificar se o token é válido e não expirou
      const { data: tokenData, error: tokenError } = await supabase
        .from('password_reset_tokens')
        .select('*')
        .eq('token', token)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (tokenError || !tokenData) {
        toast.error('Token inválido ou expirado');
        return;
      }

      // Buscar dados do usuário
      const { data: userData, error: userError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', tokenData.user_id)
        .single();

      if (userError || !userData) {
        toast.error('Usuário não encontrado');
        return;
      }

      // Gerar novo hash da senha
      const newPasswordHash = generatePasswordHash(newPassword);

      // Atualizar a senha do usuário
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ password_hash: newPasswordHash })
        .eq('id', tokenData.user_id);

      if (updateError) {
        throw updateError;
      }

      // Marcar o token como usado
      const { error: tokenUpdateError } = await supabase
        .from('password_reset_tokens')
        .update({ used: true })
        .eq('id', tokenData.id);

      if (tokenUpdateError) {
        console.error('Erro ao invalidar token:', tokenUpdateError);
      }

      toast.success(`Senha do usuário ${userData.username} redefinida com sucesso!`);
      
      // Limpar formulário
      setToken('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();

    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      toast.error('Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Redefinir Senha</DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="reset-token">Token de Recuperação</Label>
                <Input
                  id="reset-token"
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Digite o token recebido"
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
              
              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Redefinindo...' : 'Redefinir Senha'}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordResetForm;
