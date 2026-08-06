// Utility helpers

// Format currency (Indian Rupee)
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format number with commas
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '—';
  return new Intl.NumberFormat('en-IN').format(num);
};

// Format date to DD MMM YYYY
export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Format date-time
export const formatDateTime = (date) => {
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
export const todayISO = () => new Date().toISOString().split('T')[0];

// Get current session (Morning before 12pm, Evening after)
export const getCurrentSession = () => {
  const hour = new Date().getHours();
  return hour < 12 ? 'Morning' : 'Evening';
};

// Format today's date human-readable
export const getTodayFormatted = () => {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Truncate text
export const truncate = (str, len = 30) => {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '…' : str;
};

// Generate a simple unique ID (for mock data)
export const generateId = (prefix = 'ID') => {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Compute outstanding balance
export const computeOutstanding = ({ previous, creditSales, collections, adjustments = 0 }) => {
  return previous + creditSales - collections - adjustments;
};

// Compute available stock
export const computeStock = ({ opening, received, dispatched, spoilage, adjustments = 0 }) => {
  return opening + received - dispatched - spoilage + adjustments;
};

// Debounce helper
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// Sort array of objects by key
export const sortBy = (arr, key, dir = 'asc') => {
  return [...arr].sort((a, b) => {
    if (a[key] < b[key]) return dir === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return dir === 'asc' ? 1 : -1;
    return 0;
  });
};

// Filter array by search term across multiple keys
export const filterBySearch = (arr, term, keys) => {
  if (!term) return arr;
  const lower = term.toLowerCase();
  return arr.filter((item) =>
    keys.some((key) => String(item[key] ?? '').toLowerCase().includes(lower))
  );
};

// Paginate array
export const paginate = (arr, page, perPage) => {
  const start = (page - 1) * perPage;
  return arr.slice(start, start + perPage);
};
