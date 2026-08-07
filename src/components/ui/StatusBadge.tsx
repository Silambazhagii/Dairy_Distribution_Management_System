import React from 'react';
import type { StatusValue } from '../../types';

interface StatusBadgeVariant {
  badge: string;
  dot: string;
}

const variants: Partial<Record<string, StatusBadgeVariant>> = {
  // General statuses
  Active:           { badge: 'bg-green-50 text-green-700 ring-green-600/10',   dot: 'bg-green-500' },
  Inactive:         { badge: 'bg-slate-50 text-slate-600 ring-slate-500/10',   dot: 'bg-slate-400' },
  Draft:            { badge: 'bg-slate-50 text-slate-600 ring-slate-500/10',   dot: 'bg-slate-400' },
  Confirmed:        { badge: 'bg-blue-50 text-blue-700 ring-blue-600/10',      dot: 'bg-blue-500' },
  Pending:          { badge: 'bg-amber-50 text-amber-800 ring-amber-600/10',   dot: 'bg-amber-500 animate-pulse-dot' },
  Verified:         { badge: 'bg-teal-50 text-teal-700 ring-teal-600/10',      dot: 'bg-teal-500' },
  Closed:           { badge: 'bg-slate-100 text-slate-700 ring-slate-500/10',  dot: 'bg-slate-500' },
  Paid:             { badge: 'bg-green-50 text-green-700 ring-green-600/10',   dot: 'bg-green-500' },
  'Partially Paid': { badge: 'bg-cyan-50 text-cyan-700 ring-cyan-600/10',      dot: 'bg-cyan-500' },
  Outstanding:      { badge: 'bg-red-50 text-red-700 ring-red-600/10',         dot: 'bg-red-500' },
  Expired:          { badge: 'bg-red-100 text-red-800 ring-red-700/10',        dot: 'bg-red-600' },
  Spoiled:          { badge: 'bg-orange-50 text-orange-700 ring-orange-600/10', dot: 'bg-orange-500' },
  'Low Stock':      { badge: 'bg-yellow-50 text-yellow-800 ring-yellow-600/10', dot: 'bg-yellow-500' },

  // Dispatch statuses
  'In Transit':     { badge: 'bg-purple-50 text-purple-700 ring-purple-600/10', dot: 'bg-purple-500' },
  Delivered:        { badge: 'bg-green-50 text-green-700 ring-green-600/10',   dot: 'bg-green-500' },
  Returned:         { badge: 'bg-slate-100 text-slate-700 ring-slate-500/10',  dot: 'bg-slate-500' },

  // Settlement statuses
  Short:            { badge: 'bg-red-50 text-red-700 ring-red-600/10',         dot: 'bg-red-500' },
  Excess:           { badge: 'bg-blue-50 text-blue-700 ring-blue-600/10',      dot: 'bg-blue-500' },
  Settled:          { badge: 'bg-green-50 text-green-700 ring-green-600/10',   dot: 'bg-green-500' },

  // Collection statuses
  Deposited:        { badge: 'bg-indigo-50 text-indigo-700 ring-indigo-600/10', dot: 'bg-indigo-500' },
};

const defaultVariant: StatusBadgeVariant = { badge: 'bg-slate-50 text-slate-600 ring-slate-500/10', dot: 'bg-slate-400' };

interface StatusBadgeProps {
  status: StatusValue | string;
  size?: 'xs' | 'sm';
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  if (!status) return null;

  const match = variants[status] ?? defaultVariant;
  const sizeClass = size === 'xs'
    ? 'px-1.5 py-0.5 text-[10px] gap-1'
    : 'px-2 py-0.5 text-xs gap-1.5';

  return (
    <span className={`inline-flex items-center rounded-full font-semibold ring-1 ring-inset whitespace-nowrap leading-none ${sizeClass} ${match.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${match.dot}`} aria-hidden="true" />
      {status}
    </span>
  );
}
