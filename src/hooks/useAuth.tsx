
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
      // Buscar usuário no banco de dados
      const { data: user, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !user) {
        console.error('Usuário não encontrado:', error);
        return false;
      }

      // Verificar senha (simulação - em produção use bcrypt adequado)
      const inputPasswordHash = `$2b$10$${btoa(password).replace(/[^A-Za-z0-9]/g, '').substring(0, 53)}`;
      
      if (user.password_hash === inputPasswordHash) {
        localStorage.setItem('admin_session', 'true');
        localStorage.setItem('current_admin_user', username);
        setIsAuthenticated(true);
        setCurrentUser(username);
        return true;
      }

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
