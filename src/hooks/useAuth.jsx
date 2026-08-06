// Auth context
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Mock user for demo
const MOCK_USER = {
  id: 'U001',
  name: 'Admin User',
  email: 'admin@dairy.com',
  role: 'Admin',
  avatar: null,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('erp_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [session, setSessionState] = useState(() => {
    return localStorage.getItem('erp_session') || 'Morning';
  });

  const setSession = (s) => {
    setSessionState(s);
    localStorage.setItem('erp_session', s);
  };

  const login = async (email, password) => {
    // Mock login – replace with API call
    if (email && password) {
      const u = { ...MOCK_USER };
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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
