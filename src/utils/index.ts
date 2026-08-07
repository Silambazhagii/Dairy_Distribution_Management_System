import type { OutstandingParams, StockParams, UserRole } from '../types';
import { ROLE_PERMISSIONS } from '../constants';

export function isPathAllowed(path: string, role: UserRole): boolean {
  const allowed = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS['Admin'];
  return allowed.some((prefix) => {
    if (prefix === '/') return path === '/';
    return path.startsWith(prefix);
  });
}

// Format currency (Indian Rupee)
export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format number with commas
export const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return '—';
  return new Intl.NumberFormat('en-IN').format(num);
};

// Format date to DD MMM YYYY
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Format date-time
export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get today's date in ISO format
export const todayISO = (): string => new Date().toISOString().split('T')[0];

// Get current session (Morning before 12pm, Evening after)
export const getCurrentSession = (): 'Morning' | 'Evening' => {
  const hour = new Date().getHours();
  return hour < 12 ? 'Morning' : 'Evening';
};

// Format today's date human-readable
export const getTodayFormatted = (): string => {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Truncate text
export const truncate = (str: string | null | undefined, len = 30): string => {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '…' : str;
};

// Generate a simple unique ID (for mock data)
export const generateId = (prefix = 'ID'): string => {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Compute outstanding balance
export const computeOutstanding = ({ previous, creditSales, collections, adjustments = 0 }: OutstandingParams): number => {
  return previous + creditSales - collections - adjustments;
};

// Compute available stock
export const computeStock = ({ opening, received, dispatched, spoilage, adjustments = 0 }: StockParams): number => {
  return opening + received - dispatched - spoilage + adjustments;
};

// Debounce helper
export const debounce = <T extends (...args: unknown[]) => unknown>(fn: T, delay = 300): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// Sort array of objects by key
export const sortBy = <T extends object>(arr: T[], key: keyof T, dir: 'asc' | 'desc' = 'asc'): T[] => {
  return [...arr].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];
    if (valA < valB) return dir === 'asc' ? -1 : 1;
    if (valA > valB) return dir === 'asc' ? 1 : -1;
    return 0;
  });
};

// Filter array by search term across multiple keys
export const filterBySearch = <T extends object>(arr: T[], term: string, keys: (keyof T)[]): T[] => {
  if (!term) return arr;
  const lower = term.toLowerCase();
  return arr.filter((item) =>
    keys.some((key) => String(item[key] ?? '').toLowerCase().includes(lower))
  );
};

// Paginate array
export const paginate = <T>(arr: T[], page: number, perPage: number): T[] => {
  const start = (page - 1) * perPage;
  return arr.slice(start, start + perPage);
};
