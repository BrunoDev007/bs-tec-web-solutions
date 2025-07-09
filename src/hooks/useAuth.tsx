
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
      
      // Buscar usuário no banco de dados (incluindo admin)
      const { data: user, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .single();

      // Se usuário não encontrado e for admin com senha padrão, criar
      if (error && error.code === 'PGRST116' && username === 'admin' && password === 'admin123') {
        console.log('Criando usuário admin padrão...');
        const adminHash = generatePasswordHash('admin123');
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert([{ username: 'admin', password_hash: adminHash }]);
        
        if (insertError) {
          console.error('Erro ao criar usuário admin:', insertError);
          return false;
        }

        // Fazer login do admin recém-criado
        localStorage.setItem('admin_session', 'true');
        localStorage.setItem('current_admin_user', 'admin');
        setIsAuthenticated(true);
        setCurrentUser('admin');
        console.log('Admin criado e login realizado com sucesso!');
        return true;
      }

      if (error || !user) {
        console.error('Usuário não encontrado:', error);
        return false;
      }

      console.log('Usuário encontrado:', user.username);
      console.log('Hash armazenado no banco:', user.password_hash);
      
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
