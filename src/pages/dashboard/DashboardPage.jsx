import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Package, Truck, Wallet, AlertTriangle, TrendingUp, ShoppingCart,
  ArrowRight, Thermometer, Clock
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import PageHeader from '../../components/ui/PageHeader';
import {
  mockDashboardStats, mockSalesChartData, mockStockByProduct,
  mockCollectionBreakdown, mockDispatches, mockBatches
} from '../../mock';
import { formatCurrency, formatNumber } from '../../utils';
import { Link } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs ring-1 ring-slate-900/5">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-1.5 font-medium" style={{ color: p.color }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const { session } = useAuth();
  const s = mockDashboardStats;

  const recentDispatches = mockDispatches.slice(0, 4);
  const lowStockBatches = mockBatches.filter((b) => b.availableQty < 200 && b.status === 'Active');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Live operational overview for current dairy distribution — ${session} Session`}
        breadcrumbs={['Dashboard']}
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Stock" value={`${formatNumber(s.totalStock)} units`} icon={Package} color="blue" trend={1} trendLabel="vs yesterday" />
        <StatCard title="Dispatched Today" value={formatNumber(s.dispatchedToday)} icon={Truck} color="purple" trend={1} trendLabel="+12% vs avg" />
        <StatCard title="Today's Sales" value={formatCurrency(s.todaySales)} icon={ShoppingCart} color="green" trend={1} trendLabel="+8% vs avg" />
        <StatCard title="Pending Collections" value={formatCurrency(s.pendingCollections)} icon={Wallet} color="amber" trend={-1} trendLabel="₹12,400 overdue" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Routes" value={s.activeRoutes} icon={TrendingUp} color="teal" />
        <StatCard title="Spoilage Today" value={`${s.spoilageToday} units`} icon={AlertTriangle} color="red" />
        <StatCard title="Pending Settlements" value={s.pendingSettlements} icon={Clock} color="amber" />
        <StatCard title="Low Stock Alerts" value={s.lowStockItems} icon={Thermometer} color="red" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="card xl:col-span-2 flex flex-col">
          <div className="card-header">
            <div>
              <h3 className="card-title">Weekly Sales</h3>
              <p className="text-2xs text-slate-400 mt-0.5">Morning vs Evening session values</p>
            </div>
            <Link to="/reports" className="btn-ghost btn-sm text-blue-600 gap-1 font-semibold">
              View reports <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="card-body flex-1 flex flex-col justify-end pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockSalesChartData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="morning" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.08} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="evening" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.08} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12, fontWeight: 500 }} iconType="circle" iconSize={6} />
                  <Area type="monotone" dataKey="morning" name="Morning" stroke="#3b82f6" strokeWidth={2} fill="url(#morning)" dot={false} activeDot={{ r: 4 }} />
                  <Area type="monotone" dataKey="evening" name="Evening" stroke="#8b5cf6" strokeWidth={2} fill="url(#evening)" dot={false} activeDot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Collection Breakdown */}
        <div className="card flex flex-col">
          <div className="card-header">
            <h3 className="card-title">Collections by Mode</h3>
          </div>
          <div className="card-body flex-1 flex flex-col justify-between">
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mockCollectionBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                    {mockCollectionBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-800 tracking-tight">100%</span>
                <span className="text-3xs font-semibold text-slate-400 uppercase tracking-widest">Remitted</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 pt-3 border-t border-slate-55">
              {mockCollectionBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-semibold text-slate-700">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stock comparison + Activity side list */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Stock by Product */}
        <div className="card xl:col-span-2 flex flex-col">
          <div className="card-header">
            <h3 className="card-title">Stock vs Dispatched (Today)</h3>
            <Link to="/inventory/cold-storage" className="btn-ghost btn-sm text-blue-600 gap-1 font-semibold">
              View stock <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="card-body flex-1 pt-2">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockStockByProduct} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip />
                  <Bar dataKey="stock" name="Available" fill="#dbeafe" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="dispatched" name="Dispatched" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right side items */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* Recent Dispatches */}
          <div className="card flex-1 flex flex-col">
            <div className="card-header">
              <h3 className="card-title">Recent Dispatches</h3>
              <Link to="/dispatch/history" className="text-xs text-blue-600 hover:text-blue-700 font-semibold">View all</Link>
            </div>
            <div className="divide-y divide-slate-100 flex-1">
              {recentDispatches.map((d) => (
                <div key={d.id} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 truncate">{d.id}</p>
                    <p className="text-2xs text-slate-400 truncate mt-0.5">{d.salesperson} · {d.totalQty} units</p>
                  </div>
                  <StatusBadge status={d.status} size="xs" />
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="card flex-1 flex flex-col">
            <div className="card-header">
              <h3 className="card-title">Low Stock Alerts</h3>
            </div>
            <div className="divide-y divide-slate-100 flex-1">
              {lowStockBatches.length === 0 ? (
                <div className="flex items-center justify-center h-full py-6">
                  <p className="text-xs text-slate-400">All stock levels normal</p>
                </div>
              ) : (
                lowStockBatches.map((b) => (
                  <div key={b.id} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800 truncate">{b.product}</p>
                      <p className="text-2xs text-slate-400 mt-0.5">{b.id}</p>
                    </div>
                    <span className="text-xs font-bold text-red-600 flex-shrink-0">{b.availableQty} left</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
