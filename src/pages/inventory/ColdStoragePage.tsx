// Cold Storage Stock Page
import React from 'react';
import { Thermometer, Package, AlertTriangle } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import { mockBatches } from '../../mock';
import { formatDate, formatNumber } from '../../utils';
import type { Batch } from '../../types';
import type { TableColumn } from '../../types';

export default function ColdStoragePage() {
  const active         = mockBatches.filter((b) => b.status === 'Active');
  const expired        = mockBatches.filter((b) => b.status === 'Expired');
  const lowStock       = active.filter((b) => b.availableQty < 200);
  const totalAvailable = active.reduce((sum, b) => sum + b.availableQty, 0);

  const columns: TableColumn<Batch>[] = [
    { header: 'Batch No.',    accessor: 'id',               sortable: true, key: 'id' },
    { header: 'Product',      accessor: 'product',          sortable: true, key: 'product' },
    { header: 'Session',      accessor: 'session',          key: 'session' },
    { header: 'Production',   key: 'prod',                  render: (r) => formatDate(r.productionDate) },
    { header: 'Expiry',       key: 'exp',                   render: (r) => (
      <span className={r.status === 'Expired' ? 'text-red-600 font-medium' : ''}>{formatDate(r.expiryDate)}</span>
    )},
    { header: 'Qty Received', accessor: 'quantityReceived', sortable: true, key: 'qtyR', render: (r) => <span className="tabular-nums">{formatNumber(r.quantityReceived)}</span> },
    { header: 'Available',    accessor: 'availableQty',     sortable: true, key: 'avail', render: (r) => (
      <span className={`font-semibold tabular-nums ${r.availableQty === 0 ? 'text-gray-400' : r.availableQty < 200 ? 'text-red-600' : 'text-green-700'}`}>
        {formatNumber(r.availableQty)}
      </span>
    )},
    { header: 'Dispatched', key: 'disp', render: (r) => (
      <span className="tabular-nums text-gray-600">{formatNumber(r.quantityReceived - r.availableQty)}</span>
    )},
    { header: 'Utilization', key: 'util', render: (r) => {
      const pct = r.quantityReceived > 0 ? Math.round(((r.quantityReceived - r.availableQty) / r.quantityReceived) * 100) : 0;
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs tabular-nums">{pct}%</span>
        </div>
      );
    }},
    { header: 'Status', key: 'status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Cold Storage Stock"
        breadcrumbs={['Inventory', 'Cold Storage Stock']}
        description="Current batch-wise stock in cold storage"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard title="Total Available Units" value={formatNumber(totalAvailable)} icon={Package}       color="blue" />
        <StatCard title="Active Batches"        value={active.length}               icon={Thermometer}    color="teal" />
        <StatCard title="Low Stock Batches"     value={lowStock.length}             icon={AlertTriangle}  color="amber" />
        <StatCard title="Expired Batches"       value={expired.length}              icon={AlertTriangle}  color="red" />
      </div>

      <DataTable<Batch>
        columns={columns}
        data={mockBatches}
        searchKeys={['id', 'product', 'session', 'status']}
        searchPlaceholder="Search batches…"
        exportFilename="cold-storage-stock"
      />
    </div>
  );
}
