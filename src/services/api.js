// API Service Layer – ready for FastAPI backend integration
// When backend is ready, replace mock imports with real Axios calls

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor – attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle 401 globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// ─── Batches ───────────────────────────────────────────────────────────────────
export const batchService = {
  getAll: (params) => api.get('/batches', { params }),
  getById: (id) => api.get(`/batches/${id}`),
  create: (data) => api.post('/batches', data),
  update: (id, data) => api.put(`/batches/${id}`, data),
  delete: (id) => api.delete(`/batches/${id}`),
  getStock: () => api.get('/batches/stock-summary'),
};

// ─── Dispatch ─────────────────────────────────────────────────────────────────
export const dispatchService = {
  getAll: (params) => api.get('/dispatches', { params }),
  getById: (id) => api.get(`/dispatches/${id}`),
  create: (data) => api.post('/dispatches', data),
  updateStatus: (id, status) => api.patch(`/dispatches/${id}/status`, { status }),
  delete: (id) => api.delete(`/dispatches/${id}`),
};

// ─── Sales ─────────────────────────────────────────────────────────────────────
export const salesService = {
  getAll: (params) => api.get('/sales', { params }),
  getById: (id) => api.get(`/sales/${id}`),
  create: (data) => api.post('/sales', data),
  update: (id, data) => api.put(`/sales/${id}`, data),
  getInvoice: (id) => api.get(`/sales/${id}/invoice`),
  getReturns: (params) => api.get('/sales/returns', { params }),
  createReturn: (data) => api.post('/sales/returns', data),
};

// ─── Collections ───────────────────────────────────────────────────────────────
export const collectionService = {
  getAll: (params) => api.get('/collections', { params }),
  create: (data) => api.post('/collections', data),
  verify: (id) => api.patch(`/collections/${id}/verify`),
  getOutstanding: (params) => api.get('/collections/outstanding', { params }),
  getLedger: (dealerId, params) => api.get(`/collections/ledger/${dealerId}`, { params }),
};

// ─── Spoilage ─────────────────────────────────────────────────────────────────
export const spoilageService = {
  getAll: (params) => api.get('/spoilage', { params }),
  create: (data) => api.post('/spoilage', data),
  approve: (id) => api.patch(`/spoilage/${id}/approve`),
};

// ─── Settlement ────────────────────────────────────────────────────────────────
export const settlementService = {
  getSummary: (params) => api.get('/settlements/summary', { params }),
  settle: (data) => api.post('/settlements', data),
  getHistory: (params) => api.get('/settlements', { params }),
};

// ─── Masters ───────────────────────────────────────────────────────────────────
export const productService = {
  getAll: (params) => api.get('/masters/products', { params }),
  create: (data) => api.post('/masters/products', data),
  update: (id, data) => api.put(`/masters/products/${id}`, data),
  delete: (id) => api.delete(`/masters/products/${id}`),
};

export const routeService = {
  getAll: (params) => api.get('/masters/routes', { params }),
  create: (data) => api.post('/masters/routes', data),
  update: (id, data) => api.put(`/masters/routes/${id}`, data),
};

export const dealerService = {
  getAll: (params) => api.get('/masters/dealers', { params }),
  getById: (id) => api.get(`/masters/dealers/${id}`),
  create: (data) => api.post('/masters/dealers', data),
  update: (id, data) => api.put(`/masters/dealers/${id}`, data),
};

export const salespersonService = {
  getAll: (params) => api.get('/masters/salespersons', { params }),
  create: (data) => api.post('/masters/salespersons', data),
  update: (id, data) => api.put(`/masters/salespersons/${id}`, data),
};

export const vehicleService = {
  getAll: (params) => api.get('/masters/vehicles', { params }),
  create: (data) => api.post('/masters/vehicles', data),
  update: (id, data) => api.put(`/masters/vehicles/${id}`, data),
};

// ─── Reports ───────────────────────────────────────────────────────────────────
export const reportService = {
  getSalesReport: (params) => api.get('/reports/sales', { params }),
  getStockReport: (params) => api.get('/reports/stock', { params }),
  getCollectionReport: (params) => api.get('/reports/collections', { params }),
  getSettlementReport: (params) => api.get('/reports/settlements', { params }),
  getSpoilageReport: (params) => api.get('/reports/spoilage', { params }),
};

// ─── Admin ─────────────────────────────────────────────────────────────────────
export const adminService = {
  getUsers: (params) => api.get('/admin/users', { params }),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  getAuditLog: (params) => api.get('/admin/audit', { params }),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
};

// ─── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getSalesChart: (params) => api.get('/dashboard/sales-chart', { params }),
  getStockSummary: () => api.get('/dashboard/stock-summary'),
};

export default api;
