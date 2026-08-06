import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const icons = {
  success: <CheckCircle className="w-4 h-4 text-green-600" />,
  error:   <XCircle className="w-4 h-4 text-red-600" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-600" />,
  info:    <Info className="w-4 h-4 text-blue-600" />,
};

const borderColors = {
  success: 'border-l-green-500 bg-green-50/20 ring-green-600/10',
  error:   'border-l-red-500 bg-red-50/20 ring-red-600/10',
  warning: 'border-l-amber-500 bg-amber-50/20 ring-amber-600/10',
  info:    'border-l-blue-500 bg-blue-50/20 ring-blue-600/10',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-5 right-5 z-toast flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={`pointer-events-auto bg-white rounded-lg shadow-lg border border-slate-200 border-l-4 p-3.5 flex items-start gap-3 animate-toast-in ring-1 ring-inset ${borderColors[t.type]}`}
          >
            <span className="flex-shrink-0 mt-0.5">{icons[t.type]}</span>
            <p className="text-xs font-medium text-slate-700 flex-1 leading-normal">{t.message}</p>
            <button 
              onClick={() => dismiss(t.id)} 
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors focus-ring p-0.5 rounded"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
};
