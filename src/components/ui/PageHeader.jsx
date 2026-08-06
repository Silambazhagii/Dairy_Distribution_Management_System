import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PageHeader({ title, breadcrumbs = [], actions, description }) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
      <div className="space-y-1">
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-2xs font-medium text-slate-400 uppercase tracking-wider" aria-label="breadcrumb">
            <Link to="/" className="hover:text-slate-600 transition-colors">Home</Link>
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                <ChevronRight className="w-3 h-3 text-slate-300" />
                <span className={i === breadcrumbs.length - 1 ? 'text-slate-600 font-semibold' : 'hover:text-slate-600 transition-colors'}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>
        )}
        <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none md:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
