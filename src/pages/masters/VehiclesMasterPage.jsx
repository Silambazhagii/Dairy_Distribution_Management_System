// Vehicles Master Page
import React, { useState } from 'react';
import { Plus, Edit2, Power } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import PageHeader from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { FormInput, SelectInput, QuantityInput } from '../../components/ui/FormInputs';
import { mockVehicles, mockSalespersons } from '../../mock';
import { STATUS } from '../../constants';
import { useToast } from '../../hooks/useToast';

const TYPES = ['Mini Truck', 'Auto', 'Cycle', 'Bike', 'Van'];
const EMPTY_FORM = { regNumber: '', type: '', capacity: '', assignedTo: '', status: STATUS.ACTIVE };

export default function VehiclesMasterPage() {
  const toast = useToast();
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const setField = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.regNumber.trim()) e.regNumber = 'Enter registration number';
    if (!form.type) e.type = 'Select vehicle type';
    if (!form.capacity || Number(form.capacity) <= 0) e.capacity = 'Enter capacity';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editItem) {
      setVehicles((v) => v.map((x) => x.id === editItem.id ? { ...x, ...form, capacity: Number(form.capacity) } : x));
      toast('Vehicle updated', 'success');
    } else {
      setVehicles((v) => [...v, { ...form, id: `V${String(vehicles.length + 1).padStart(3, '0')}`, capacity: Number(form.capacity) }]);
      toast('Vehicle added', 'success');
    }
    setModalOpen(false);
  };

  const toggleStatus = (row) => {
    setVehicles((v) => v.map((x) => x.id === row.id ? { ...x, status: x.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE } : x));
  };

  const openEdit = (row) => { setEditItem(row); setForm({ regNumber: row.regNumber, type: row.type, capacity: String(row.capacity), assignedTo: row.assignedTo || '', status: row.status }); setErrors({}); setModalOpen(true); };
  const openAdd = () => { setEditItem(null); setForm(EMPTY_FORM); setErrors({}); setModalOpen(true); };

  const columns = [
    { header: 'ID', accessor: 'id', key: 'id' },
    { header: 'Reg. Number', accessor: 'regNumber', sortable: true, key: 'reg' },
    { header: 'Type', accessor: 'type', key: 'type' },
    { header: 'Capacity (units)', accessor: 'capacity', sortable: true, key: 'cap', render: (r) => <span className="tabular-nums">{r.capacity}</span> },
    { header: 'Assigned To', key: 'assigned', render: (r) => {
      const sp = mockSalespersons.find((s) => s.id === r.assignedTo);
      return sp ? sp.name : <span className="text-gray-300">Unassigned</span>;
    }},
    { header: 'Status', key: 'status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Vehicles" breadcrumbs={['Masters', 'Vehicles']} description="Vehicle fleet management"
        actions={<button onClick={openAdd} className="btn-primary gap-1.5"><Plus className="w-4 h-4" /> Add Vehicle</button>}
      />
      <DataTable columns={columns} data={vehicles} searchKeys={['id', 'regNumber', 'type', 'status']} searchPlaceholder="Search vehicles…" exportFilename="vehicles"
        actions={(row) => (
          <>
            <button onClick={() => openEdit(row)} className="btn-ghost btn-sm p-1.5"><Edit2 className="w-3.5 h-3.5" /></button>
            <button onClick={() => toggleStatus(row)} className="btn-ghost btn-sm p-1.5">
              <Power className={`w-3.5 h-3.5 ${row.status === STATUS.ACTIVE ? 'text-red-500' : 'text-green-500'}`} />
            </button>
          </>
        )}
      />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Vehicle' : 'Add Vehicle'} size="sm"
        footer={<><button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button onClick={handleSave} className="btn-primary">Save</button></>}
      >
        <div className="space-y-3">
          <FormInput label="Registration Number" id="reg" required value={form.regNumber} onChange={(e) => setField('regNumber', e.target.value.toUpperCase())} error={errors.regNumber} placeholder="TN01AB1234" />
          <SelectInput label="Vehicle Type" id="type" required value={form.type} onChange={(e) => setField('type', e.target.value)} error={errors.type} placeholder="Select type">
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </SelectInput>
          <QuantityInput label="Capacity (units)" id="cap" required value={form.capacity} onChange={(e) => setField('capacity', e.target.value)} error={errors.capacity} />
          <SelectInput label="Assigned Salesperson" id="assigned" value={form.assignedTo} onChange={(e) => setField('assignedTo', e.target.value)} placeholder="Unassigned">
            {mockSalespersons.filter((s) => s.status === STATUS.ACTIVE).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </SelectInput>
        </div>
      </Modal>
    </div>
  );
}
