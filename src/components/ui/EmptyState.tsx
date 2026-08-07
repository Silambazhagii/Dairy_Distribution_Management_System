import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

export default function EmptyState({
  message = 'No records found',
  description,
  action,
  icon: Icon = Inbox,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-4 text-center animate-fade-in max-w-sm mx-auto">
      <span className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4 shadow-2xs">
        <Icon className="w-5 h-5" />
      </span>
      <h3 className="text-sm font-semibold text-slate-800 tracking-tight">{message}</h3>
      {description && (
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
