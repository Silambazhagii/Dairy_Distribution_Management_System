// Routes Master Page
import React, { useState } from 'react';
import { Plus, Edit2, Power } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import PageHeader from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { FormInput, SelectInput } from '../../components/ui/FormInputs';
import { mockRoutes, mockSalespersons } from '../../mock';
import { STATUS } from '../../constants';
import { useToast } from '../../hooks/useToast';

export default function RoutesMasterPage() {
  const toast = useToast();
  const [routes, setRoutes] = useState(mockRoutes);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', area: '', salesperson: '' });
  const [errors, setErrors] = useState({});

  const setField = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Enter route name';
    if (!form.area.trim()) e.area = 'Enter area';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editItem) {
      setRoutes((r) => r.map((x) => x.id === editItem.id ? { ...x, ...form } : x));
      toast('Route updated', 'success');
    } else {
      setRoutes((r) => [...r, { ...form, id: `R${String(routes.length + 1).padStart(2, '0')}`, dealerCount: 0, status: STATUS.ACTIVE }]);
      toast('Route added', 'success');
    }
    setModalOpen(false);
  };

  const toggleStatus = (row) => {
    setRoutes((r) => r.map((x) => x.id === row.id ? { ...x, status: x.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE } : x));
    toast(`Route ${row.status === STATUS.ACTIVE ? 'deactivated' : 'activated'}`, 'info');
  };

  const openEdit = (row) => { setEditItem(row); setForm({ name: row.name, area: row.area, salesperson: row.salesperson }); setErrors({}); setModalOpen(true); };
  const openAdd = () => { setEditItem(null); setForm({ name: '', area: '', salesperson: '' }); setErrors({}); setModalOpen(true); };

  const columns = [
    { header: 'Route ID', accessor: 'id', key: 'id' },
    { header: 'Route Name', accessor: 'name', sortable: true, key: 'name' },
    { header: 'Area', accessor: 'area', sortable: true, key: 'area' },
    { header: 'Salesperson', accessor: 'salesperson', key: 'sp' },
    { header: 'Dealers', accessor: 'dealerCount', key: 'dc', render: (r) => <span className="tabular-nums font-medium">{r.dealerCount}</span> },
    { header: 'Status', key: 'status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Routes" breadcrumbs={['Masters', 'Routes']} description="Distribution route configuration"
        actions={<button onClick={openAdd} className="btn-primary gap-1.5"><Plus className="w-4 h-4" /> Add Route</button>}
      />
      <DataTable columns={columns} data={routes} searchKeys={['id', 'name', 'area', 'salesperson']} searchPlaceholder="Search routes…" exportFilename="routes"
        actions={(row) => (
          <>
            <button onClick={() => openEdit(row)} className="btn-ghost btn-sm p-1.5"><Edit2 className="w-3.5 h-3.5" /></button>
            <button onClick={() => toggleStatus(row)} className="btn-ghost btn-sm p-1.5">
              <Power className={`w-3.5 h-3.5 ${row.status === STATUS.ACTIVE ? 'text-red-500' : 'text-green-500'}`} />
            </button>
          </>
        )}
      />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Route' : 'Add Route'} size="sm"
        footer={<><button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button onClick={handleSave} className="btn-primary">Save</button></>}
      >
        <div className="space-y-3">
          <FormInput label="Route Name" id="name" required value={form.name} onChange={(e) => setField('name', e.target.value)} error={errors.name} placeholder="e.g. Anna Nagar" />
          <FormInput label="Area" id="area" required value={form.area} onChange={(e) => setField('area', e.target.value)} error={errors.area} placeholder="e.g. North" />
          <SelectInput label="Assigned Salesperson" id="sp" value={form.salesperson} onChange={(e) => setField('salesperson', e.target.value)} placeholder="Select salesperson">
            {mockSalespersons.filter((s) => s.status === STATUS.ACTIVE).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </SelectInput>
        </div>
      </Modal>
    </div>
  );
}
