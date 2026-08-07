import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

// ─── Modal ─────────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  footer?: React.ReactNode;
}

export function Modal({ open, onClose, title, children, size = 'md', footer }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const sizes: Record<NonNullable<ModalProps['size']>, string> = {
    sm:   'max-w-md',
    md:   'max-w-lg',
    lg:   'max-w-2xl',
    xl:   'max-w-4xl',
    full: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-xs animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div className={`relative bg-white rounded-xl shadow-xl w-full ${sizes[size]} flex flex-col max-h-[90vh] overflow-hidden animate-scale-in`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
          <h2 className="text-base font-semibold text-slate-800 tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-ring"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-5 text-sm text-slate-600">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-end gap-2 flex-shrink-0 bg-slate-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ConfirmDialog ─────────────────────────────────────────────────────────────
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  danger = false,
  loading = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-xs animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-5 animate-scale-in overflow-hidden">
        <div className="flex items-start gap-4">
          <span className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
            <AlertTriangle className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 tracking-tight leading-tight">{title}</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-6 pt-3 border-t border-slate-50">
          <button onClick={onClose} className="btn-secondary btn-sm" disabled={loading}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`${danger ? 'btn-danger' : 'btn-primary'} btn-sm min-w-[90px]`}
          >
            {loading ? <span className="btn-spinner" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
