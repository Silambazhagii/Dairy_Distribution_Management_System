import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, Eye, EyeOff, AlertCircle, Sun } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@dairy.com', password: 'admin123' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please enter your credentials.'); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between bg-sidebar-bg w-96 p-10 flex-shrink-0 border-r border-sidebar-border">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-blue-sm">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-base leading-tight tracking-tight">DairyERP</p>
              <p className="text-slate-500 text-xs">Distribution System</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4 tracking-tight leading-snug">
            Manage your dairy operations with clarity
          </h1>
          <p className="text-slate-400 text-xs leading-relaxed">
            Complete cold-to-consumer visibility. From batch inward entry through dispatch, sales, 
            collections and settlement — all in one integrated platform.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3">
            {[
              { label: 'Cold Storage', desc: 'Real-time stock' },
              { label: 'Dispatch', desc: 'Route management' },
              { label: 'Collections', desc: 'Multi-mode payment' },
              { label: 'Reports', desc: 'Business insights' },
            ].map((f) => (
              <div key={f.label} className="bg-sidebar-hover/40 border border-sidebar-border rounded-lg px-3 py-2.5">
                <p className="text-white text-xs font-semibold">{f.label}</p>
                <p className="text-slate-400 text-[10px] mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
          <Sun className="w-3.5 h-3.5" />
          <span>Supports morning &amp; evening dispatch sessions</span>
        </div>
      </div>

      {/* Right panel – login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-blue-sm">
              <Droplets className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight">DairyERP</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Sign in</h2>
            <p className="text-xs text-slate-500 mt-2">Enter your credentials to access the ERP platform</p>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="form-input"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@dairy.com"
                required
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="form-input pr-10"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus-ring rounded"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2 mt-2 font-semibold">
              {loading ? <span className="btn-spinner mr-1.5" /> : null}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="p-3.5 bg-slate-100 rounded-lg border border-slate-200/60">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Demo credentials</p>
            <p className="text-xs text-slate-700 font-mono">admin@dairy.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
