// Audit Log Page
import React from 'react';
import DataTable from '../../components/ui/DataTable';
import PageHeader from '../../components/ui/PageHeader';
import { mockAuditLog } from '../../mock';
import { formatDateTime } from '../../utils';
import type { AuditLog } from '../../types';
import type { TableColumn } from '../../types';

const ACTION_COLORS: Record<string, string> = {
  CREATE:  'bg-green-50 text-green-700',
  UPDATE:  'bg-blue-50 text-blue-700',
  DELETE:  'bg-red-50 text-red-700',
  APPROVE: 'bg-purple-50 text-purple-700',
  LOGIN:   'bg-gray-100 text-gray-600',
};

export default function AuditLogPage() {
  const columns: TableColumn<AuditLog>[] = [
    { header: 'Timestamp',   key: 'ts',       render: (r) => <span className="tabular-nums text-xs">{formatDateTime(r.timestamp)}</span> },
    { header: 'User',        accessor: 'user', sortable: true, key: 'user' },
    { header: 'Action',      key: 'action',   render: (r) => <span className={`text-xs px-2 py-0.5 rounded font-semibold ${ACTION_COLORS[r.action] || 'bg-gray-100 text-gray-600'}`}>{r.action}</span> },
    { header: 'Module',      accessor: 'module', key: 'module' },
    { header: 'Reference',   accessor: 'reference', key: 'ref' },
    { header: 'Description', key: 'desc',     render: (r) => <span className="text-gray-600 text-xs">{r.description}</span> },
    { header: 'IP Address',  accessor: 'ipAddress', key: 'ip', render: (r) => <span className="font-mono text-xs text-gray-500">{r.ipAddress}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Audit Log"
        breadcrumbs={['Administration', 'Audit Log']}
        description="Complete record of all system actions"
      />
      <DataTable<AuditLog>
        columns={columns}
        data={mockAuditLog}
        searchKeys={['user', 'action', 'module', 'reference', 'description']}
        searchPlaceholder="Search audit log…"
        exportFilename="audit-log"
      />
    </div>
  );
}
