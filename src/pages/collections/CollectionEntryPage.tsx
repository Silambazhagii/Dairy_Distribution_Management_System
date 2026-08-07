// Collection Entry Page
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import PageHeader from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { SelectInput, FormInput } from '../../components/ui/FormInputs';
import { mockCollections, mockSalespersons } from '../../mock';
import { formatDate, formatCurrency, todayISO } from '../../utils';
import { PAYMENT_MODES } from '../../constants';
import { useToast } from '../../hooks/useToast';
import type { Collection, CollectionStatus, PaymentMode } from '../../types';
import type { TableColumn } from '../../types';

interface CollectionForm {
  date: string;
  customer: string;
  salespersonId: string;
  amount: string;
  mode: string;
  reference: string;
}

type FormErrors = Partial<Record<keyof CollectionForm, string>>;

const EMPTY_FORM: CollectionForm = { date: todayISO(), customer: '', salespersonId: '', amount: '', mode: 'Cash', reference: '' };

export default function CollectionEntryPage() {
  const toast = useToast();
  const [collections, setCollections] = useState<Collection[]>(mockCollections);
  const [modalOpen, setModalOpen]     = useState(false);
  const [form, setForm]               = useState<CollectionForm>(EMPTY_FORM);
  const [errors, setErrors]           = useState<FormErrors>({});

  const setField = (k: keyof CollectionForm, v: string) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: '' })); };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.salespersonId)                         e.salespersonId = 'Select salesperson';
    if (!form.amount || Number(form.amount) <= 0)    e.amount        = 'Enter valid amount';
    if (form.mode === 'Cheque' && !form.reference)   e.reference     = 'Enter cheque number';
    if (form.mode === 'UPI'    && !form.reference)   e.reference     = 'Enter UPI reference';
    return e;
  };

  const handleSave = (addNew = false) => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const sp = mockSalespersons.find((s) => s.id === form.salespersonId);
    const row: Collection = {
      id:          `COL-2024-${String(collections.length + 206).padStart(4, '0')}`,
      date:        form.date,
      customer:    form.customer.trim() || undefined,
      route:       sp?.routes[0] ?? 'R01',
      salesperson: sp?.name ?? '',
      amount:      Number(form.amount),
      mode:        form.mode as PaymentMode,
      reference:   form.reference,
      status:      'Pending' as CollectionStatus,
    };
    setCollections((c) => [row, ...c]);
    toast('Collection recorded successfully', 'success');
    if (addNew) { setForm(EMPTY_FORM); setErrors({}); }
    else setModalOpen(false);
  };

  const columns: TableColumn<Collection>[] = [
    { header: 'Collection ID', accessor: 'id',          sortable: true, key: 'id' },
    { header: 'Date',          key: 'date',              render: (r) => formatDate(r.date) },
    { header: 'Salesperson',   accessor: 'salesperson',  sortable: true, key: 'sp' },
    { header: 'Customer',      key: 'customer',          render: (r) => r.customer ? <span className="font-medium text-gray-800">{r.customer}</span> : <span className="text-gray-400 italic">Direct Collection</span> },
    { header: 'Route',         accessor: 'route',        key: 'route' },
    { header: 'Amount',        accessor: 'amount',       sortable: true, key: 'amt',  render: (r) => <span className="font-semibold tabular-nums">{formatCurrency(r.amount)}</span> },
    { header: 'Mode',          key: 'mode',              render: (r) => <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded font-medium">{r.mode}</span> },
    { header: 'Reference',     key: 'ref',               render: (r) => r.reference || <span className="text-gray-300">—</span> },
    { header: 'Status',        key: 'status',            render: (r) => <StatusBadge status={r.status} /> },
  ];

  const totalCollected = collections.reduce((s, c) => s + c.amount, 0);
  const pendingCount   = collections.filter((c) => c.status === 'Pending').length;

  return (
    <div>
      <PageHeader
        title="Collection Entry"
        breadcrumbs={['Collections', 'Entry']}
        description="Record daily cash, UPI, and credit collections by salesperson"
        actions={<button onClick={() => { setForm(EMPTY_FORM); setErrors({}); setModalOpen(true); }} className="btn-primary gap-1.5"><Plus className="w-4 h-4" /> New Collection</button>}
      />

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="card p-4"><p className="text-xs text-gray-500">Total Collected</p><p className="text-xl font-bold text-green-700 mt-1">{formatCurrency(totalCollected)}</p></div>
        <div className="card p-4"><p className="text-xs text-gray-500">Pending Verification</p><p className="text-xl font-bold text-amber-700 mt-1">{pendingCount}</p></div>
        <div className="card p-4"><p className="text-xs text-gray-500">Entries</p><p className="text-xl font-bold text-gray-800 mt-1">{collections.length}</p></div>
      </div>

      <DataTable<Collection>
        columns={columns}
        data={collections}
        searchKeys={['id', 'salesperson', 'customer', 'mode', 'reference', 'status']}
        searchPlaceholder="Search collections…"
        exportFilename="collections"
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Collection Entry" size="md"
        footer={<>
          <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
          <button onClick={() => handleSave(true)} className="btn-secondary">Save &amp; New</button>
          <button onClick={() => handleSave(false)} className="btn-primary">Save</button>
        </>}
      >
        <div className="grid grid-cols-2 gap-4">
          <SelectInput label="Salesperson" id="sp" required value={form.salespersonId} onChange={(e) => setField('salespersonId', e.target.value)} error={errors.salespersonId} placeholder="Select salesperson">
            {mockSalespersons.filter((s) => s.status === 'Active').map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </SelectInput>
          <FormInput label="Customer Name (Optional)" id="customer" value={form.customer} onChange={(e) => setField('customer', e.target.value)} placeholder="Credit customer name if applicable" />
          <FormInput label="Amount (₹)" id="amount" type="number" min="0" step="0.01" required value={form.amount} onChange={(e) => setField('amount', e.target.value)} error={errors.amount} />
          <SelectInput label="Payment Mode" id="mode" value={form.mode} onChange={(e) => setField('mode', e.target.value)}>
            {Object.values(PAYMENT_MODES).filter((m) => m !== 'Credit').map((m) => <option key={m} value={m}>{m}</option>)}
          </SelectInput>
          <FormInput label="Reference No." id="ref" value={form.reference} onChange={(e) => setField('reference', e.target.value)} error={errors.reference} placeholder="UPI ID / Cheque no." className="col-span-2" />
        </div>
      </Modal>
    </div>
  );
}
