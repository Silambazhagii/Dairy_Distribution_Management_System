import { useContext } from 'react';
import { ToastContext } from '../context/ToastContextObject';
import type { ToastFn } from '../types';

export const useToast = (): ToastFn => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
};
