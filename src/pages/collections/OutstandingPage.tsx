// Outstanding Page

import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import { mockOutstanding } from '../../mock';
import { formatCurrency } from '../../utils';
import { AlertCircle, CheckCircle, Wallet } from 'lucide-react';
import type { Outstanding } from '../../types';
import type { TableColumn } from '../../types';

export default function OutstandingPage() {
  const totalOutstanding = mockOutstanding.reduce((s, r) => s + r.currentOutstanding, 0);
  const paidCount        = mockOutstanding.filter((r) => r.status === 'Paid').length;
  const outstandingCount = mockOutstanding.filter((r) => r.status === 'Outstanding').length;

  const columns: TableColumn<Outstanding>[] = [
    { header: 'Salesperson',          accessor: 'salesperson',        sortable: true, key: 'sp' },
    { header: 'Route',                accessor: 'route',              key: 'route' },
    { header: 'Prev. Outstanding',    key: 'prev',                    render: (r) => <span className="tabular-nums">{formatCurrency(r.previousOutstanding)}</span> },
    { header: 'Credit Sales',         key: 'cs',                      render: (r) => <span className="tabular-nums">{formatCurrency(r.creditSales)}</span> },
    { header: 'Collections',          key: 'col',                     render: (r) => <span className="tabular-nums text-green-700">{formatCurrency(r.collections)}</span> },
    { header: 'Adjustments',          key: 'adj',                     render: (r) => <span className="tabular-nums text-gray-500">{formatCurrency(r.adjustments)}</span> },
    { header: 'Current Outstanding',  accessor: 'currentOutstanding', sortable: true, key: 'curr', render: (r) => (
      <span className={`font-bold tabular-nums ${r.currentOutstanding > 0 ? 'text-red-600' : 'text-green-700'}`}>
        {formatCurrency(r.currentOutstanding)}
      </span>
    )},
    { header: 'Status', key: 'status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Credit Outstanding"
        breadcrumbs={['Collections', 'Outstanding']}
        description="Salesperson-wise credit outstanding balance tracker"
      />

      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatCard title="Total Outstanding"      value={formatCurrency(totalOutstanding)} icon={AlertCircle}  color="red" />
        <StatCard title="Salespersons Pending"   value={outstandingCount}                icon={Wallet}        color="amber" />
        <StatCard title="Fully Settled"          value={paidCount}                       icon={CheckCircle}   color="green" />
      </div>

      <DataTable<Outstanding>
        columns={columns}
        data={mockOutstanding}
        searchKeys={['salesperson', 'route', 'status']}
        searchPlaceholder="Search outstanding…"
        exportFilename="outstanding"
      />
    </div>
  );
}
