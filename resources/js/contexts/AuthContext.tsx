import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { router } from '@inertiajs/react';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  isProfesor: () => boolean;
  isEstudiante: () => boolean;
  isDirector: () => boolean;
  isPadre: () => boolean;
  isAdmin: () => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser?: User | null;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  initialUser = null 
}) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await router.post('/login', {
        email,
        password,
      });
    } catch (error) {
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    router.post('/logout');
    setUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.roles.includes(role);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.some(role => user.roles.includes(role));
  };

  const isProfesor = (): boolean => {
    return user?.is_profesor || false;
  };

  const isEstudiante = (): boolean => {
    return user?.is_estudiante || false;
  };

  const isDirector = (): boolean => {
    return user?.is_director || false;
  };

  const isPadre = (): boolean => {
    return user?.is_padre || false;
  };

  const isAdmin = (): boolean => {
    return user?.is_admin || false;
  };

  // Escuchar cambios en el usuario desde Inertia
  useEffect(() => {
    const handlePageLoad = (event: any) => {
      if (event.detail.page.props.auth?.user) {
        setUser(event.detail.page.props.auth.user);
      }
    };

    window.addEventListener('inertia:success', handlePageLoad);
    
    return () => {
      window.removeEventListener('inertia:success', handlePageLoad);
    };
  }, []);

  const value: AuthContextType = {
    user,
    login,
    logout,
    hasPermission,
    hasRole,
    hasAnyRole,
    isProfesor,
    isEstudiante,
    isDirector,
    isPadre,
    isAdmin,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
