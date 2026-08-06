// Product categories and pack sizes
export const PRODUCTS = [
  { id: 'milk-100', category: 'Milk', name: 'Milk 100ml', packSize: '100ml', unit: 'pcs' },
  { id: 'milk-150', category: 'Milk', name: 'Milk 150ml', packSize: '150ml', unit: 'pcs' },
  { id: 'milk-250', category: 'Milk', name: 'Milk 250ml', packSize: '250ml', unit: 'pcs' },
  { id: 'milk-500', category: 'Milk', name: 'Milk 500ml', packSize: '500ml', unit: 'pcs' },
  { id: 'milk-1000', category: 'Milk', name: 'Milk 1000ml', packSize: '1000ml', unit: 'pcs' },
  { id: 'curd-200', category: 'Curd', name: 'Curd 200ml', packSize: '200ml', unit: 'pcs' },
  { id: 'curd-500', category: 'Curd', name: 'Curd 500ml', packSize: '500ml', unit: 'pcs' },
  { id: 'buttermilk-200', category: 'Buttermilk', name: 'Buttermilk 200ml', packSize: '200ml', unit: 'pcs' },
  { id: 'buttermilk-500', category: 'Buttermilk', name: 'Buttermilk 500ml', packSize: '500ml', unit: 'pcs' },
];

export const PRODUCT_CATEGORIES = ['Milk', 'Curd', 'Buttermilk'];

// Batch statuses
export const BATCH_STATUS = {
  ACTIVE: 'Active',
  EXPIRED: 'Expired',
  EXHAUSTED: 'Exhausted',
  SPOILED: 'Spoiled',
};

// Sessions
export const SESSIONS = {
  MORNING: 'Morning',
  EVENING: 'Evening',
};

// Dispatch statuses
export const DISPATCH_STATUS = {
  DRAFT: 'Draft',
  CONFIRMED: 'Confirmed',
  IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered',
  RETURNED: 'Returned',
};

// Payment modes
export const PAYMENT_MODES = {
  CASH: 'Cash',
  UPI: 'UPI',
  BANK_TRANSFER: 'Bank Transfer',
  CHEQUE: 'Cheque',
  CREDIT: 'Credit',
};

// Sale types
export const SALE_TYPES = {
  CASH: 'Cash',
  CREDIT: 'Credit',
};

// Collection statuses
export const COLLECTION_STATUS = {
  PENDING: 'Pending',
  VERIFIED: 'Verified',
  DEPOSITED: 'Deposited',
};

// Outstanding statuses
export const OUTSTANDING_STATUS = {
  PAID: 'Paid',
  PARTIALLY_PAID: 'Partially Paid',
  OUTSTANDING: 'Outstanding',
};

// Settlement statuses
export const SETTLEMENT_STATUS = {
  PENDING: 'Pending',
  SETTLED: 'Settled',
  SHORT: 'Short',
  EXCESS: 'Excess',
};

// User roles
export const USER_ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  COLD_STORAGE: 'Cold Storage Staff',
  SALESPERSON: 'Salesperson',
  ACCOUNTS: 'Accounts Staff',
};

// General statuses
export const STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  DRAFT: 'Draft',
  CONFIRMED: 'Confirmed',
  PENDING: 'Pending',
  VERIFIED: 'Verified',
  CLOSED: 'Closed',
  PAID: 'Paid',
  PARTIALLY_PAID: 'Partially Paid',
  OUTSTANDING: 'Outstanding',
  EXPIRED: 'Expired',
  SPOILED: 'Spoiled',
  LOW_STOCK: 'Low Stock',
};

// Nav menu structure
export const NAV_MENU = [
  {
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    path: '/',
    exact: true,
  },
  {
    label: 'Inventory',
    icon: 'Package',
    children: [
      { label: 'Batch / Inward Entry', path: '/inventory/batch-entry', icon: 'PackagePlus' },
      { label: 'Cold Storage Stock', path: '/inventory/cold-storage', icon: 'Thermometer' },
      { label: 'Spoilage', path: '/inventory/spoilage', icon: 'AlertTriangle' },
    ],
  },
  {
    label: 'Dispatch',
    icon: 'Truck',
    children: [
      { label: 'New Dispatch', path: '/dispatch/new', icon: 'Send' },
      { label: 'Dispatch History', path: '/dispatch/history', icon: 'ClipboardList' },
    ],
  },
  {
    label: 'Sales',
    icon: 'ShoppingCart',
    children: [
      { label: 'Sales Entry', path: '/sales/entry', icon: 'PlusSquare' },
      { label: 'Invoices', path: '/sales/invoices', icon: 'FileText' },
      { label: 'Returns', path: '/sales/returns', icon: 'RotateCcw' },
    ],
  },
  {
    label: 'Collections',
    icon: 'Wallet',
    children: [
      { label: 'Collection Entry', path: '/collections/entry', icon: 'IndentIncrease' },
      { label: 'Outstanding', path: '/collections/outstanding', icon: 'AlertCircle' },
      { label: 'Dealer Ledger', path: '/collections/ledger', icon: 'BookOpen' },
    ],
  },
  {
    label: 'Settlement',
    icon: 'Calculator',
    path: '/settlement',
  },
  {
    label: 'Masters',
    icon: 'Database',
    children: [
      { label: 'Products', path: '/masters/products', icon: 'Milk' },
      { label: 'Routes', path: '/masters/routes', icon: 'Map' },
      { label: 'Dealers', path: '/masters/dealers', icon: 'Store' },
      { label: 'Salespersons', path: '/masters/salespersons', icon: 'Users' },
      { label: 'Vehicles', path: '/masters/vehicles', icon: 'Car' },
    ],
  },
  {
    label: 'Reports',
    icon: 'BarChart2',
    path: '/reports',
  },
  {
    label: 'Administration',
    icon: 'Settings',
    children: [
      { label: 'Users & Roles', path: '/admin/users', icon: 'UserCog' },
      { label: 'Audit Log', path: '/admin/audit', icon: 'ScrollText' },
      { label: 'Settings', path: '/admin/settings', icon: 'SlidersHorizontal' },
    ],
  },
];
