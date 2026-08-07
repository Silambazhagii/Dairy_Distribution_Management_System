import { createContext } from 'react';
import type { ToastFn } from '../types';

export const ToastContext = createContext<ToastFn | null>(null);
