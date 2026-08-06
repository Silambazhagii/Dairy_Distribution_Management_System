// Invoices Page
import React from 'react';
import { FileText, Download } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import PageHeader from '../../components/ui/PageHeader';
import { mockSales } from '../../mock';
import { formatDate, formatCurrency } from '../../utils';

export default function InvoicesPage() {
  const columns = [
    { header: 'Invoice No.', accessor: 'id', sortable: true, key: 'id' },
    { header: 'Date', key: 'date', render: (r) => formatDate(r.date), sortable: true, accessor: 'date' },
    { header: 'Dealer', accessor: 'dealer', sortable: true, key: 'dealer' },
    { header: 'Route', accessor: 'route', key: 'route' },
    { header: 'Salesperson', accessor: 'salesperson', key: 'sp' },
    { header: 'Sold', key: 'sold', render: (r) => <span className="tabular-nums">{r.soldQty}</span> },
    { header: 'Amount', accessor: 'amount', sortable: true, key: 'amt', render: (r) => <span className="font-semibold tabular-nums">{formatCurrency(r.amount)}</span> },
    { header: 'Discount', key: 'disc', render: (r) => <span className="tabular-nums text-gray-500">{formatCurrency(r.discount)}</span> },
    { header: 'Type', key: 'type', render: (r) => (
      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${r.saleType === 'Cash' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>{r.saleType}</span>
    )},
    { header: 'Status', key: 'status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  const totalAmount = mockSales.reduce((s, r) => s + r.amount, 0);
  const creditAmount = mockSales.filter((r) => r.saleType === 'Credit').reduce((s, r) => s + r.amount, 0);

  return (
    <div>
      <PageHeader title="Invoices" breadcrumbs={['Sales', 'Invoices']} description="All generated invoices" />

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="card p-4"><p className="text-xs text-gray-500">Total Sales</p><p className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(totalAmount)}</p></div>
        <div className="card p-4"><p className="text-xs text-gray-500">Credit Sales</p><p className="text-xl font-bold text-blue-700 mt-1">{formatCurrency(creditAmount)}</p></div>
        <div className="card p-4"><p className="text-xs text-gray-500">Cash Sales</p><p className="text-xl font-bold text-green-700 mt-1">{formatCurrency(totalAmount - creditAmount)}</p></div>
      </div>

      <DataTable
        columns={columns}
        data={mockSales}
        searchKeys={['id', 'dealer', 'salesperson', 'saleType', 'status']}
        searchPlaceholder="Search invoices…"
        exportFilename="invoices"
        actions={(row) => (
          <button className="btn-ghost btn-sm p-1.5" title="Download invoice">
            <Download className="w-3.5 h-3.5" />
          </button>
        )}
      />
    </div>
  );
}
