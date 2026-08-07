// API Service Layer – ready for FastAPI backend integration
// When backend is ready, replace mock imports with real Axios calls

import axios, { type InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor – attach auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// Response interceptor – handle 401 globally
api.interceptors.response.use(
  (response) => response.data,
  (error: { response?: { status?: number; data?: unknown }; message?: string }) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const authService = {
  login:  (credentials: { email: string; password: string }) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  me:     () => api.get('/auth/me'),
};

// ─── Batches ───────────────────────────────────────────────────────────────────
export const batchService = {
  getAll:   (params?: Record<string, unknown>)                    => api.get('/batches', { params }),
  getById:  (id: string)                                          => api.get(`/batches/${id}`),
  create:   (data: Record<string, unknown>)                       => api.post('/batches', data),
  update:   (id: string, data: Record<string, unknown>)           => api.put(`/batches/${id}`, data),
  delete:   (id: string)                                          => api.delete(`/batches/${id}`),
  getStock: ()                                                    => api.get('/batches/stock-summary'),
};

// ─── Dispatch ─────────────────────────────────────────────────────────────────
export const dispatchService = {
  getAll:       (params?: Record<string, unknown>)                => api.get('/dispatches', { params }),
  getById:      (id: string)                                      => api.get(`/dispatches/${id}`),
  create:       (data: Record<string, unknown>)                   => api.post('/dispatches', data),
  updateStatus: (id: string, status: string)                      => api.patch(`/dispatches/${id}/status`, { status }),
  delete:       (id: string)                                      => api.delete(`/dispatches/${id}`),
};

// ─── Sales ─────────────────────────────────────────────────────────────────────
export const salesService = {
  getAll:       (params?: Record<string, unknown>)                => api.get('/sales', { params }),
  getById:      (id: string)                                      => api.get(`/sales/${id}`),
  create:       (data: Record<string, unknown>)                   => api.post('/sales', data),
  update:       (id: string, data: Record<string, unknown>)       => api.put(`/sales/${id}`, data),
  getInvoice:   (id: string)                                      => api.get(`/sales/${id}/invoice`),
  getReturns:   (params?: Record<string, unknown>)                => api.get('/sales/returns', { params }),
  createReturn: (data: Record<string, unknown>)                   => api.post('/sales/returns', data),
};

// ─── Collections ───────────────────────────────────────────────────────────────
export const collectionService = {
  getAll:          (params?: Record<string, unknown>)             => api.get('/collections', { params }),
  create:          (data: Record<string, unknown>)                => api.post('/collections', data),
  verify:          (id: string)                                   => api.patch(`/collections/${id}/verify`),
  getOutstanding:  (params?: Record<string, unknown>)             => api.get('/collections/outstanding', { params }),
  getLedger:       (salespersonId: string, params?: Record<string, unknown>) => api.get(`/collections/ledger/${salespersonId}`, { params }),
};

// ─── Spoilage ─────────────────────────────────────────────────────────────────
export const spoilageService = {
  getAll:   (params?: Record<string, unknown>)                    => api.get('/spoilage', { params }),
  create:   (data: Record<string, unknown>)                       => api.post('/spoilage', data),
  approve:  (id: string)                                          => api.patch(`/spoilage/${id}/approve`),
};

// ─── Settlement ────────────────────────────────────────────────────────────────
export const settlementService = {
  getSummary:  (params?: Record<string, unknown>)                 => api.get('/settlements/summary', { params }),
  settle:      (data: Record<string, unknown>)                    => api.post('/settlements', data),
  getHistory:  (params?: Record<string, unknown>)                 => api.get('/settlements', { params }),
};

// ─── Masters ───────────────────────────────────────────────────────────────────
export const productService = {
  getAll:   (params?: Record<string, unknown>)                    => api.get('/masters/products', { params }),
  create:   (data: Record<string, unknown>)                       => api.post('/masters/products', data),
  update:   (id: string, data: Record<string, unknown>)           => api.put(`/masters/products/${id}`, data),
  delete:   (id: string)                                          => api.delete(`/masters/products/${id}`),
};

export const routeService = {
  getAll:   (params?: Record<string, unknown>)                    => api.get('/masters/routes', { params }),
  create:   (data: Record<string, unknown>)                       => api.post('/masters/routes', data),
  update:   (id: string, data: Record<string, unknown>)           => api.put(`/masters/routes/${id}`, data),
};

export const salespersonService = {
  getAll:   (params?: Record<string, unknown>)                    => api.get('/masters/salespersons', { params }),
  create:   (data: Record<string, unknown>)                       => api.post('/masters/salespersons', data),
  update:   (id: string, data: Record<string, unknown>)           => api.put(`/masters/salespersons/${id}`, data),
};

export const vehicleService = {
  getAll:   (params?: Record<string, unknown>)                    => api.get('/masters/vehicles', { params }),
  create:   (data: Record<string, unknown>)                       => api.post('/masters/vehicles', data),
  update:   (id: string, data: Record<string, unknown>)           => api.put(`/masters/vehicles/${id}`, data),
};

// ─── Reports ───────────────────────────────────────────────────────────────────
export const reportService = {
  getSalesReport:      (params?: Record<string, unknown>) => api.get('/reports/sales', { params }),
  getStockReport:      (params?: Record<string, unknown>) => api.get('/reports/stock', { params }),
  getCollectionReport: (params?: Record<string, unknown>) => api.get('/reports/collections', { params }),
  getSettlementReport: (params?: Record<string, unknown>) => api.get('/reports/settlements', { params }),
  getSpoilageReport:   (params?: Record<string, unknown>) => api.get('/reports/spoilage', { params }),
};

// ─── Admin ─────────────────────────────────────────────────────────────────────
export const adminService = {
  getUsers:       (params?: Record<string, unknown>)              => api.get('/admin/users', { params }),
  createUser:     (data: Record<string, unknown>)                 => api.post('/admin/users', data),
  updateUser:     (id: string, data: Record<string, unknown>)     => api.put(`/admin/users/${id}`, data),
  getAuditLog:    (params?: Record<string, unknown>)              => api.get('/admin/audit', { params }),
  getSettings:    ()                                              => api.get('/admin/settings'),
  updateSettings: (data: Record<string, unknown>)                 => api.put('/admin/settings', data),
};

// ─── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardService = {
  getStats:        ()                                             => api.get('/dashboard/stats'),
  getSalesChart:   (params?: Record<string, unknown>)             => api.get('/dashboard/sales-chart', { params }),
  getStockSummary: ()                                             => api.get('/dashboard/stock-summary'),
};

export default api;
