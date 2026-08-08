// Reports Hub Page
import { useState } from 'react';
import { TrendingUp, Package, Wallet, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { DateInput } from '../../components/ui/FormInputs';
import { mockSales, mockCollections, mockBatches, mockSpoilage } from '../../mock';
import { formatCurrency, formatNumber, todayISO } from '../../utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent';

const REPORT_TYPES = [
  { id: 'sales',       label: 'Sales Report',       icon: TrendingUp,    color: 'blue' as const },
  { id: 'collections', label: 'Collections Report', icon: Wallet,        color: 'green' as const },
  { id: 'stock',       label: 'Stock Report',       icon: Package,       color: 'purple' as const },
  { id: 'spoilage',    label: 'Spoilage Report',    icon: AlertTriangle, color: 'red' as const },
];

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState('sales');
  const [fromDate, setFromDate]         = useState('2026-08-01');
  const [toDate, setToDate]             = useState(todayISO());

  const colorMap = {
    blue:   'bg-blue-50 text-blue-700 border-blue-200',
    green:  'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    red:    'bg-red-50 text-red-700 border-red-200',
  };

  const salesData      = mockSales.map((s) => ({ name: s.id.slice(-4), cash: s.saleType === 'Cash' ? s.amount : 0, credit: s.saleType === 'Credit' ? s.amount : 0 }));
  const collectionData = mockCollections.map((c) => ({ name: c.id.slice(-4), amount: c.amount, mode: c.mode }));
  const stockData      = mockBatches.map((b) => ({ name: b.product.slice(0, 10), received: b.quantityReceived, available: b.availableQty }));
  const spoilageData   = mockSpoilage.map((s) => ({ name: s.product.slice(0, 10), qty: s.qty }));

  return (
    <div>
      <PageHeader title="Reports" breadcrumbs={['Reports']} description="Generate and export business reports" />

      {/* Report type selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {REPORT_TYPES.map((r) => {
          const Icon = r.icon;
          const isActive = activeReport === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setActiveReport(r.id)}
              className={`card p-4 text-left transition-all ${isActive ? `border-2 ${colorMap[r.color]}` : 'hover:shadow-card-md'}`}
            >
              <Icon className={`w-5 h-5 mb-2 ${isActive ? '' : 'text-gray-400'}`} />
              <p className={`text-sm font-semibold ${isActive ? '' : 'text-gray-700'}`}>{r.label}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="card mb-5">
        <div className="card-body flex items-end gap-4 flex-wrap">
          <DateInput label="From Date" id="from" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-36" />
          <DateInput label="To Date"   id="to"   value={toDate}   onChange={(e) => setToDate(e.target.value)}   className="w-36" />
          <button className="btn-primary">Generate Report</button>
          <button className="btn-secondary">Export CSV</button>
          <button className="btn-secondary">Export PDF</button>
        </div>
      </div>

      {/* Report content */}
      {activeReport === 'sales' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="card p-4"><p className="text-xs text-gray-500">Total Sales</p><p className="text-xl font-bold">{formatCurrency(mockSales.reduce((s, r) => s + r.amount, 0))}</p></div>
            <div className="card p-4"><p className="text-xs text-gray-500">Cash Sales</p><p className="text-xl font-bold text-green-700">{formatCurrency(mockSales.filter((s) => s.saleType === 'Cash').reduce((s, r) => s + r.amount, 0))}</p></div>
            <div className="card p-4"><p className="text-xs text-gray-500">Credit Sales</p><p className="text-xl font-bold text-blue-700">{formatCurrency(mockSales.filter((s) => s.saleType === 'Credit').reduce((s, r) => s + r.amount, 0))}</p></div>
          </div>
          <div className="card">
            <div className="card-header"><h3 className="text-sm font-semibold">Sales Breakdown</h3></div>
            <div className="card-body pt-0">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `₹${v / 1000}k`} />
                  <Tooltip formatter={(v: ValueType | undefined) => formatCurrency(Number(v ?? 0))} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="cash"   name="Cash"   fill="#22c55e" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="credit" name="Credit" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeReport === 'collections' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4"><p className="text-xs text-gray-500">Total Collected</p><p className="text-xl font-bold text-green-700">{formatCurrency(mockCollections.reduce((s, c) => s + c.amount, 0))}</p></div>
            <div className="card p-4"><p className="text-xs text-gray-500">Transactions</p><p className="text-xl font-bold">{mockCollections.length}</p></div>
          </div>
          <div className="card">
            <div className="card-header"><h3 className="text-sm font-semibold">Collection Amounts</h3></div>
            <div className="card-body pt-0">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={collectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `₹${v / 1000}k`} />
                  <Tooltip formatter={(v: ValueType | undefined) => formatCurrency(Number(v ?? 0))} />
                  <Bar dataKey="amount" name="Amount" fill="#22c55e" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeReport === 'stock' && (
        <div className="card">
          <div className="card-header"><h3 className="text-sm font-semibold">Stock Summary</h3></div>
          <div className="card-body pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip formatter={(v: ValueType | undefined) => formatNumber(Number(v ?? 0))} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="received"  name="Received"  fill="#dbeafe" radius={[0, 3, 3, 0]} />
                <Bar dataKey="available" name="Available" fill="#3b82f6" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeReport === 'spoilage' && (
        <div className="space-y-4">
          <div className="card p-4 w-fit"><p className="text-xs text-gray-500">Total Spoilage</p><p className="text-xl font-bold text-red-600">{formatNumber(mockSpoilage.reduce((s, r) => s + r.qty, 0))} units</p></div>
          <div className="card">
            <div className="card-header"><h3 className="text-sm font-semibold">Spoilage by Product</h3></div>
            <div className="card-body pt-0">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={spoilageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: ValueType | undefined) => formatNumber(Number(v ?? 0))} />
                  <Bar dataKey="qty" name="Units Spoiled" fill="#ef4444" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
