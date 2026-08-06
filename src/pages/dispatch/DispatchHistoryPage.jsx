// Dispatch History Page
import React from 'react';
import { Eye, Truck } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import PageHeader from '../../components/ui/PageHeader';
import { mockDispatches } from '../../mock';
import { formatDate, formatNumber } from '../../utils';
import { Link } from 'react-router-dom';

export default function DispatchHistoryPage() {
  const columns = [
    { header: 'Dispatch ID', accessor: 'id', sortable: true, key: 'id' },
    { header: 'Date', key: 'date', render: (r) => formatDate(r.date), sortable: true, accessor: 'date' },
    { header: 'Session', accessor: 'session', key: 'session' },
    { header: 'Salesperson', accessor: 'salesperson', sortable: true, key: 'sp' },
    { header: 'Route', accessor: 'route', key: 'route' },
    { header: 'Vehicle', accessor: 'vehicle', key: 'vehicle' },
    {
      header: 'Items', key: 'items',
      render: (r) => <span className="text-gray-600">{r.items.length} product{r.items.length > 1 ? 's' : ''}</span>
    },
    {
      header: 'Total Qty', accessor: 'totalQty', sortable: true, key: 'qty',
      render: (r) => <span className="font-semibold tabular-nums">{formatNumber(r.totalQty)}</span>
    },
    { header: 'Status', key: 'status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Dispatch History"
        breadcrumbs={['Dispatch', 'History']}
        description="All dispatch records with status tracking"
        actions={
          <Link to="/dispatch/new" className="btn-primary gap-1.5">
            <Truck className="w-4 h-4" /> New Dispatch
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={mockDispatches}
        searchKeys={['id', 'salesperson', 'route', 'vehicle', 'session', 'status']}
        searchPlaceholder="Search dispatches…"
        exportFilename="dispatch-history"
        actions={(row) => (
          <button className="btn-ghost btn-sm p-1.5" title="View details"><Eye className="w-3.5 h-3.5" /></button>
        )}
      />
    </div>
  );
}
