import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Truck, ShoppingCart,
  Wallet, Calculator, BookOpen, BarChart2, Settings,
  ChevronDown, ChevronRight, Droplets, PanelLeftClose, PanelLeft,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { isPathAllowed } from '../../utils';
import type { SidebarNavItem, SidebarNavChild, UserRole } from '../../types';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItemProps {
  item: SidebarNavItem;
  collapsed: boolean;
  pathname: string;
}

const NAV_ALL: SidebarNavItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
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
      { label: 'Salesperson Ledger', path: '/collections/ledger' },
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
function groupIsActive(item: SidebarNavItem, pathname: string): boolean {
  if (item.path) return item.exact ? pathname === item.path : pathname.startsWith(item.path);
  return item.children?.some((c: SidebarNavChild) => pathname.startsWith(c.path)) ?? false;
}

// ── NavItem ─────────────────────────────────────────────────────────────────
function NavItem({ item, collapsed, pathname }: NavItemProps) {
  const [open, setOpen] = useState(() => groupIsActive(item, pathname));
  const isActive = groupIsActive(item, pathname);

  // Auto-expand when child becomes active
  useEffect(() => {
    if (isActive && item.children) setOpen(true);
  }, [pathname, isActive, item.children]);

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
          {item.children!.map((child) => (
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
    </div>
  );
}

// ── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const role: UserRole = (user?.role as UserRole) || 'Admin';

  const NAV = NAV_ALL.map((item) => {
    if (item.path) {
      return isPathAllowed(item.path, role) ? item : null;
    }
    if (item.children) {
      const allowedChildren = item.children.filter((c) => isPathAllowed(c.path, role));
      return allowedChildren.length > 0 ? { ...item, children: allowedChildren } : null;
    }
    return null;
  }).filter((item): item is SidebarNavItem => item !== null);

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
        className="hidden lg:flex flex-col bg-sidebar-bg border-r border-sidebar-border flex-shrink-0 transition-all duration-[250ms] ease-out-expo"
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
