// Outstanding Page
import React from 'react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import { mockOutstanding } from '../../mock';
import { formatCurrency, formatNumber } from '../../utils';
import { AlertCircle, CheckCircle, Wallet } from 'lucide-react';

export default function OutstandingPage() {
  const totalOutstanding = mockOutstanding.reduce((s, r) => s + r.currentOutstanding, 0);
  const paidCount = mockOutstanding.filter((r) => r.status === 'Paid').length;
  const outstandingCount = mockOutstanding.filter((r) => r.status === 'Outstanding').length;

  const columns = [
    { header: 'Dealer', accessor: 'dealer', sortable: true, key: 'dealer' },
    { header: 'Route', accessor: 'route', key: 'route' },
    { header: 'Prev. Outstanding', key: 'prev', render: (r) => <span className="tabular-nums">{formatCurrency(r.previousOutstanding)}</span> },
    { header: 'Credit Sales', key: 'cs', render: (r) => <span className="tabular-nums">{formatCurrency(r.creditSales)}</span> },
    { header: 'Collections', key: 'col', render: (r) => <span className="tabular-nums text-green-700">{formatCurrency(r.collections)}</span> },
    { header: 'Adjustments', key: 'adj', render: (r) => <span className="tabular-nums text-gray-500">{formatCurrency(r.adjustments)}</span> },
    {
      header: 'Current Outstanding', key: 'curr', sortable: true, accessor: 'currentOutstanding',
      render: (r) => (
        <span className={`font-bold tabular-nums ${r.currentOutstanding > 0 ? 'text-red-600' : 'text-green-700'}`}>
          {formatCurrency(r.currentOutstanding)}
        </span>
      )
    },
    { header: 'Status', key: 'status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Outstanding"
        breadcrumbs={['Collections', 'Outstanding']}
        description="Dealer-wise outstanding balance tracker"
      />

      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatCard title="Total Outstanding" value={formatCurrency(totalOutstanding)} icon={AlertCircle} color="red" />
        <StatCard title="Outstanding Dealers" value={outstandingCount} icon={Wallet} color="amber" />
        <StatCard title="Fully Paid" value={paidCount} icon={CheckCircle} color="green" />
      </div>

      <DataTable
        columns={columns}
        data={mockOutstanding}
        searchKeys={['dealer', 'route', 'status']}
        searchPlaceholder="Search outstanding…"
        exportFilename="outstanding"
      />
    </div>
  );
}
