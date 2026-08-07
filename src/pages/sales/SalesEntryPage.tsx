// Sales Entry Page
import React, { useState } from 'react';
import { Plus, Eye } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import PageHeader from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { SelectInput, QuantityInput, FormInput } from '../../components/ui/FormInputs';
import { mockSales, mockSalespersons } from '../../mock';
import { formatDate, formatCurrency, todayISO } from '../../utils';
import { useToast } from '../../hooks/useToast';
import type { Sale, SaleType, GeneralStatus } from '../../types';
import type { TableColumn } from '../../types';

interface SaleForm {
  date: string;
  customer: string;
  salespersonId: string;
  soldQty: string;
  freeQty: string;
  returnQty: string;
  unitPrice: string;
  discount: string;
  saleType: string;
}

type FormErrors = Partial<Record<keyof SaleForm, string>>;

const EMPTY_FORM: SaleForm = {
  date: todayISO(), customer: '', salespersonId: '', soldQty: '',
  freeQty: '', returnQty: '', unitPrice: '', discount: '', saleType: 'Cash',
};

export default function SalesEntryPage() {
  const toast = useToast();
  const [sales, setSales]         = useState<Sale[]>(mockSales);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewItem, setViewItem]   = useState<Sale | null>(null);
  const [form, setForm]           = useState<SaleForm>(EMPTY_FORM);
  const [errors, setErrors]       = useState<FormErrors>({});

  const setField = (k: keyof SaleForm, v: string) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: '' })); };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.salespersonId)                      e.salespersonId = 'Select salesperson';
    if (!form.soldQty || Number(form.soldQty) < 0) e.soldQty      = 'Enter sold quantity';
    if (!form.unitPrice || Number(form.unitPrice) <= 0) e.unitPrice = 'Enter unit price';
    return e;
  };

  const handleSave = (addNew = false) => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const sp     = mockSalespersons.find((s) => s.id === form.salespersonId);
    const sold   = Number(form.soldQty);
    const price  = Number(form.unitPrice);
    const disc   = Number(form.discount) || 0;
    const amount = sold * price - disc;
    const row: Sale = {
      id:          `INV-2024-${String(sales.length + 455).padStart(4, '0')}`,
      date:        form.date,
      customer:    form.customer.trim() || undefined,
      route:       sp?.routes[0] ?? 'R01',
      salesperson: sp?.name ?? '',
      soldQty:     sold,
      freeQty:     Number(form.freeQty) || 0,
      returnQty:   Number(form.returnQty) || 0,
      amount,
      discount:    disc,
      saleType:    form.saleType as SaleType,
      status:      'Confirmed' as GeneralStatus,
    };
    setSales((s) => [row, ...s]);
    toast('Sale recorded successfully', 'success');
    if (addNew) { setForm(EMPTY_FORM); setErrors({}); }
    else setModalOpen(false);
  };

  const columns: TableColumn<Sale>[] = [
    { header: 'Invoice',     accessor: 'id',          sortable: true, key: 'id' },
    { header: 'Date',        key: 'date',             render: (r) => formatDate(r.date) },
    { header: 'Salesperson', accessor: 'salesperson', sortable: true, key: 'sp' },
    { header: 'Customer',    key: 'customer',         render: (r) => r.customer ? <span className="font-medium text-gray-800">{r.customer}</span> : <span className="text-gray-400 italic">Direct Cash Sale</span> },
    { header: 'Route',       accessor: 'route',       key: 'route' },
    { header: 'Sold',        accessor: 'soldQty',     sortable: true, key: 'sold', render: (r) => <span className="tabular-nums">{r.soldQty}</span> },
    { header: 'Free',        key: 'free',             render: (r) => <span className="tabular-nums text-gray-500">{r.freeQty}</span> },
    { header: 'Return',      key: 'ret',              render: (r) => <span className="tabular-nums text-gray-500">{r.returnQty}</span> },
    { header: 'Amount',      accessor: 'amount',      sortable: true, key: 'amt',  render: (r) => <span className="font-semibold tabular-nums">{formatCurrency(r.amount)}</span> },
    { header: 'Type',        key: 'type',             render: (r) => (
      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${r.saleType === 'Cash' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>{r.saleType}</span>
    )},
    { header: 'Status',      key: 'status',           render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Sales Entry"
        breadcrumbs={['Sales', 'Entry']}
        description="Record direct salesperson customer sales"
        actions={<button onClick={() => { setForm(EMPTY_FORM); setErrors({}); setModalOpen(true); }} className="btn-primary gap-1.5"><Plus className="w-4 h-4" /> New Sale</button>}
      />

      <DataTable<Sale>
        columns={columns}
        data={sales}
        searchKeys={['id', 'salesperson', 'customer', 'route', 'saleType', 'status']}
        searchPlaceholder="Search sales…"
        exportFilename="sales"
        actions={(row) => <button onClick={() => setViewItem(row)} className="btn-ghost btn-sm p-1.5"><Eye className="w-3.5 h-3.5" /></button>}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Sale Entry" size="lg"
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
          <FormInput label="Customer Name (Optional for Credit)" id="customer" value={form.customer} onChange={(e) => setField('customer', e.target.value)} placeholder="Required for Credit Sale" />
          <QuantityInput label="Sold Quantity"   id="soldQty" required value={form.soldQty}   onChange={(e) => setField('soldQty', e.target.value)}   error={errors.soldQty} />
          <QuantityInput label="Free Quantity"   id="freeQty"          value={form.freeQty}   onChange={(e) => setField('freeQty', e.target.value)} />
          <QuantityInput label="Return Quantity" id="retQty"           value={form.returnQty} onChange={(e) => setField('returnQty', e.target.value)} />
          <FormInput     label="Unit Price (₹)"  id="price"  type="number" required min="0" step="0.01" value={form.unitPrice} onChange={(e) => setField('unitPrice', e.target.value)} error={errors.unitPrice} />
          <FormInput     label="Discount (₹)"    id="disc"   type="number" min="0" step="0.01"           value={form.discount}  onChange={(e) => setField('discount', e.target.value)} />
          <SelectInput   label="Sale Type"        id="saleType" value={form.saleType} onChange={(e) => setField('saleType', e.target.value)}>
            <option value="Cash">Cash</option>
            <option value="Credit">Credit</option>
          </SelectInput>
        </div>
        {form.soldQty && form.unitPrice && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-xs text-blue-700">Calculated Amount</span>
            <span className="font-bold text-blue-800">{formatCurrency(Number(form.soldQty) * Number(form.unitPrice) - (Number(form.discount) || 0))}</span>
          </div>
        )}
      </Modal>

      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="Invoice Details" size="sm">
        {viewItem && (
          <dl className="space-y-2">
            {([
              ['Invoice',     viewItem.id],
              ['Date',        formatDate(viewItem.date)],
              ['Salesperson', viewItem.salesperson],
              ['Customer',    viewItem.customer || 'Direct Cash Sale'],
              ['Sold Qty',    viewItem.soldQty],
              ['Free Qty',    viewItem.freeQty],
              ['Return Qty',  viewItem.returnQty],
              ['Amount',      formatCurrency(viewItem.amount)],
              ['Discount',    formatCurrency(viewItem.discount)],
              ['Sale Type',   viewItem.saleType],
              ['Status',      <StatusBadge key="st" status={viewItem.status} />],
            ] as [string, React.ReactNode][]).map(([k, v]) => (
              <div key={k} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                <dt className="text-xs text-gray-500">{k}</dt>
                <dd className="text-xs font-medium text-gray-900">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>
    </div>
  );
}
