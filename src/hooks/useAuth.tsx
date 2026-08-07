import { useContext } from 'react';
import { AuthContext } from '../context/AuthContextObject';
import type { AuthContextValue } from '../types';

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
