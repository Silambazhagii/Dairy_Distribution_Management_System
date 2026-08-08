// Sales Returns Page
import { useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import PageHeader from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { SelectInput, QuantityInput, TextareaInput } from '../../components/ui/FormInputs';
import { mockSales } from '../../mock';
import { formatDate, todayISO } from '../../utils';
import { useToast } from '../../hooks/useToast';
import type { TableColumn } from '../../types';

interface ReturnRecord {
  id: string;
  date: string;
  invoiceId: string;
  salesperson: string;
  qty: number;
  reason: string;
  status: string;
  action: string;
}

interface ReturnForm {
  invoiceId: string;
  qty: string;
  reason: string;
  notes: string;
}

type FormErrors = Partial<Record<keyof ReturnForm, string>>;

const RETURN_REASONS = ['Expired', 'Damaged', 'Quality issue', 'Wrong product', 'Excess delivery', 'Other'] as const;
const EMPTY_FORM: ReturnForm = { invoiceId: '', qty: '', reason: '', notes: '' };

const mockReturns: ReturnRecord[] = [
  { id: 'RET-001', date: '2026-08-06', invoiceId: 'INV-2024-0451', salesperson: 'Rajesh Kumar', qty: 10, reason: 'Quality issue', status: 'Verified', action: 'Spoiled' },
  { id: 'RET-002', date: '2026-08-05', invoiceId: 'INV-2024-0454', salesperson: 'Murugan S',    qty: 2,  reason: 'Damaged',       status: 'Pending',  action: 'Pending' },
];

export default function ReturnsPage() {
  const toast = useToast();
  const [returns, setReturns]     = useState<ReturnRecord[]>(mockReturns);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]           = useState<ReturnForm>(EMPTY_FORM);
  const [errors, setErrors]       = useState<FormErrors>({});

  const setField = (k: keyof ReturnForm, v: string) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: '' })); };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.invoiceId)                          e.invoiceId = 'Select invoice';
    if (!form.qty || Number(form.qty) <= 0)       e.qty       = 'Enter quantity';
    if (!form.reason)                             e.reason    = 'Select reason';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const invoice = mockSales.find((s) => s.id === form.invoiceId);
    const row: ReturnRecord = {
      id:          `RET-${String(returns.length + 3).padStart(3, '0')}`,
      date:        todayISO(),
      invoiceId:   form.invoiceId,
      salesperson: invoice?.salesperson || '',
      qty:         Number(form.qty),
      reason:      form.reason,
      status:      'Pending',
      action:      'Pending',
    };
    setReturns((r) => [row, ...r]);
    toast('Return recorded successfully', 'success');
    setModalOpen(false);
    setForm(EMPTY_FORM);
  };

  const columns: TableColumn<ReturnRecord>[] = [
    { header: 'Return ID',    accessor: 'id',          sortable: true, key: 'id' },
    { header: 'Date',         key: 'date',              render: (r) => formatDate(r.date) },
    { header: 'Invoice',      accessor: 'invoiceId',   key: 'inv' },
    { header: 'Salesperson',  accessor: 'salesperson', sortable: true, key: 'sp' },
    { header: 'Qty',          accessor: 'qty',         sortable: true, key: 'qty', render: (r) => <span className="font-semibold tabular-nums">{r.qty}</span> },
    { header: 'Reason',       accessor: 'reason',      key: 'reason' },
    { header: 'Status',       key: 'status',            render: (r) => <StatusBadge status={r.status} /> },
    { header: 'Stock Action', key: 'action',            render: (r) => <StatusBadge status={r.action} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Sales Returns"
        breadcrumbs={['Sales', 'Returns']}
        description="Damaged, excess or quality-rejected returns"
        actions={<button onClick={() => { setForm(EMPTY_FORM); setErrors({}); setModalOpen(true); }} className="btn-primary gap-1.5"><Plus className="w-4 h-4" /> Record Return</button>}
      />

      <DataTable<ReturnRecord>
        columns={columns}
        data={returns}
        searchKeys={['id', 'invoiceId', 'salesperson', 'reason', 'status']}
        searchPlaceholder="Search returns…"
        exportFilename="returns"
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Record Return"
        footer={<><button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button onClick={handleSave} className="btn-primary">Save Return</button></>}
      >
        <div className="space-y-4">
          <SelectInput label="Invoice" id="invoice" required value={form.invoiceId} onChange={(e) => setField('invoiceId', e.target.value)} error={errors.invoiceId} placeholder="Select invoice">
            {mockSales.map((s) => <option key={s.id} value={s.id}>{s.id} – {s.salesperson}</option>)}
          </SelectInput>
          <QuantityInput label="Return Quantity" id="qty" required value={form.qty} onChange={(e) => setField('qty', e.target.value)} error={errors.qty} />
          <SelectInput label="Return Reason" id="reason" required value={form.reason} onChange={(e) => setField('reason', e.target.value)} error={errors.reason} placeholder="Select reason">
            {RETURN_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </SelectInput>
          <TextareaInput label="Notes" id="notes" value={form.notes} onChange={(e) => setField('notes', e.target.value)} placeholder="Optional notes…" />
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            ⚠️ Returned items will NOT be added back to usable stock. They will be marked for spoilage review.
          </div>
        </div>
      </Modal>
    </div>
  );
}
