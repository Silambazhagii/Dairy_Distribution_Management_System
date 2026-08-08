// Salespersons Master Page
import { useState } from 'react';
import { Plus, Edit2, Power } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import PageHeader from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { FormInput, SelectInput, DateInput } from '../../components/ui/FormInputs';
import { mockSalespersons } from '../../mock';
import { STATUS } from '../../constants';
import { formatDate } from '../../utils';
import { useToast } from '../../hooks/useToast';
import type { Salesperson, GeneralStatus } from '../../types';
import type { TableColumn } from '../../types';

interface SalespersonForm {
  name: string;
  phone: string;
  joinDate: string;
  status: string;
}

type FormErrors = Partial<Record<keyof SalespersonForm, string>>;

const EMPTY_FORM: SalespersonForm = { name: '', phone: '', joinDate: '', status: STATUS.ACTIVE };

export default function SalespersonsMasterPage() {
  const toast = useToast();
  const [salespersons, setSalespersons] = useState<Salesperson[]>(mockSalespersons);
  const [modalOpen, setModalOpen]       = useState(false);
  const [editItem, setEditItem]         = useState<Salesperson | null>(null);
  const [form, setForm]                 = useState<SalespersonForm>(EMPTY_FORM);
  const [errors, setErrors]             = useState<FormErrors>({});

  const setField = (k: keyof SalespersonForm, v: string) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: '' })); };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Enter name';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = 'Enter valid 10-digit phone';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editItem) {
      setSalespersons((s) => s.map((x) => x.id === editItem.id ? {
        ...x,
        name: form.name,
        phone: form.phone,
        joinDate: form.joinDate,
        status: form.status as GeneralStatus
      } : x));
      toast('Salesperson updated', 'success');
    } else {
      setSalespersons((s) => [...s, {
        id: `SP${String(salespersons.length + 7).padStart(3, '0')}`,
        name: form.name,
        phone: form.phone,
        joinDate: form.joinDate,
        status: form.status as GeneralStatus,
        routes: []
      }]);
      toast('Salesperson added', 'success');
    }
    setModalOpen(false);
  };

  const toggleStatus = (row: Salesperson) => {
    setSalespersons((s) => s.map((x) => x.id === row.id ? { ...x, status: (x.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE) as GeneralStatus } : x));
    toast(`Salesperson ${row.status === STATUS.ACTIVE ? 'deactivated' : 'activated'}`, 'info');
  };

  const openEdit = (row: Salesperson) => { setEditItem(row); setForm({ name: row.name, phone: row.phone, joinDate: row.joinDate, status: row.status }); setErrors({}); setModalOpen(true); };
  const openAdd  = () => { setEditItem(null); setForm(EMPTY_FORM); setErrors({}); setModalOpen(true); };

  const columns: TableColumn<Salesperson>[] = [
    { header: 'ID',        accessor: 'id',        key: 'id' },
    { header: 'Name',      accessor: 'name',      sortable: true, key: 'name' },
    { header: 'Phone',     accessor: 'phone',     key: 'phone' },
    { header: 'Routes',    key: 'routes',         render: (r) => <span className="text-gray-600">{(r.routes || []).join(', ')}</span> },
    { header: 'Join Date', key: 'joinDate',       render: (r) => formatDate(r.joinDate) },
    { header: 'Status',    key: 'status',         render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Salespersons" breadcrumbs={['Masters', 'Salespersons']} description="Manage field salesperson records"
        actions={<button onClick={openAdd} className="btn-primary gap-1.5"><Plus className="w-4 h-4" /> Add Salesperson</button>}
      />
      <DataTable<Salesperson> columns={columns} data={salespersons} searchKeys={['id', 'name', 'phone', 'status']} searchPlaceholder="Search salespersons…" exportFilename="salespersons"
        actions={(row) => (
          <>
            <button onClick={() => openEdit(row)} className="btn-ghost btn-sm p-1.5"><Edit2 className="w-3.5 h-3.5" /></button>
            <button onClick={() => toggleStatus(row)} className="btn-ghost btn-sm p-1.5">
              <Power className={`w-3.5 h-3.5 ${row.status === STATUS.ACTIVE ? 'text-red-500' : 'text-green-500'}`} />
            </button>
          </>
        )}
      />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Salesperson' : 'Add Salesperson'} size="sm"
        footer={<><button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button onClick={handleSave} className="btn-primary">Save</button></>}
      >
        <div className="space-y-3">
          <FormInput label="Full Name" id="name" required value={form.name} onChange={(e) => setField('name', e.target.value)} error={errors.name} />
          <FormInput label="Phone" id="phone" required value={form.phone} onChange={(e) => setField('phone', e.target.value)} error={errors.phone} maxLength={10} />
          <DateInput label="Join Date" id="joinDate" value={form.joinDate} onChange={(e) => setField('joinDate', e.target.value)} />
          <SelectInput label="Status" id="status" value={form.status} onChange={(e) => setField('status', e.target.value)}>
            <option value={STATUS.ACTIVE}>Active</option>
            <option value={STATUS.INACTIVE}>Inactive</option>
          </SelectInput>
        </div>
      </Modal>
    </div>
  );
}
