// Batch / Inward Entry Page
import React, { useState } from 'react';
import { Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import PageHeader from '../../components/ui/PageHeader';
import { Modal, ConfirmDialog } from '../../components/ui/Modal';
import { FormInput, SelectInput, DateInput, QuantityInput } from '../../components/ui/FormInputs';
import { mockBatches } from '../../mock';
import { PRODUCTS, SESSIONS, BATCH_STATUS } from '../../constants';
import { formatDate, todayISO } from '../../utils';
import { useToast } from '../../hooks/useToast';

const EMPTY_FORM = {
  batchNumber: '', productId: '', session: SESSIONS.MORNING,
  productionDate: todayISO(), expiryDate: '', quantityReceived: '',
};

export default function BatchEntryPage() {
  const toast = useToast();
  const [batches, setBatches] = useState(mockBatches);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const openAdd = () => { setEditItem(null); setForm(EMPTY_FORM); setErrors({}); setModalOpen(true); };
  const openEdit = (row) => { setEditItem(row); setForm({ ...row, productId: row.productId }); setErrors({}); setModalOpen(true); };

  const validate = () => {
    const e = {};
    if (!form.batchNumber.trim()) e.batchNumber = 'Batch number is required';
    if (!form.productId) e.productId = 'Product is required';
    if (!form.productionDate) e.productionDate = 'Production date is required';
    if (!form.expiryDate) e.expiryDate = 'Expiry date is required';
    if (form.expiryDate && form.productionDate && form.expiryDate <= form.productionDate) e.expiryDate = 'Expiry must be after production date';
    if (!form.quantityReceived || Number(form.quantityReceived) <= 0) e.quantityReceived = 'Enter a valid quantity';
    return e;
  };

  const handleSave = (addNew = false) => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const product = PRODUCTS.find((p) => p.id === form.productId);
    const row = {
      ...form,
      id: editItem ? editItem.id : `B${Date.now()}`,
      product: product?.name || form.productId,
      quantityReceived: Number(form.quantityReceived),
      availableQty: editItem ? editItem.availableQty : Number(form.quantityReceived),
      status: BATCH_STATUS.ACTIVE,
    };
    if (editItem) {
      setBatches((b) => b.map((x) => (x.id === editItem.id ? row : x)));
      toast('Batch updated successfully', 'success');
    } else {
      setBatches((b) => [row, ...b]);
      toast('Batch added successfully', 'success');
    }
    if (addNew) { setForm(EMPTY_FORM); setErrors({}); setEditItem(null); }
    else setModalOpen(false);
  };

  const handleDelete = () => {
    setBatches((b) => b.filter((x) => x.id !== deleteItem.id));
    toast('Batch removed', 'success');
    setDeleteItem(null);
  };

  const columns = [
    { header: 'Batch No.', accessor: 'id', sortable: true, key: 'id' },
    { header: 'Product', accessor: 'product', sortable: true, key: 'product' },
    { header: 'Session', accessor: 'session', key: 'session', render: (r) => <span className="text-xs">{r.session}</span> },
    { header: 'Prod. Date', key: 'prodDate', render: (r) => formatDate(r.productionDate) },
    { header: 'Expiry Date', key: 'expDate', render: (r) => formatDate(r.expiryDate) },
    { header: 'Qty Received', accessor: 'quantityReceived', sortable: true, key: 'qtyRec', render: (r) => <span className="font-medium tabular-nums">{r.quantityReceived}</span> },
    { header: 'Available', accessor: 'availableQty', sortable: true, key: 'avail', render: (r) => <span className={`font-semibold tabular-nums ${r.availableQty < 200 ? 'text-red-600' : 'text-green-700'}`}>{r.availableQty}</span> },
    { header: 'Status', key: 'status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  const setField = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: '' })); };

  return (
    <div>
      <PageHeader
        title="Batch / Inward Entry"
        breadcrumbs={['Inventory', 'Batch Entry']}
        description="Record inward batches from production into cold storage"
        actions={
          <button onClick={openAdd} className="btn-primary gap-1.5">
            <Plus className="w-4 h-4" /> Add Batch
          </button>
        }
      />

      <DataTable
        columns={columns}
        data={batches}
        searchKeys={['id', 'product', 'session']}
        searchPlaceholder="Search batches…"
        exportFilename="batch-entry"
        actions={(row) => (
          <>
            <button onClick={() => setViewItem(row)} className="btn-ghost btn-sm p-1.5" title="View"><Eye className="w-3.5 h-3.5" /></button>
            <button onClick={() => openEdit(row)} className="btn-ghost btn-sm p-1.5" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
            <button onClick={() => setDeleteItem(row)} className="btn-ghost btn-sm p-1.5 text-red-500 hover:text-red-700" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
          </>
        )}
      />

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Batch' : 'Add Batch'}
        size="md"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            {!editItem && <button onClick={() => handleSave(true)} className="btn-secondary">Save & New</button>}
            <button onClick={() => handleSave(false)} className="btn-primary">{editItem ? 'Update' : 'Save'}</button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Batch Number" id="batchNo" required value={form.batchNumber} onChange={(e) => setField('batchNumber', e.target.value)} error={errors.batchNumber} placeholder="e.g. B2024-009" />
          <SelectInput label="Product" id="product" required value={form.productId} onChange={(e) => setField('productId', e.target.value)} error={errors.productId} placeholder="Select product">
            {PRODUCTS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </SelectInput>
          <SelectInput label="Session" id="session" value={form.session} onChange={(e) => setField('session', e.target.value)}>
            <option value={SESSIONS.MORNING}>Morning</option>
            <option value={SESSIONS.EVENING}>Evening</option>
          </SelectInput>
          <QuantityInput label="Quantity Received" id="qty" required value={form.quantityReceived} onChange={(e) => setField('quantityReceived', e.target.value)} error={errors.quantityReceived} placeholder="0" />
          <DateInput label="Production Date" id="prodDate" required value={form.productionDate} onChange={(e) => setField('productionDate', e.target.value)} error={errors.productionDate} />
          <DateInput label="Expiry Date" id="expiryDate" required value={form.expiryDate} onChange={(e) => setField('expiryDate', e.target.value)} error={errors.expiryDate} />
        </div>
      </Modal>

      {/* View Modal */}
      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="Batch Details" size="sm">
        {viewItem && (
          <dl className="space-y-2">
            {[
              ['Batch No.', viewItem.id],
              ['Product', viewItem.product],
              ['Session', viewItem.session],
              ['Production Date', formatDate(viewItem.productionDate)],
              ['Expiry Date', formatDate(viewItem.expiryDate)],
              ['Qty Received', viewItem.quantityReceived],
              ['Available Qty', viewItem.availableQty],
              ['Status', <StatusBadge key="st" status={viewItem.status} />],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                <dt className="text-xs text-gray-500">{k}</dt>
                <dd className="text-xs font-medium text-gray-900">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Remove Batch"
        message={`Remove batch ${deleteItem?.id}? This action cannot be undone.`}
        confirmLabel="Remove"
        danger
      />
    </div>
  );
}
