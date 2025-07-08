
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

// Função para gerar hash consistente da senha (mesma do UserManagement)
const generatePasswordHash = (password: string): string => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'salt_key_2024');
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash + data[i]) & 0xffffffff;
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

      // Verificar senha
      let isPasswordCorrect = false;

      // Para o usuário admin inicial, verificar se ainda usa a senha padrão
      if (username === 'admin' && password === 'admin123') {
        const adminDefaultHash = '$2b$10$K7L/VBPz6.Zx.6KG.6KG.6KG.6KG.6KG.6KG.6KG.6KG.6KG.6KG.6KG.6K';
        isPasswordCorrect = user.password_hash === adminDefaultHash;
      }
      
      // Se não for a senha padrão do admin, verificar com o hash gerado
      if (!isPasswordCorrect) {
        const inputPasswordHash = generatePasswordHash(password);
        console.log('Hash gerado para verificação:', inputPasswordHash);
        console.log('Hash armazenado:', user.password_hash);
        isPasswordCorrect = user.password_hash === inputPasswordHash;
      }
      
      if (isPasswordCorrect) {
        localStorage.setItem('admin_session', 'true');
        localStorage.setItem('current_admin_user', username);
        setIsAuthenticated(true);
        setCurrentUser(username);
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
