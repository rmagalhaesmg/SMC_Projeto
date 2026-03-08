import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../api';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  subscription?: { plan: string; status: string };
}

interface AuthCtx {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('access_token');
    const u = localStorage.getItem('smc_user');
    if (t) {
      setToken(t);
      if (u) { try { setUser(JSON.parse(u)); } catch {} }
      refreshUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    const { access_token } = res.data;
    localStorage.setItem('access_token', access_token);
    setToken(access_token);
    await refreshUser();
  };

  const register = async (email: string, password: string, name: string) => {
    await apiClient.post('/auth/register', { email, password, nome: name });
    await login(email, password);
  };

  const refreshUser = async () => {
    const t = localStorage.getItem('access_token');
    if (!t) return;
    try {
      const res = await apiClient.get('/auth/me', { headers: { Authorization: `Bearer ${t}` } });
      const u = res.data;
      setUser(u);
      localStorage.setItem('smc_user', JSON.stringify(u));
    } catch {
      // token may be invalid
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('smc_user');
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{
      user, token,
      isAuthenticated: !!token,
      isLoading,
      login, register, logout, refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
