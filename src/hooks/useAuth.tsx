
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

// Função simplificada para gerar hash da senha
const generatePasswordHash = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `$2b$10$${Math.abs(hash).toString(16).padStart(22, '0').substring(0, 22)}`;
};

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
      
      // Buscar usuário no banco de dados
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
      console.log('Hash armazenado:', user.password_hash);

      // Verificar senha
      let isPasswordCorrect = false;

      // Para o admin com senha padrão
      if (username === 'admin' && password === 'admin123') {
        // Hash específico para admin123
        const adminHash = generatePasswordHash('admin123');
        console.log('Hash gerado para admin123:', adminHash);
        isPasswordCorrect = user.password_hash === adminHash;
      } else {
        // Para outros usuários ou admin com senha alterada
        const inputPasswordHash = generatePasswordHash(password);
        console.log('Hash gerado para senha:', inputPasswordHash);
        isPasswordCorrect = user.password_hash === inputPasswordHash;
      }
      
      if (isPasswordCorrect) {
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
