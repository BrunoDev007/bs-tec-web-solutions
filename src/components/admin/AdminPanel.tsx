import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import ChangePasswordForm from './ChangePasswordForm';
import CreateUserForm from './CreateUserForm';
import UserManagement from './UserManagement';

const AdminPanel = () => {
  const { signOut } = useSecureAuth();
  const [activeForm, setActiveForm] = useState<'password' | 'user' | 'management' | null>(null);

  const handleSignOut = async () => {
    await signOut();
    setActiveForm(null);
  };

  if (activeForm === 'password') {
    return <ChangePasswordForm onBack={() => setActiveForm(null)} />;
  }

  if (activeForm === 'user') {
    return <CreateUserForm onBack={() => setActiveForm(null)} />;
  }

  if (activeForm === 'management') {
    return <UserManagement onBack={() => setActiveForm(null)} />;
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Painel Administrativo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => setActiveForm('password')}
            className="w-full"
            variant="outline"
          >
            Alterar Senha
          </Button>
          
          <Button
            onClick={() => setActiveForm('user')}
            className="w-full"
            variant="outline"
          >
            Cadastrar Novo Usuário
          </Button>
          
          <Button
            onClick={() => setActiveForm('management')}
            className="w-full"
            variant="outline"
          >
            Gerenciar Usuários
          </Button>
          
          <Button
            onClick={handleSignOut}
            className="w-full"
            variant="destructive"
          >
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;