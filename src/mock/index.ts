// Mock data for all ERP entities
// Replace these with API calls from src/services/ when backend is ready

import { PRODUCTS as _PRODUCTS, SESSIONS, DISPATCH_STATUS, BATCH_STATUS, PAYMENT_MODES, USER_ROLES, STATUS } from '../constants';
import type {
  DashboardStats,
  SalesChartDataPoint,
  StockByProduct,
  CollectionBreakdown,
  Salesperson,
  Route,
  Batch,
  Dispatch,
  Sale,
  Collection,
  OutstandingRecord,
  SpoilageRecord,
  Vehicle,
  SystemUser,
  AuditEntry,
} from '../types';

// Re-export PRODUCTS so consumers can use it from mock/index
export { _PRODUCTS as PRODUCTS };

// ─── Dashboard Stats ───────────────────────────────────────────────────────────
export const mockDashboardStats: DashboardStats = {
  totalStock: 14820,
  dispatchedToday: 3240,
  pendingCollections: 48750,
  activeRoutes: 22,
  todaySales: 187500,
  spoilageToday: 45,
  pendingSettlements: 5,
  lowStockItems: 3,
};

export const mockSalesChartData: SalesChartDataPoint[] = [
  { day: 'Mon', morning: 42000, evening: 31000 },
  { day: 'Tue', morning: 48000, evening: 35000 },
  { day: 'Wed', morning: 45000, evening: 28000 },
  { day: 'Thu', morning: 51000, evening: 39000 },
  { day: 'Fri', morning: 53000, evening: 42000 },
  { day: 'Sat', morning: 61000, evening: 47000 },
  { day: 'Sun', morning: 38000, evening: 25000 },
];

export const mockStockByProduct: StockByProduct[] = [
  { name: 'Milk 500ml',  stock: 4200, dispatched: 3100 },
  { name: 'Milk 1000ml', stock: 2800, dispatched: 2100 },
  { name: 'Milk 250ml',  stock: 1800, dispatched: 1400 },
  { name: 'Curd 500ml',  stock: 900,  dispatched: 620 },
  { name: 'Buttermilk',  stock: 1200, dispatched: 880 },
];

export const mockCollectionBreakdown: CollectionBreakdown[] = [
  { name: 'Cash',         value: 45, color: '#22c55e' },
  { name: 'UPI',          value: 32, color: '#3b82f6' },
  { name: 'Cheque',       value: 15, color: '#f59e0b' },
  { name: 'Bank Transfer', value: 8, color: '#8b5cf6' },
];

// ─── Salespersons ──────────────────────────────────────────────────────────────
export const mockSalespersons: Salesperson[] = [
  { id: 'SP001', name: 'Rajesh Kumar', phone: '9876543210', routes: ['R01','R02'], status: STATUS.ACTIVE,   joinDate: '2022-01-15' },
  { id: 'SP002', name: 'Suresh Babu',  phone: '9876543211', routes: ['R03','R04'], status: STATUS.ACTIVE,   joinDate: '2021-06-20' },
  { id: 'SP003', name: 'Murugan S',    phone: '9876543212', routes: ['R05'],       status: STATUS.ACTIVE,   joinDate: '2023-03-10' },
  { id: 'SP004', name: 'Arun Prasad',  phone: '9876543213', routes: ['R06','R07'], status: STATUS.INACTIVE, joinDate: '2020-11-05' },
  { id: 'SP005', name: 'Karthik R',    phone: '9876543214', routes: ['R08'],       status: STATUS.ACTIVE,   joinDate: '2022-08-01' },
  { id: 'SP006', name: 'Velmurugan',   phone: '9876543215', routes: ['R09','R10'], status: STATUS.ACTIVE,   joinDate: '2021-02-14' },
];

// ─── Routes ────────────────────────────────────────────────────────────────────
export const mockRoutes: Route[] = [
  { id: 'R01', name: 'Anna Nagar',  area: 'North',     salesperson: 'SP001', customerCount: 45, status: STATUS.ACTIVE },
  { id: 'R02', name: 'T Nagar',     area: 'Central',   salesperson: 'SP001', customerCount: 60, status: STATUS.ACTIVE },
  { id: 'R03', name: 'Adyar',       area: 'South',     salesperson: 'SP002', customerCount: 50, status: STATUS.ACTIVE },
  { id: 'R04', name: 'Velachery',   area: 'South',     salesperson: 'SP002', customerCount: 35, status: STATUS.ACTIVE },
  { id: 'R05', name: 'Tambaram',    area: 'South',     salesperson: 'SP003', customerCount: 40, status: STATUS.ACTIVE },
  { id: 'R06', name: 'Chromepet',   area: 'South',     salesperson: 'SP004', customerCount: 25, status: STATUS.INACTIVE },
  { id: 'R07', name: 'Porur',       area: 'West',      salesperson: 'SP004', customerCount: 30, status: STATUS.INACTIVE },
  { id: 'R08', name: 'Ambattur',    area: 'North West', salesperson: 'SP005', customerCount: 38, status: STATUS.ACTIVE },
  { id: 'R09', name: 'Avadi',       area: 'North',     salesperson: 'SP006', customerCount: 22, status: STATUS.ACTIVE },
  { id: 'R10', name: 'Poonamallee', area: 'West',      salesperson: 'SP006', customerCount: 42, status: STATUS.ACTIVE },
];

// ─── Batches ───────────────────────────────────────────────────────────────────
export const mockBatches: Batch[] = [
  { id: 'B2024-001', product: 'Milk 500ml',       productId: 'milk-500',      session: SESSIONS.MORNING, productionDate: '2026-08-06', expiryDate: '2026-08-07', quantityReceived: 3000, availableQty: 1850, status: BATCH_STATUS.ACTIVE },
  { id: 'B2024-002', product: 'Milk 1000ml',      productId: 'milk-1000',     session: SESSIONS.MORNING, productionDate: '2026-08-06', expiryDate: '2026-08-07', quantityReceived: 1500, availableQty: 620,  status: BATCH_STATUS.ACTIVE },
  { id: 'B2024-003', product: 'Milk 250ml',       productId: 'milk-250',      session: SESSIONS.MORNING, productionDate: '2026-08-06', expiryDate: '2026-08-07', quantityReceived: 2000, availableQty: 1450, status: BATCH_STATUS.ACTIVE },
  { id: 'B2024-004', product: 'Curd 500ml',       productId: 'curd-500',      session: SESSIONS.MORNING, productionDate: '2026-08-06', expiryDate: '2026-08-08', quantityReceived: 800,  availableQty: 340,  status: BATCH_STATUS.ACTIVE },
  { id: 'B2024-005', product: 'Buttermilk 500ml', productId: 'buttermilk-500',session: SESSIONS.MORNING, productionDate: '2026-08-06', expiryDate: '2026-08-07', quantityReceived: 1200, availableQty: 120,  status: BATCH_STATUS.ACTIVE },
  { id: 'B2024-006', product: 'Milk 150ml',       productId: 'milk-150',      session: SESSIONS.EVENING, productionDate: '2026-08-05', expiryDate: '2026-08-06', quantityReceived: 500,  availableQty: 0,    status: BATCH_STATUS.EXPIRED },
  { id: 'B2024-007', product: 'Curd 200ml',       productId: 'curd-200',      session: SESSIONS.EVENING, productionDate: '2026-08-06', expiryDate: '2026-08-08', quantityReceived: 600,  availableQty: 410,  status: BATCH_STATUS.ACTIVE },
  { id: 'B2024-008', product: 'Milk 100ml',       productId: 'milk-100',      session: SESSIONS.MORNING, productionDate: '2026-08-06', expiryDate: '2026-08-07', quantityReceived: 1000, availableQty: 880,  status: BATCH_STATUS.ACTIVE },
];

// ─── Dispatches ────────────────────────────────────────────────────────────────
export const mockDispatches: Dispatch[] = [
  {
    id: 'DIS-2024-0112', date: '2026-08-06', session: SESSIONS.MORNING, salesperson: 'Rajesh Kumar', route: 'R01',
    vehicle: 'TN01AB1234', status: DISPATCH_STATUS.DELIVERED,
    items: [
      { product: 'Milk 500ml',  batchId: 'B2024-001', qty: 450 },
      { product: 'Milk 1000ml', batchId: 'B2024-002', qty: 200 },
    ],
    totalQty: 650,
  },
  {
    id: 'DIS-2024-0113', date: '2026-08-06', session: SESSIONS.MORNING, salesperson: 'Suresh Babu', route: 'R03',
    vehicle: 'TN01AB2345', status: DISPATCH_STATUS.IN_TRANSIT,
    items: [
      { product: 'Milk 500ml', batchId: 'B2024-001', qty: 300 },
      { product: 'Curd 500ml', batchId: 'B2024-004', qty: 120 },
    ],
    totalQty: 420,
  },
  {
    id: 'DIS-2024-0114', date: '2026-08-06', session: SESSIONS.MORNING, salesperson: 'Murugan S', route: 'R05',
    vehicle: 'TN01AB3456', status: DISPATCH_STATUS.CONFIRMED,
    items: [
      { product: 'Milk 250ml',       batchId: 'B2024-003', qty: 280 },
      { product: 'Buttermilk 500ml', batchId: 'B2024-005', qty: 150 },
    ],
    totalQty: 430,
  },
  {
    id: 'DIS-2024-0110', date: '2026-08-05', session: SESSIONS.EVENING, salesperson: 'Karthik R', route: 'R08',
    vehicle: 'TN01AB5678', status: DISPATCH_STATUS.DELIVERED,
    items: [{ product: 'Milk 1000ml', batchId: 'B2024-002', qty: 180 }],
    totalQty: 180,
  },
  {
    id: 'DIS-2024-0111', date: '2026-08-05', session: SESSIONS.MORNING, salesperson: 'Velmurugan', route: 'R09',
    vehicle: 'TN01AB6789', status: DISPATCH_STATUS.DELIVERED,
    items: [{ product: 'Milk 500ml', batchId: 'B2024-001', qty: 320 }],
    totalQty: 320,
  },
];

// ─── Sales ─────────────────────────────────────────────────────────────────────
export const mockSales: Sale[] = [
  { id: 'INV-2024-0450', date: '2026-08-06', customer: 'Hotel Saravana Bhavan', route: 'R01', salesperson: 'Rajesh Kumar', soldQty: 120, freeQty: 5,  returnQty: 0,  amount: 3600,  discount: 0,   saleType: 'Credit', status: STATUS.CONFIRMED },
  { id: 'INV-2024-0451', date: '2026-08-06', route: 'R02', salesperson: 'Rajesh Kumar', soldQty: 200, freeQty: 0,  returnQty: 10, amount: 5800,  discount: 200, saleType: 'Cash',   status: STATUS.CONFIRMED },
  { id: 'INV-2024-0452', date: '2026-08-06', customer: 'Annapoorna Mess',       route: 'R03', salesperson: 'Suresh Babu',  soldQty: 80,  freeQty: 2,  returnQty: 0,  amount: 2400,  discount: 0,   saleType: 'Credit', status: STATUS.PENDING },
  { id: 'INV-2024-0453', date: '2026-08-06', customer: 'A2B Sweets & Restaurant',route: 'R02', salesperson: 'Rajesh Kumar', soldQty: 350, freeQty: 10, returnQty: 5,  amount: 10200, discount: 500, saleType: 'Credit', status: STATUS.CONFIRMED },
  { id: 'INV-2024-0454', date: '2026-08-05', route: 'R05', salesperson: 'Murugan S',    soldQty: 180, freeQty: 0,  returnQty: 2,  amount: 5300,  discount: 0,   saleType: 'Cash',   status: STATUS.CONFIRMED },
];

// ─── Collections ───────────────────────────────────────────────────────────────
export const mockCollections: Collection[] = [
  { id: 'COL-2024-0201', date: '2026-08-06', customer: 'Hotel Saravana Bhavan', route: 'R01', salesperson: 'Rajesh Kumar', amount: 4500,  mode: PAYMENT_MODES.CASH,   reference: '',           status: 'Verified' },
  { id: 'COL-2024-0202', date: '2026-08-06', route: 'R02', salesperson: 'Rajesh Kumar', amount: 8000,  mode: PAYMENT_MODES.UPI,    reference: 'UPI12345',   status: 'Verified' },
  { id: 'COL-2024-0203', date: '2026-08-06', customer: 'Annapoorna Mess',       route: 'R03', salesperson: 'Suresh Babu',  amount: 1200,  mode: PAYMENT_MODES.CASH,   reference: '',           status: 'Pending' },
  { id: 'COL-2024-0204', date: '2026-08-05', customer: 'A2B Sweets & Restaurant',route: 'R02', salesperson: 'Rajesh Kumar', amount: 12000, mode: PAYMENT_MODES.CHEQUE, reference: 'CHQ-004521', status: 'Deposited' },
  { id: 'COL-2024-0205', date: '2026-08-05', route: 'R05', salesperson: 'Murugan S',    amount: 5300,  mode: PAYMENT_MODES.UPI,    reference: 'UPI67890',   status: 'Verified' },
];

// ─── Outstanding ───────────────────────────────────────────────────────────────
export const mockOutstanding: OutstandingRecord[] = [
  { salesperson: 'Rajesh Kumar', route: 'R01', previousOutstanding: 4500,  creditSales: 3600,  collections: 4500,  adjustments: 0, currentOutstanding: 3600, status: STATUS.OUTSTANDING },
  { salesperson: 'Suresh Babu',  route: 'R03', previousOutstanding: 12800, creditSales: 5800,  collections: 8000,  adjustments: 0, currentOutstanding: 10600, status: STATUS.OUTSTANDING },
  { salesperson: 'Murugan S',    route: 'R05', previousOutstanding: 8200,  creditSales: 10200, collections: 12000, adjustments: 0, currentOutstanding: 6400, status: STATUS.OUTSTANDING },
  { salesperson: 'Karthik R',    route: 'R08', previousOutstanding: 1200,  creditSales: 2400,  collections: 1200,  adjustments: 0, currentOutstanding: 2400, status: STATUS.OUTSTANDING },
  { salesperson: 'Velmurugan',   route: 'R09', previousOutstanding: 9450,  creditSales: 0,     collections: 5300,  adjustments: 0, currentOutstanding: 4150, status: STATUS.OUTSTANDING },
];

// ─── Spoilage ──────────────────────────────────────────────────────────────────
export const mockSpoilage: SpoilageRecord[] = [
  { id: 'SPO-001', date: '2026-08-06', product: 'Milk 500ml',       batchId: 'B2024-001', qty: 15, reason: 'Leaking packets',    reportedBy: 'Rajesh Kumar', status: 'Verified' },
  { id: 'SPO-002', date: '2026-08-06', product: 'Curd 500ml',       batchId: 'B2024-004', qty: 8,  reason: 'Damaged in transit', reportedBy: 'Suresh Babu',  status: 'Pending' },
  { id: 'SPO-003', date: '2026-08-05', product: 'Milk 150ml',       batchId: 'B2024-006', qty: 22, reason: 'Expired',            reportedBy: 'System',       status: 'Verified' },
  { id: 'SPO-004', date: '2026-08-05', product: 'Buttermilk 500ml', batchId: 'B2024-005', qty: 30, reason: 'Torn packaging',     reportedBy: 'Murugan S',    status: 'Verified' },
];

// ─── Vehicles ─────────────────────────────────────────────────────────────────
export const mockVehicles: Vehicle[] = [
  { id: 'V001', regNumber: 'TN01AB1234', type: 'Mini Truck', capacity: 2000, assignedTo: 'SP001', status: STATUS.ACTIVE },
  { id: 'V002', regNumber: 'TN01AB2345', type: 'Auto',       capacity: 500,  assignedTo: 'SP002', status: STATUS.ACTIVE },
  { id: 'V003', regNumber: 'TN01AB3456', type: 'Mini Truck', capacity: 1500, assignedTo: 'SP003', status: STATUS.ACTIVE },
  { id: 'V004', regNumber: 'TN01AB4567', type: 'Cycle',      capacity: 200,  assignedTo: null,    status: STATUS.INACTIVE },
  { id: 'V005', regNumber: 'TN01AB5678', type: 'Mini Truck', capacity: 2000, assignedTo: 'SP005', status: STATUS.ACTIVE },
  { id: 'V006', regNumber: 'TN01AB6789', type: 'Auto',       capacity: 600,  assignedTo: 'SP006', status: STATUS.ACTIVE },
];

// ─── Users ─────────────────────────────────────────────────────────────────────
export const mockUsers: SystemUser[] = [
  { id: 'U001', name: 'Admin User',          email: 'admin@dairy.com',   role: USER_ROLES.ADMIN,        status: STATUS.ACTIVE, lastLogin: '2026-08-06T08:00:00Z' },
  { id: 'U002', name: 'Rajesh Kumar',        email: 'rajesh@dairy.com',  role: USER_ROLES.SALESPERSON,  status: STATUS.ACTIVE, lastLogin: '2026-08-06T06:30:00Z' },
  { id: 'U003', name: 'Priya R',             email: 'priya@dairy.com',   role: USER_ROLES.ACCOUNTS,     status: STATUS.ACTIVE, lastLogin: '2026-08-05T17:00:00Z' },
  { id: 'U004', name: 'Cold Storage Incharge', email: 'storage@dairy.com', role: USER_ROLES.COLD_STORAGE, status: STATUS.ACTIVE, lastLogin: '2026-08-06T05:00:00Z' },
  { id: 'U005', name: 'Manager Ram',         email: 'manager@dairy.com', role: USER_ROLES.MANAGER,      status: STATUS.ACTIVE, lastLogin: '2026-08-06T09:00:00Z' },
];

// ─── Audit Log ─────────────────────────────────────────────────────────────────
export const mockAuditLog: AuditEntry[] = [
  { id: 'AL001', timestamp: '2026-08-06T09:15:00Z', user: 'Admin User',   action: 'CREATE', module: 'Batch Entry',    reference: 'B2024-008',    description: 'Added new batch for Milk 100ml',               ipAddress: '192.168.1.10' },
  { id: 'AL002', timestamp: '2026-08-06T08:45:00Z', user: 'Rajesh Kumar', action: 'UPDATE', module: 'Dispatch',       reference: 'DIS-2024-0112', description: 'Updated dispatch status to Delivered',          ipAddress: '192.168.1.22' },
  { id: 'AL003', timestamp: '2026-08-06T08:00:00Z', user: 'Priya R',      action: 'CREATE', module: 'Collection',     reference: 'COL-2024-0202', description: 'Recorded collection via UPI',                    ipAddress: '192.168.1.15' },
  { id: 'AL004', timestamp: '2026-08-05T18:30:00Z', user: 'Manager Ram',  action: 'APPROVE', module: 'Spoilage',      reference: 'SPO-001',       description: 'Approved spoilage entry',                       ipAddress: '192.168.1.30' },
  { id: 'AL005', timestamp: '2026-08-05T16:00:00Z', user: 'Admin User',   action: 'CREATE', module: 'Masters/Route',  reference: 'R010',         description: 'Added new route Poonamallee',                   ipAddress: '192.168.1.10' },
];
