import React, { useState } from 'react';
import { AuthContext } from './AuthContextObject';
import type { User, Session } from '../types';

export { AuthContext } from './AuthContextObject';

const MOCK_USER: User = {
  id: 'U001',
  name: 'Admin User',
  email: 'admin@dairy.com',
  role: 'Admin',
  avatar: null,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('erp_user');
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const [session, setSessionState] = useState<Session>(() => {
    return (localStorage.getItem('erp_session') as Session) || 'Morning';
  });

  const setSession = (s: Session) => {
    setSessionState(s);
    localStorage.setItem('erp_session', s);
  };

  const login = async (email: string, password: string): Promise<User> => {
    if (email && password) {
      const u: User = { ...MOCK_USER };
      setUser(u);
      localStorage.setItem('erp_user', JSON.stringify(u));
      localStorage.setItem('auth_token', 'mock-token-abc123');
      return u;
    }
    throw new Error('Invalid credentials');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('erp_user');
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, session, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}
