import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import CommandSearch from '../components/ui/CommandSearch';
import { useAuth } from '../hooks/useAuth';

export default function AppLayout() {
  const { isAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans antialiased text-slate-800">
      {/* Sidebar (Desktop & Mobile) */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Shell */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <Header
          onMenuToggle={() => setMobileOpen((o) => !o)}
          onSearchOpen={() => setSearchOpen(true)}
        />

        {/* Dynamic content scrollable area */}
        <main className="flex-1 overflow-y-auto page-enter">
          <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Command Search (Cmd+K) */}
      <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
