import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, LayoutDashboard, Package, Truck, ShoppingCart,
  Wallet, Calculator, BookOpen, BarChart2, Users, Settings,
  FileText, ArrowRight, Clock, Hash,
} from 'lucide-react';
import { mockSalespersons, mockBatches, mockSales } from '../../mock';
import type { CommandItem } from '../../types';

interface CommandSearchProps {
  open: boolean;
  onClose: () => void;
}

// ── Command palette items ────────────────────────────────────────────────────
const NAV_ITEMS: CommandItem[] = [
  { id: 'dashboard',     label: 'Dashboard',            path: '/',                        icon: LayoutDashboard, group: 'Navigation' },
  { id: 'batch-entry',   label: 'Batch / Inward Entry', path: '/inventory/batch-entry',   icon: Package,         group: 'Inventory' },
  { id: 'cold-storage',  label: 'Cold Storage Stock',   path: '/inventory/cold-storage',  icon: Package,         group: 'Inventory' },
  { id: 'spoilage',      label: 'Spoilage Recording',   path: '/inventory/spoilage',      icon: Package,         group: 'Inventory' },
  { id: 'dispatch-new',  label: 'New Dispatch',         path: '/dispatch/new',            icon: Truck,           group: 'Dispatch' },
  { id: 'dispatch-hist', label: 'Dispatch History',     path: '/dispatch/history',        icon: Truck,           group: 'Dispatch' },
  { id: 'sales-entry',   label: 'Sales Entry',          path: '/sales/entry',             icon: ShoppingCart,    group: 'Sales' },
  { id: 'invoices',      label: 'Invoices',             path: '/sales/invoices',          icon: FileText,        group: 'Sales' },
  { id: 'returns',       label: 'Sales Returns',        path: '/sales/returns',           icon: ShoppingCart,    group: 'Sales' },
  { id: 'col-entry',     label: 'Collection Entry',     path: '/collections/entry',       icon: Wallet,          group: 'Collections' },
  { id: 'outstanding',   label: 'Outstanding',          path: '/collections/outstanding', icon: Wallet,          group: 'Collections' },
  { id: 'ledger',        label: 'Salesperson Ledger',   path: '/collections/ledger',      icon: BookOpen,        group: 'Collections' },
  { id: 'settlement',    label: 'Settlement',           path: '/settlement',              icon: Calculator,      group: 'Settlement' },
  { id: 'reports',       label: 'Reports',              path: '/reports',                 icon: BarChart2,       group: 'Reports' },
  { id: 'users',         label: 'Users & Roles',        path: '/admin/users',             icon: Users,           group: 'Administration' },
  { id: 'audit',         label: 'Audit Log',            path: '/admin/audit',             icon: FileText,        group: 'Administration' },
  { id: 'settings',      label: 'Settings',             path: '/admin/settings',          icon: Settings,        group: 'Administration' },
];

const RECENT_KEY = 'dairy_command_recent';
const MAX_RECENT = 5;

function getRecent(): CommandItem[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') as CommandItem[]; }
  catch { return []; }
}

function addRecent(item: CommandItem): void {
  const prev = getRecent().filter((r) => r.id !== item.id);
  localStorage.setItem(RECENT_KEY, JSON.stringify([item, ...prev].slice(0, MAX_RECENT)));
}

// ── Component ────────────────────────────────────────────────────────────────
export default function CommandSearch({ open, onClose }: CommandSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery]       = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef  = useRef<HTMLDivElement>(null);
  const [recent, setRecent]     = useState<CommandItem[]>(getRecent);

  // Build dynamic items from mock data
  const dynamicItems: CommandItem[] = useMemo(() => [
    ...mockSalespersons.slice(0, 10).map((s) => ({
      id: `sp-${s.id}`, label: s.name, subtitle: `Salesperson · Routes: ${s.routes.join(', ')}`,
      path: '/settlement', icon: Users, group: 'Salespersons',
    })),
    ...mockBatches.slice(0, 10).map((b) => ({
      id: `batch-${b.id}`, label: b.id, subtitle: `${b.product} · ${b.availableQty} units`,
      path: '/inventory/cold-storage', icon: Hash, group: 'Batches',
    })),
    ...mockSales.slice(0, 10).map((s) => ({
      id: `inv-${s.id}`, label: s.id, subtitle: `Invoice · ${s.salesperson}${s.customer ? ` (${s.customer})` : ''}`,
      path: '/sales/invoices', icon: FileText, group: 'Invoices',
    })),
  ], []);

  const allItems = useMemo(() => [...NAV_ITEMS, ...dynamicItems], [dynamicItems]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allItems
      .filter((item) =>
        item.label.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query, allItems]);

  const displayItems: CommandItem[] = query.trim() ? results : recent;
  const displayLabel: string | null = query.trim() ? null : 'Recent';

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setRecent(getRecent());
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => displayItems.length > 0 ? Math.min(s + 1, displayItems.length - 1) : 0); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected((s) => displayItems.length > 0 ? Math.max(s - 1, 0) : 0); }
      if (e.key === 'Enter')     { e.preventDefault(); if (displayItems[selected]) handleSelect(displayItems[selected]); }
      if (e.key === 'Escape')    { e.preventDefault(); onClose(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selected, displayItems]);

  // Scroll selected into view
  useEffect(() => {
    const el = listRef.current?.querySelector('[data-selected="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  const handleSelect = (item: CommandItem) => {
    addRecent(item);
    navigate(item.path);
    onClose();
  };

  if (!open) return null;

  // Group results
  const grouped = displayItems.reduce<Record<string, CommandItem[]>>((acc, item) => {
    const g = item.group;
    if (!acc[g]) acc[g] = [];
    acc[g].push(item);
    return acc;
  }, {});

  let flatIndex = 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[70] animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Palette */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command search"
        className="fixed z-[70] top-[12vh] left-1/2 -translate-x-1/2 w-full max-w-xl animate-scale-in"
      >
        <div className="mx-4 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
              placeholder="Search pages, salespersons, invoices, batches…"
              className="flex-1 bg-transparent text-slate-900 placeholder:text-slate-400 outline-none text-sm"
              autoComplete="off"
              spellCheck={false}
              autoFocus
            />
            <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 text-xs font-mono">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-80 overflow-y-auto py-1.5">
            {displayItems.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-slate-400">
                {query ? 'No results found' : 'Start typing to search…'}
              </div>
            )}

            {displayLabel && displayItems.length > 0 && (
              <div className="px-4 pt-1 pb-0.5 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-slate-400" />
                <span className="text-2xs font-semibold text-slate-400 uppercase tracking-widest">Recent</span>
              </div>
            )}

            {Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                {query.trim() && (
                  <div className="px-4 pt-2 pb-0.5">
                    <span className="text-2xs font-semibold text-slate-400 uppercase tracking-widest">{group}</span>
                  </div>
                )}
                {items.map((item) => {
                  const idx = flatIndex++;
                  const isSelected = idx === selected;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      data-selected={isSelected}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelected(idx)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors duration-75 ${
                        isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-blue-100' : 'bg-slate-100'
                      }`}>
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className={`block text-sm font-medium truncate ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                          {item.label}
                        </span>
                        {item.subtitle && (
                          <span className="block text-xs text-slate-400 truncate">{item.subtitle}</span>
                        )}
                      </span>
                      {isSelected && <ArrowRight className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-slate-200 text-slate-600 text-2xs font-mono">↑↓</kbd> Navigate</span>
              <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-slate-200 text-slate-600 text-2xs font-mono">↵</kbd> Select</span>
              <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-slate-200 text-slate-600 text-2xs font-mono">ESC</kbd> Close</span>
            </div>
            <span className="text-xs text-slate-400 hidden sm:block">DairyERP</span>
          </div>
        </div>
      </div>
    </>
  );
}
