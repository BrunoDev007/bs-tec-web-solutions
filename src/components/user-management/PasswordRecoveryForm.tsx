
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
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const generateRecoveryToken = async () => {
    if (!username) {
      toast.error('Digite o nome do usuário primeiro');
      return;
    }

    setLoading(true);
    try {
      // Verificar se o usuário existe
      const { data: user, error: userError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('username', username)
        .single();

      if (userError || !user) {
        toast.error('Usuário não encontrado');
        setLoading(false);
        return;
      }

      // Gerar token único
      const recoveryToken = Math.random().toString(36).substring(2, 15) + 
                           Math.random().toString(36).substring(2, 15);
      
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // Token válido por 24 horas

      // Salvar token no banco
      const { error } = await supabase
        .from('password_reset_tokens')
        .insert([{
          user_id: user.id,
          token: recoveryToken,
          expires_at: expiresAt.toISOString()
        }]);

      if (error) throw error;

      toast.success(`Token de recuperação gerado: ${recoveryToken}`);
      setToken(recoveryToken);
    } catch (error) {
      console.error('Erro ao gerar token:', error);
      toast.error('Erro ao gerar token de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Recuperar Senha</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="recovery-username">Nome de Usuário</Label>
            <Input
              id="recovery-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite o nome do usuário"
            />
          </div>
          <Button 
            onClick={generateRecoveryToken} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Gerando...' : 'Gerar Token de Recuperação'}
          </Button>
          
          {token && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 mb-2">
                Token gerado com sucesso! Compartilhe com o usuário:
              </p>
              <code className="block p-2 bg-white border rounded text-sm break-all">
                {token}
              </code>
              <p className="text-xs text-green-600 mt-2">
                Este token expira em 24 horas.
              </p>
            </div>
          )}
          
          <Button variant="outline" onClick={onClose} className="w-full">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordRecoveryForm;
