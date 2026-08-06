import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Truck, ShoppingCart,
  Wallet, Calculator, BookOpen, BarChart2, Users,
  Settings, FileText, AlertTriangle, ChevronDown,
  ChevronRight, Droplets, PanelLeftClose, PanelLeft,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const ROLE_PERMISSIONS = {
  'Admin': ['/', '/inventory', '/dispatch', '/sales', '/collections', '/settlement', '/masters', '/reports', '/admin'],
  'Manager': ['/', '/inventory', '/dispatch', '/sales', '/collections', '/settlement', '/masters', '/reports'],
  'Cold Storage Staff': ['/', '/inventory', '/dispatch'],
  'Salesperson': ['/', '/dispatch', '/sales', '/settlement'],
  'Accounts Staff': ['/', '/sales', '/collections', '/settlement', '/reports'],
};

export function isPathAllowed(path, role) {
  const allowed = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS['Admin'];
  return allowed.some(prefix => {
    if (prefix === '/') return path === '/';
    return path.startsWith(prefix);
  });
}

const NAV_ALL = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
    exact: true,
  },
  {
    label: 'Inventory',
    icon: Package,
    children: [
      { label: 'Batch / Inward Entry', path: '/inventory/batch-entry' },
      { label: 'Cold Storage Stock',   path: '/inventory/cold-storage' },
      { label: 'Spoilage',             path: '/inventory/spoilage' },
    ],
  },
  {
    label: 'Dispatch',
    icon: Truck,
    children: [
      { label: 'New Dispatch',     path: '/dispatch/new' },
      { label: 'Dispatch History', path: '/dispatch/history' },
    ],
  },
  {
    label: 'Sales',
    icon: ShoppingCart,
    children: [
      { label: 'Sales Entry', path: '/sales/entry' },
      { label: 'Invoices',    path: '/sales/invoices' },
      { label: 'Returns',     path: '/sales/returns' },
    ],
  },
  {
    label: 'Collections',
    icon: Wallet,
    children: [
      { label: 'Collection Entry', path: '/collections/entry' },
      { label: 'Outstanding',      path: '/collections/outstanding' },
      { label: 'Dealer Ledger',    path: '/collections/ledger' },
    ],
  },
  {
    label: 'Settlement',
    icon: Calculator,
    path: '/settlement',
  },
  {
    label: 'Masters',
    icon: BookOpen,
    children: [
      { label: 'Products',     path: '/masters/products' },
      { label: 'Routes',       path: '/masters/routes' },
      { label: 'Dealers',      path: '/masters/dealers' },
      { label: 'Salespersons', path: '/masters/salespersons' },
      { label: 'Vehicles',     path: '/masters/vehicles' },
    ],
  },
  {
    label: 'Reports',
    icon: BarChart2,
    path: '/reports',
  },
  {
    label: 'Administration',
    icon: Settings,
    children: [
      { label: 'Users & Roles', path: '/admin/users' },
      { label: 'Audit Log',     path: '/admin/audit' },
      { label: 'Settings',      path: '/admin/settings' },
    ],
  },
];

// Determine if a nav group has an active child
function groupIsActive(item, pathname) {
  if (item.path) return item.exact ? pathname === item.path : pathname.startsWith(item.path);
  return item.children?.some((c) => pathname.startsWith(c.path));
}

// ── NavItem ─────────────────────────────────────────────────────────────────
function NavItem({ item, collapsed, pathname }) {
  const [open, setOpen] = useState(() => groupIsActive(item, pathname));
  const isActive = groupIsActive(item, pathname);

  // Auto-expand when child becomes active
  useEffect(() => {
    if (isActive && item.children) setOpen(true);
  }, [pathname, isActive]);

  const Icon = item.icon;

  if (item.path) {
    return (
      <NavLink
        to={item.path}
        end={item.exact}
        className={({ isActive: a }) =>
          `sidebar-nav-item ${a ? 'active' : ''}`
        }
        title={collapsed ? item.label : undefined}
      >
        <Icon className="sidebar-icon" />
        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
      </NavLink>
    );
  }

  // Group with children
  return (
    <div>
      <button
        onClick={() => !collapsed && setOpen((o) => !o)}
        className={`sidebar-nav-item w-full ${isActive && !open ? 'text-slate-300' : ''}`}
        title={collapsed ? item.label : undefined}
      >
        <Icon className="sidebar-icon" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left truncate">{item.label}</span>
            <span className="ml-auto">
              {open
                ? <ChevronDown className="w-3 h-3 text-slate-500 transition-transform duration-150" />
                : <ChevronRight className="w-3 h-3 text-slate-500 transition-transform duration-150" />
              }
            </span>
          </>
        )}
      </button>

      {!collapsed && open && (
        <div className="ml-6 pl-2.5 border-l border-slate-700/60 mt-0.5 mb-1 space-y-0.5">
          {item.children.map((child) => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive: a }) =>
                `block rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors duration-[120ms] ${
                  a
                    ? 'text-white bg-blue-700/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
              style={{ fontSize: '0.78125rem' }}
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}

      {/* Collapsed: show tooltip on hover */}
      {collapsed && (
        <div className="group/tooltip relative">
          {/* tooltip handled by title attribute above */}
        </div>
      )}
    </div>
  );
}

// ── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const pathname = window.location.pathname;

  const role = user?.role || 'Admin';

  const NAV = NAV_ALL.map(item => {
    if (item.path) {
      return isPathAllowed(item.path, role) ? item : null;
    }
    if (item.children) {
      const allowedChildren = item.children.filter(c => isPathAllowed(c.path, role));
      return allowedChildren.length > 0 ? { ...item, children: allowedChildren } : null;
    }
    return null;
  }).filter(Boolean);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 h-14 px-3 border-b border-sidebar-border flex-shrink-0 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-blue-sm">
          <Droplets className="w-4.5 h-4.5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-sm font-bold text-white tracking-tight leading-none">DairyERP</div>
            <div className="text-2xs text-slate-400 mt-0.5 truncate">Distribution System</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 space-y-0.5 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
        {NAV.map((item) => (
          <NavItem
            key={item.label}
            item={item}
            collapsed={collapsed}
            pathname={pathname}
          />
        ))}
      </nav>

      {/* Collapse toggle (desktop) */}
      <div className="flex-shrink-0 border-t border-sidebar-border p-2">
        <button
          onClick={onToggle}
          className={`sidebar-nav-item w-full ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <PanelLeft className="w-4 h-4 text-slate-500" />
            : (
              <>
                <PanelLeftClose className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400 text-xs">Collapse</span>
              </>
            )
          }
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-sidebar-bg border-r border-sidebar-border flex-shrink-0 transition-all duration-[250ms] ease-out-expo`}
        style={{ width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)' }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-slate-950/60 z-overlay backdrop-blur-sm animate-fade-in"
            onClick={onMobileClose}
          />
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 z-sidebar w-[var(--sidebar-width)] bg-sidebar-bg border-r border-sidebar-border flex flex-col animate-slide-in-left">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
