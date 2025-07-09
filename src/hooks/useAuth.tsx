
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { verifyPassword, generatePasswordHash } from '@/utils/passwordUtils';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se existe sessão ativa
    const session = localStorage.getItem('admin_session');
    const username = localStorage.getItem('current_admin_user');
    if (session && username) {
      setIsAuthenticated(true);
      setCurrentUser(username);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Tentando fazer login com:', username);
      
      // Verificar se é o usuário admin padrão
      if (username === 'admin' && password === 'admin123') {
        console.log('Login do admin padrão detectado');
        
        // Verificar se o usuário admin existe no banco
        const { data: existingUser, error: selectError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('username', 'admin')
          .single();

        if (selectError && selectError.code === 'PGRST116') {
          // Usuário admin não existe, criar
          console.log('Criando usuário admin padrão...');
          const adminHash = generatePasswordHash('admin123');
          const { error: insertError } = await supabase
            .from('admin_users')
            .insert([{ username: 'admin', password_hash: adminHash }]);
          
          if (insertError) {
            console.error('Erro ao criar usuário admin:', insertError);
          } else {
            console.log('Usuário admin criado com sucesso');
          }
        } else if (existingUser && !verifyPassword(password, existingUser.password_hash)) {
          // Usuário existe mas senha não confere, atualizar hash
          console.log('Atualizando hash da senha do admin...');
          const newHash = generatePasswordHash('admin123');
          const { error: updateError } = await supabase
            .from('admin_users')
            .update({ password_hash: newHash })
            .eq('username', 'admin');
          
          if (updateError) {
            console.error('Erro ao atualizar senha do admin:', updateError);
          } else {
            console.log('Hash da senha do admin atualizado');
          }
        }

        // Fazer login do admin
        localStorage.setItem('admin_session', 'true');
        localStorage.setItem('current_admin_user', 'admin');
        setIsAuthenticated(true);
        setCurrentUser('admin');
        console.log('Login do admin realizado com sucesso!');
        return true;
      }

      // Buscar usuário normal no banco de dados
      const { data: user, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        console.error('Erro ao buscar usuário:', error);
        return false;
      }

      if (!user) {
        console.error('Usuário não encontrado');
        return false;
      }

      console.log('Usuário encontrado:', user.username);
      
      // Verificar senha usando a função utilitária
      if (verifyPassword(password, user.password_hash)) {
        localStorage.setItem('admin_session', 'true');
        localStorage.setItem('current_admin_user', username);
        setIsAuthenticated(true);
        setCurrentUser(username);
        console.log('Login realizado com sucesso!');
        return true;
      }

      console.error('Senha incorreta');
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('current_admin_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
