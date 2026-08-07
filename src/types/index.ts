// Central type definitions for the Dairy Distribution Management System ERP

import type { LucideIcon } from 'lucide-react';

// ─── Primitive Union Types ─────────────────────────────────────────────────────

export type UserRole =
  | 'Admin'
  | 'Manager'
  | 'Cold Storage Staff'
  | 'Salesperson'
  | 'Accounts Staff';

export type Session = 'Morning' | 'Evening';

export type BatchStatus = 'Active' | 'Expired' | 'Exhausted' | 'Spoiled';

export type DispatchStatus =
  | 'Draft'
  | 'Confirmed'
  | 'In Transit'
  | 'Delivered'
  | 'Returned';

export type PaymentMode =
  | 'Cash'
  | 'UPI'
  | 'Bank Transfer'
  | 'Cheque'
  | 'Credit';

export type SaleType = 'Cash' | 'Credit';

export type CollectionStatus = 'Pending' | 'Verified' | 'Deposited';

export type OutstandingStatus = 'Paid' | 'Partially Paid' | 'Outstanding';

export type SettlementStatus = 'Pending' | 'Settled' | 'Short' | 'Excess';

export type GeneralStatus =
  | 'Active'
  | 'Inactive'
  | 'Draft'
  | 'Confirmed'
  | 'Pending'
  | 'Verified'
  | 'Closed'
  | 'Paid'
  | 'Partially Paid'
  | 'Outstanding'
  | 'Expired'
  | 'Spoiled'
  | 'Low Stock';

// All possible status badge values
export type StatusValue =
  | GeneralStatus
  | DispatchStatus
  | CollectionStatus
  | SettlementStatus
  | BatchStatus
  | OutstandingStatus;

export type ToastType = 'success' | 'error' | 'warning' | 'info';

// ─── Domain Models ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
}

export interface Product {
  id: string;
  category: string;
  name: string;
  packSize: string;
  unit: string;
}

export interface Batch {
  id: string;
  product: string;
  productId: string;
  session: Session;
  productionDate: string;
  expiryDate: string;
  quantityReceived: number;
  availableQty: number;
  status: BatchStatus;
}

export interface DispatchItem {
  product: string;
  batchId: string;
  qty: number;
}

export interface Dispatch {
  id: string;
  date: string;
  session: Session;
  salesperson: string;
  route: string;
  vehicle: string;
  status: DispatchStatus;
  items: DispatchItem[];
  totalQty: number;
}

export interface Sale {
  id: string;
  date: string;
  customer?: string;   // optional – only populated for credit sales
  route: string;
  salesperson: string;
  soldQty: number;
  freeQty: number;
  returnQty: number;
  amount: number;
  discount: number;
  saleType: SaleType;
  status: GeneralStatus;
}

export interface Collection {
  id: string;
  date: string;
  customer?: string;   // optional – name of credit customer if applicable
  route: string;
  salesperson: string;
  amount: number;
  mode: PaymentMode;
  reference: string;
  status: CollectionStatus;
}

export interface OutstandingRecord {
  salesperson: string;   // outstanding tracked per salesperson
  route: string;
  previousOutstanding: number;
  creditSales: number;
  collections: number;
  adjustments: number;
  currentOutstanding: number;
  status: OutstandingStatus;
}

export type Outstanding = OutstandingRecord;

export interface SpoilageRecord {
  id: string;
  date: string;
  product: string;
  batchId: string;
  qty: number;
  reason: string;
  reportedBy: string;
  status: CollectionStatus;
}

// Dealer interface removed — business flow is Cold Storage → Salesperson → Direct customer sales

export interface Route {
  id: string;
  name: string;
  area: string;
  salesperson: string;
  customerCount: number;  // number of customers on this route
  status: GeneralStatus;
}

export interface Salesperson {
  id: string;
  name: string;
  phone: string;
  routes: string[];
  status: GeneralStatus;
  joinDate: string;
}

export interface Vehicle {
  id: string;
  regNumber: string;
  type: string;
  capacity: number;
  assignedTo?: string | null;
  status: GeneralStatus;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: GeneralStatus;
  lastLogin: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'LOGIN' | 'LOGOUT';
  module: string;
  reference: string;
  description: string;
  ipAddress: string;
}

// ─── Dashboard Types ───────────────────────────────────────────────────────────

export interface DashboardStats {
  totalStock: number;
  dispatchedToday: number;
  pendingCollections: number;
  activeRoutes: number;
  todaySales: number;
  spoilageToday: number;
  pendingSettlements: number;
  lowStockItems: number;
}

export interface SalesChartDataPoint {
  day: string;
  morning: number;
  evening: number;
}

export interface StockByProduct {
  name: string;
  stock: number;
  dispatched: number;
}

export interface CollectionBreakdown {
  name: string;
  value: number;
  color: string;
}

// ─── Auth Context ──────────────────────────────────────────────────────────────

export interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  session: Session;
  setSession: (s: Session) => void;
}

// ─── Toast ────────────────────────────────────────────────────────────────────

export type ToastFn = (message: string, type?: ToastType, duration?: number) => void;

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export type StringKeyOf<T> = Extract<keyof T, string>;

export interface TableColumn<T = object> {
  header: string;
  accessor?: StringKeyOf<T>;
  key?: string;
  sortable?: boolean;
  align?: 'left' | 'right';
  width?: string | number;
  render?: (row: T) => React.ReactNode;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavChild {
  label: string;
  path: string;
  icon?: string;
}

export interface NavItemDef {
  label: string;
  icon: string | LucideIcon;
  path?: string;
  exact?: boolean;
  children?: NavChild[];
}

// ─── Sidebar Nav (component-level) ────────────────────────────────────────────

export interface SidebarNavChild {
  label: string;
  path: string;
}

export interface SidebarNavItem {
  label: string;
  icon: LucideIcon;
  path?: string;
  exact?: boolean;
  children?: SidebarNavChild[];
}

// ─── Command Search ────────────────────────────────────────────────────────────

export interface CommandItem {
  id: string;
  label: string;
  subtitle?: string;
  path: string;
  icon: LucideIcon;
  group: string;
}

// ─── Utility function parameter types ─────────────────────────────────────────

export interface OutstandingParams {
  previous: number;
  creditSales: number;
  collections: number;
  adjustments?: number;
}

export interface StockParams {
  opening: number;
  received: number;
  dispatched: number;
  spoilage: number;
  adjustments?: number;
}

// ─── Settlement ────────────────────────────────────────────────────────────────

export interface SettlementRecord {
  id: string;
  salesperson: string;
  route: string;
  date: string;
  session: Session;
  dispatched: number;
  returned: number;
  netSold: number;
  cashCollected: number;
  upiCollected: number;
  chequeCollected: number;
  totalCollected: number;
  expectedAmount: number;
  status: SettlementStatus;
  difference: number;
}
