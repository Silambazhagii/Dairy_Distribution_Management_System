import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search, Bell, ChevronDown, Sun, Moon, Menu,
  User, LogOut, Settings, HelpCircle, Command
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Modal } from '../ui/Modal';

const SESSIONS = ['Morning', 'Evening'];

// Page title from path
function usePageTitle() {
  const { pathname } = useLocation();
  const map = {
    '/':                          'Dashboard',
    '/inventory/batch-entry':     'Batch / Inward Entry',
    '/inventory/cold-storage':    'Cold Storage',
    '/inventory/spoilage':        'Spoilage',
    '/dispatch/new':              'New Dispatch',
    '/dispatch/history':          'Dispatch History',
    '/sales/entry':               'Sales Entry',
    '/sales/invoices':            'Invoices',
    '/sales/returns':             'Sales Returns',
    '/collections/entry':         'Collection Entry',
    '/collections/outstanding':   'Outstanding',
    '/collections/ledger':        'Dealer Ledger',
    '/settlement':                'Settlement',
    '/masters/products':          'Products',
    '/masters/routes':            'Routes',
    '/masters/dealers':           'Dealers',
    '/masters/salespersons':      'Salespersons',
    '/masters/vehicles':          'Vehicles',
    '/reports':                   'Reports',
    '/admin/users':               'Users & Roles',
    '/admin/audit':               'Audit Log',
    '/admin/settings':            'Settings',
  };
  return map[pathname] || 'DairyERP';
}

// Today's date in ERP format
function todayLabel() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
  });
}

// Mock notifications
const NOTIFICATIONS = [
  { id: 1, text: '3 low-stock alerts in cold storage', type: 'warning', time: '5m ago', unread: true },
  { id: 2, text: 'Settlement pending for Rajesh Kumar', type: 'info', time: '1h ago', unread: true },
  { id: 3, text: 'INV-2024-0451 — payment overdue', type: 'danger', time: '2h ago', unread: false },
];

export default function Header({ onMenuToggle, onSearchOpen }) {
  const { user, logout, session, setSession } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const pageTitle = usePageTitle();
  const notifRef = useRef(null);
  const userRef = useRef(null);

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onSearchOpen?.();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onSearchOpen]);

  const notifTypeColor = (type) => ({
    warning: 'bg-amber-400',
    info:    'bg-blue-500',
    danger:  'bg-red-500',
  }[type] || 'bg-slate-400');

  const handleDropdownClick = (item) => {
    setUserOpen(false);
    if (item.label === 'Profile') {
      setProfileOpen(true);
    } else if (item.label === 'Settings') {
      navigate('/admin/settings');
    } else if (item.label === 'Help & Support') {
      setHelpOpen(true);
    }
  };

  return (
    <header
      className="h-14 bg-white border-b border-slate-200 flex items-center gap-3 px-4 flex-shrink-0 z-10"
      style={{ height: 'var(--header-height)' }}
    >
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden btn-ghost btn-icon -ml-1 text-slate-500"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title (desktop) */}
      <div className="hidden lg:block">
        <h1 className="text-sm font-semibold text-slate-800 tracking-tight leading-none">{pageTitle}</h1>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Global search trigger */}
      <button
        onClick={onSearchOpen}
        className="flex items-center justify-center gap-2 h-8 w-8 sm:w-auto px-0 sm:px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-400
                   hover:bg-white hover:border-slate-300 hover:text-slate-600
                   transition-all duration-[150ms] text-xs group focus-ring"
        aria-label="Open search"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:block">Search…</span>
        <kbd className="hidden md:flex items-center gap-0.5 ml-2 px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-500 font-mono text-2xs group-hover:bg-slate-200 transition-colors">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </button>

      {/* Date & Session */}
      <div className="hidden lg:flex items-center gap-1.5">
        <span className="text-xs text-slate-400">{todayLabel()}</span>
        <div className="flex rounded-full border border-slate-200 bg-slate-50 overflow-hidden">
          {SESSIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSession(s)}
              className={`px-2.5 py-1 text-xs font-medium transition-all duration-[150ms] ${
                session === s
                  ? 'bg-blue-600 text-white shadow-blue-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div ref={notifRef} className="relative">
        <button
          onClick={() => { setNotifOpen((o) => !o); setUserOpen(false); }}
          className="btn-ghost btn-icon relative"
          aria-label={`${unreadCount} notifications`}
        >
          <Bell className="w-4.5 h-4.5 text-slate-500" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-lg z-modal animate-slide-down overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-2xs bg-red-100 text-red-700 rounded-full px-1.5 py-0.5 font-semibold">{unreadCount} new</span>
              )}
            </div>
            {NOTIFICATIONS.map((n) => (
              <div key={n.id} className={`flex gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${n.unread ? 'bg-blue-50/30' : ''}`}>
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${notifTypeColor(n.type)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700 leading-relaxed">{n.text}</p>
                  <p className="text-2xs text-slate-400 mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
            <div className="px-4 py-2 text-center">
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all notifications</button>
            </div>
          </div>
        )}
      </div>

      {/* User avatar dropdown */}
      <div ref={userRef} className="relative">
        <button
          onClick={() => { setUserOpen((o) => !o); setNotifOpen(false); }}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-100 transition-colors duration-[150ms] focus-ring"
        >
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-slate-800 leading-none">{user?.name || 'Admin User'}</div>
            <div className="text-2xs text-slate-400 mt-0.5 leading-none">{user?.role || 'Admin'}</div>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-[150ms] ${userOpen ? 'rotate-180' : ''}`} />
        </button>

        {userOpen && (
          <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-lg z-[50] animate-slide-down overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-800">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email || 'admin@dairy.com'}</p>
            </div>
            {[
              { icon: User,     label: 'Profile' },
              { icon: Settings, label: 'Settings' },
              { icon: HelpCircle, label: 'Help & Support' },
            ].map((item) => (
              <button 
                key={item.label} 
                onClick={() => handleDropdownClick(item)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <item.icon className="w-3.5 h-3.5 text-slate-400" />
                {item.label}
              </button>
            ))}
            <div className="border-t border-slate-100">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Profile Modal */}
      <Modal open={profileOpen} onClose={() => setProfileOpen(false)} title="My Profile" size="sm">
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2 pb-4 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <h3 className="text-sm font-semibold text-slate-800">{user?.name || 'Admin User'}</h3>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-2xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
              {user?.role || 'Admin'}
            </span>
          </div>
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Email Address</span>
              <span className="font-medium text-slate-700">{user?.email || 'admin@dairy.com'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Current Session</span>
              <span className="font-medium text-slate-700">{session} Session</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Access Level</span>
              <span className="font-medium text-slate-700">Full System Admin</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Help & Support Modal */}
      <Modal open={helpOpen} onClose={() => setHelpOpen(false)} title="Help & Support" size="sm">
        <div className="space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            Need assistance with DairyERP distribution systems or route configuration? Contact our system administrators.
          </p>
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Support Email</span>
              <a href="mailto:support@dairy-erp.com" className="font-semibold text-blue-600 hover:underline">
                support@dairy-erp.com
              </a>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Helpline Hotline</span>
              <span className="font-mono text-slate-700">+91 44 2468 1357</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Operating Hours</span>
              <span className="font-medium text-slate-700">Mon - Sat, 9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">ERP Version</span>
              <span className="font-semibold text-slate-700">v1.2.0 (Stable release)</span>
            </div>
          </div>
        </div>
      </Modal>
    </header>
  );
}
