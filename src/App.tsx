import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Public Landing Page
import LandingPage from './pages/public/LandingPage';

// Layout
import AppLayout from './layouts/AppLayout';

// Auth
import LoginPage from './pages/auth/LoginPage';

// Dashboard
import DashboardPage from './pages/dashboard/DashboardPage';

// Inventory
import BatchEntryPage from './pages/inventory/BatchEntryPage';
import ColdStoragePage from './pages/inventory/ColdStoragePage';
import SpoilagePage from './pages/inventory/SpoilagePage';

// Dispatch
import NewDispatchPage from './pages/dispatch/NewDispatchPage';
import DispatchHistoryPage from './pages/dispatch/DispatchHistoryPage';

// Sales
import SalesEntryPage from './pages/sales/SalesEntryPage';
import InvoicesPage from './pages/sales/InvoicesPage';
import ReturnsPage from './pages/sales/ReturnsPage';

// Collections
import CollectionEntryPage from './pages/collections/CollectionEntryPage';
import OutstandingPage from './pages/collections/OutstandingPage';
import DealerLedgerPage from './pages/collections/DealerLedgerPage';

// Settlement
import SettlementPage from './pages/settlement/SettlementPage';

// Masters
import ProductsMasterPage from './pages/masters/ProductsMasterPage';
import RoutesMasterPage from './pages/masters/RoutesMasterPage';
import SalespersonsMasterPage from './pages/masters/SalespersonsMasterPage';
import VehiclesMasterPage from './pages/masters/VehiclesMasterPage';

// Reports
import ReportsPage from './pages/reports/ReportsPage';

// Admin
import UsersPage from './pages/admin/UsersPage';
import AuditLogPage from './pages/admin/AuditLogPage';
import SettingsPage from './pages/admin/SettingsPage';

import { useAuth } from './hooks/useAuth';

interface RoleGuardProps {
  prefix: string;
  children: React.ReactNode;
}

function RoleGuard({ prefix, children }: RoleGuardProps) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const ROLE_PERMISSIONS: Record<string, string[]> = {
    'Admin': ['/dashboard', '/inventory', '/dispatch', '/sales', '/collections', '/settlement', '/masters', '/reports', '/admin'],
    'Manager': ['/dashboard', '/inventory', '/dispatch', '/sales', '/collections', '/settlement', '/masters', '/reports'],
    'Cold Storage Staff': ['/dashboard', '/inventory', '/dispatch'],
    'Salesperson': ['/dashboard', '/dispatch', '/sales', '/settlement'],
    'Accounts Staff': ['/dashboard', '/sales', '/collections', '/settlement', '/reports'],
  };

  const allowedPrefixes = ROLE_PERMISSIONS[user.role] || ROLE_PERMISSIONS['Admin'];
  const isAllowed = allowedPrefixes.some((p) => {
    if (p === '/dashboard') return prefix === '/dashboard';
    return prefix.startsWith(p);
  });

  if (!isAllowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Akshara Foods Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected ERP routes */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<RoleGuard prefix="/dashboard"><DashboardPage /></RoleGuard>} />

              {/* Inventory */}
              <Route path="/inventory/batch-entry" element={<RoleGuard prefix="/inventory/batch-entry"><BatchEntryPage /></RoleGuard>} />
              <Route path="/inventory/cold-storage" element={<RoleGuard prefix="/inventory/cold-storage"><ColdStoragePage /></RoleGuard>} />
              <Route path="/inventory/spoilage" element={<RoleGuard prefix="/inventory/spoilage"><SpoilagePage /></RoleGuard>} />

              {/* Dispatch */}
              <Route path="/dispatch/new" element={<RoleGuard prefix="/dispatch/new"><NewDispatchPage /></RoleGuard>} />
              <Route path="/dispatch/history" element={<RoleGuard prefix="/dispatch/history"><DispatchHistoryPage /></RoleGuard>} />

              {/* Sales */}
              <Route path="/sales/entry" element={<RoleGuard prefix="/sales/entry"><SalesEntryPage /></RoleGuard>} />
              <Route path="/sales/invoices" element={<RoleGuard prefix="/sales/invoices"><InvoicesPage /></RoleGuard>} />
              <Route path="/sales/returns" element={<RoleGuard prefix="/sales/returns"><ReturnsPage /></RoleGuard>} />

              {/* Collections */}
              <Route path="/collections/entry" element={<RoleGuard prefix="/collections/entry"><CollectionEntryPage /></RoleGuard>} />
              <Route path="/collections/outstanding" element={<RoleGuard prefix="/collections/outstanding"><OutstandingPage /></RoleGuard>} />
              <Route path="/collections/ledger" element={<RoleGuard prefix="/collections/ledger"><DealerLedgerPage /></RoleGuard>} />

              {/* Settlement */}
              <Route path="/settlement" element={<RoleGuard prefix="/settlement"><SettlementPage /></RoleGuard>} />

              {/* Masters */}
              <Route path="/masters/products" element={<RoleGuard prefix="/masters/products"><ProductsMasterPage /></RoleGuard>} />
              <Route path="/masters/routes" element={<RoleGuard prefix="/masters/routes"><RoutesMasterPage /></RoleGuard>} />
              <Route path="/masters/salespersons" element={<RoleGuard prefix="/masters/salespersons"><SalespersonsMasterPage /></RoleGuard>} />
              <Route path="/masters/vehicles" element={<RoleGuard prefix="/masters/vehicles"><VehiclesMasterPage /></RoleGuard>} />

              {/* Reports */}
              <Route path="/reports" element={<RoleGuard prefix="/reports"><ReportsPage /></RoleGuard>} />

              {/* Admin */}
              <Route path="/admin/users" element={<RoleGuard prefix="/admin/users"><UsersPage /></RoleGuard>} />
              <Route path="/admin/audit" element={<RoleGuard prefix="/admin/audit"><AuditLogPage /></RoleGuard>} />
              <Route path="/admin/settings" element={<RoleGuard prefix="/admin/settings"><SettingsPage /></RoleGuard>} />

              {/* Fallback protected redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
