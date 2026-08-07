// Spoilage Management Page
import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import PageHeader from '../../components/ui/PageHeader';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { SelectInput, QuantityInput } from '../../components/ui/FormInputs';
import { mockSpoilage, mockBatches } from '../../mock';
import { formatDate, formatNumber, todayISO } from '../../utils';
import { useToast } from '../../hooks/useToast';
import type { SpoilageRecord, CollectionStatus } from '../../types';
import type { TableColumn } from '../../types';

interface SpoilageForm {
  batchId: string;
  qty: string;
  reason: string;
}

interface FormErrors {
  batchId?: string;
  qty?: string;
  reason?: string;
}

const EMPTY_FORM: SpoilageForm = { batchId: '', qty: '', reason: '' };
const REASONS = ['Leaking packets', 'Damaged in transit', 'Expired', 'Torn packaging', 'Cold chain failure', 'Other'] as const;

export default function SpoilagePage() {
  const toast = useToast();
  const [records, setRecords]       = useState<SpoilageRecord[]>(mockSpoilage);
  const [modalOpen, setModalOpen]   = useState(false);
  const [approveItem, setApproveItem] = useState<SpoilageRecord | null>(null);
  const [form, setForm]             = useState<SpoilageForm>(EMPTY_FORM);
  const [errors, setErrors]         = useState<FormErrors>({});

  const activeBatches = mockBatches.filter((b) => b.status === 'Active');

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.batchId)                       e.batchId = 'Select a batch';
    if (!form.qty || Number(form.qty) <= 0)  e.qty     = 'Enter valid quantity';
    if (!form.reason)                        e.reason  = 'Select a reason';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const batch = activeBatches.find((b) => b.id === form.batchId);
    if (batch && Number(form.qty) > batch.availableQty) {
      setErrors((er) => ({ ...er, qty: `Only ${batch.availableQty} units available` }));
      return;
    }
    const row: SpoilageRecord = {
      id:         `SPO-${String(records.length + 1).padStart(3, '0')}`,
      date:       todayISO(),
      product:    batch?.product || '',
      batchId:    form.batchId,
      qty:        Number(form.qty),
      reason:     form.reason,
      reportedBy: 'Admin User',
      status:     'Pending',
    };
    setRecords((r) => [row, ...r]);
    toast('Spoilage entry recorded', 'success');
    setModalOpen(false);
    setForm(EMPTY_FORM);
  };

  const handleApprove = () => {
    if (!approveItem) return;
    setRecords((r) => r.map((x) => x.id === approveItem.id ? { ...x, status: 'Verified' as CollectionStatus } : x));
    toast('Spoilage entry verified', 'success');
    setApproveItem(null);
  };

  const setField = (k: keyof SpoilageForm, v: string) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: '' })); };

  const totalQty   = records.reduce((s, r) => s + r.qty, 0);
  const pendingQty = records.filter((r) => r.status === 'Pending').reduce((s, r) => s + r.qty, 0);

  const columns: TableColumn<SpoilageRecord>[] = [
    { header: 'ID',          accessor: 'id',         sortable: true, key: 'id' },
    { header: 'Date',        key: 'date',             render: (r) => formatDate(r.date) },
    { header: 'Product',     accessor: 'product',    sortable: true, key: 'product' },
    { header: 'Batch',       accessor: 'batchId',    key: 'batch' },
    { header: 'Qty',         accessor: 'qty',        sortable: true, key: 'qty', render: (r) => <span className="font-semibold text-red-600 tabular-nums">{r.qty}</span> },
    { header: 'Reason',      accessor: 'reason',     key: 'reason' },
    { header: 'Reported By', accessor: 'reportedBy', key: 'rep' },
    { header: 'Status',      key: 'status',          render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Spoilage Management"
        breadcrumbs={['Inventory', 'Spoilage']}
        description="Record and track damaged, expired or spoiled products"
        actions={
          <button onClick={() => { setForm(EMPTY_FORM); setErrors({}); setModalOpen(true); }} className="btn-primary gap-1.5">
            <Plus className="w-4 h-4" /> Report Spoilage
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="card p-4 text-center">
          <p className="text-xs text-gray-500">Total Spoiled</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{formatNumber(totalQty)}</p>
          <p className="text-2xs text-gray-400">units</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xs text-gray-500">Pending Approval</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{formatNumber(pendingQty)}</p>
          <p className="text-2xs text-gray-400">units</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xs text-gray-500">Incidents</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{records.length}</p>
          <p className="text-2xs text-gray-400">total</p>
        </div>
      </div>

      <DataTable<SpoilageRecord>
        columns={columns}
        data={records}
        searchKeys={['id', 'product', 'batchId', 'reason', 'reportedBy']}
        searchPlaceholder="Search spoilage records…"
        exportFilename="spoilage"
        actions={(row) =>
          row.status === 'Pending' ? (
            <button onClick={() => setApproveItem(row)} className="btn-primary btn-sm gap-1">
              <Check className="w-3 h-3" /> Verify
            </button>
          ) : null
        }
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Report Spoilage" size="sm"
        footer={<><button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button onClick={handleSave} className="btn-danger">Record Spoilage</button></>}
      >
        <div className="space-y-4">
          <SelectInput label="Batch" id="batch" required value={form.batchId} onChange={(e) => setField('batchId', e.target.value)} error={errors.batchId} placeholder="Select batch">
            {activeBatches.map((b) => <option key={b.id} value={b.id}>{b.id} – {b.product} ({b.availableQty} avail)</option>)}
          </SelectInput>
          <QuantityInput label="Spoiled Quantity" id="qty" required value={form.qty} onChange={(e) => setField('qty', e.target.value)} error={errors.qty} />
          <SelectInput label="Reason" id="reason" required value={form.reason} onChange={(e) => setField('reason', e.target.value)} error={errors.reason} placeholder="Select reason">
            {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </SelectInput>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!approveItem}
        onClose={() => setApproveItem(null)}
        onConfirm={handleApprove}
        title="Verify Spoilage"
        message={`Verify spoilage of ${approveItem?.qty} units for ${approveItem?.product}?`}
        confirmLabel="Verify"
      />
    </div>
  );
}
