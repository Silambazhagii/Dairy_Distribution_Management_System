// Dealers Master Page
import React, { useState } from 'react';
import { Plus, Edit2, Eye } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import PageHeader from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { FormInput, SelectInput } from '../../components/ui/FormInputs';
import { mockDealers, mockRoutes } from '../../mock';
import { STATUS } from '../../constants';
import { formatCurrency } from '../../utils';
import { useToast } from '../../hooks/useToast';

const EMPTY_FORM = { name: '', route: '', phone: '', creditLimit: '', status: STATUS.ACTIVE };

export default function DealersMasterPage() {
  const toast = useToast();
  const [dealers, setDealers] = useState(mockDealers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const setField = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Enter dealer name';
    if (!form.route) e.route = 'Select route';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = 'Enter valid 10-digit phone';
    if (!form.creditLimit || Number(form.creditLimit) < 0) e.creditLimit = 'Enter valid credit limit';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editItem) {
      setDealers((d) => d.map((x) => x.id === editItem.id ? { ...x, ...form, creditLimit: Number(form.creditLimit) } : x));
      toast('Dealer updated', 'success');
    } else {
      setDealers((d) => [...d, { ...form, id: `D${String(dealers.length + 1).padStart(3, '0')}`, creditLimit: Number(form.creditLimit), outstanding: 0 }]);
      toast('Dealer added', 'success');
    }
    setModalOpen(false);
  };

  const openEdit = (row) => { setEditItem(row); setForm({ name: row.name, route: row.route, phone: row.phone, creditLimit: String(row.creditLimit), status: row.status }); setErrors({}); setModalOpen(true); };
  const openAdd = () => { setEditItem(null); setForm(EMPTY_FORM); setErrors({}); setModalOpen(true); };

  const columns = [
    { header: 'ID', accessor: 'id', key: 'id' },
    { header: 'Dealer Name', accessor: 'name', sortable: true, key: 'name' },
    { header: 'Route', accessor: 'route', key: 'route' },
    { header: 'Phone', accessor: 'phone', key: 'phone' },
    { header: 'Credit Limit', key: 'cl', render: (r) => <span className="tabular-nums">{formatCurrency(r.creditLimit)}</span> },
    {
      header: 'Outstanding', key: 'os', render: (r) => (
        <span className={`tabular-nums font-semibold ${r.outstanding > 0 ? 'text-red-600' : 'text-green-700'}`}>
          {formatCurrency(r.outstanding)}
        </span>
      )
    },
    { header: 'Status', key: 'status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Dealers" breadcrumbs={['Masters', 'Dealers']} description="Manage dealers and their credit terms"
        actions={<button onClick={openAdd} className="btn-primary gap-1.5"><Plus className="w-4 h-4" /> Add Dealer</button>}
      />
      <DataTable columns={columns} data={dealers} searchKeys={['id', 'name', 'route', 'phone', 'status']} searchPlaceholder="Search dealers…" exportFilename="dealers"
        actions={(row) => (
          <button onClick={() => openEdit(row)} className="btn-ghost btn-sm p-1.5"><Edit2 className="w-3.5 h-3.5" /></button>
        )}
      />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Dealer' : 'Add Dealer'} size="sm"
        footer={<><button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button onClick={handleSave} className="btn-primary">Save</button></>}
      >
        <div className="space-y-3">
          <FormInput label="Dealer Name" id="name" required value={form.name} onChange={(e) => setField('name', e.target.value)} error={errors.name} />
          <SelectInput label="Route" id="route" required value={form.route} onChange={(e) => setField('route', e.target.value)} error={errors.route} placeholder="Select route">
            {mockRoutes.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </SelectInput>
          <FormInput label="Phone" id="phone" required value={form.phone} onChange={(e) => setField('phone', e.target.value)} error={errors.phone} placeholder="10-digit mobile" maxLength={10} />
          <FormInput label="Credit Limit (₹)" id="cl" type="number" min="0" required value={form.creditLimit} onChange={(e) => setField('creditLimit', e.target.value)} error={errors.creditLimit} />
          <SelectInput label="Status" id="status" value={form.status} onChange={(e) => setField('status', e.target.value)}>
            <option value={STATUS.ACTIVE}>Active</option>
            <option value={STATUS.INACTIVE}>Inactive</option>
          </SelectInput>
        </div>
      </Modal>
    </div>
  );
}
