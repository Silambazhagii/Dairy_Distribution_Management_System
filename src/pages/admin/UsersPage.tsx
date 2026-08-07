// Users & Roles Admin Page
import React, { useState } from 'react';
import { Plus, Edit2, Power } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import PageHeader from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { FormInput, SelectInput } from '../../components/ui/FormInputs';
import { mockUsers } from '../../mock';
import { USER_ROLES, STATUS } from '../../constants';
import { formatDateTime } from '../../utils';
import { useToast } from '../../hooks/useToast';
import type { SystemUser, UserRole, GeneralStatus } from '../../types';
import type { TableColumn } from '../../types';

const ROLE_COLORS: Record<string, string> = {
  Admin: 'bg-red-50 text-red-700',
  Manager: 'bg-purple-50 text-purple-700',
  'Salesperson': 'bg-blue-50 text-blue-700',
  'Accounts Staff': 'bg-teal-50 text-teal-700',
  'Cold Storage Staff': 'bg-cyan-50 text-cyan-700',
};

interface UserForm {
  name: string;
  email: string;
  role: string;
  status: string;
}

type FormErrors = Partial<Record<keyof UserForm, string>>;

const EMPTY_FORM: UserForm = { name: '', email: '', role: '', status: STATUS.ACTIVE };

export default function UsersPage() {
  const toast = useToast();
  const [users, setUsers]         = useState<SystemUser[]>(mockUsers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem]   = useState<SystemUser | null>(null);
  const [form, setForm]           = useState<UserForm>(EMPTY_FORM);
  const [errors, setErrors]       = useState<FormErrors>({});

  const setField = (k: keyof UserForm, v: string) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: '' })); };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.name.trim())                       e.name  = 'Enter name';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter valid email';
    if (!form.role)                              e.role  = 'Select role';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editItem) {
      setUsers((u) => u.map((x) => x.id === editItem.id ? {
        ...x,
        name: form.name,
        email: form.email,
        role: form.role as UserRole,
        status: form.status as GeneralStatus
      } : x));
      toast('User updated', 'success');
    } else {
      setUsers((u) => [...u, {
        id: `U${String(users.length + 1).padStart(3, '0')}`,
        name: form.name,
        email: form.email,
        role: form.role as UserRole,
        status: form.status as GeneralStatus,
        lastLogin: ''
      }]);
      toast('User created. A password email will be sent.', 'success');
    }
    setModalOpen(false);
  };

  const toggleStatus = (row: SystemUser) => {
    setUsers((u) => u.map((x) => x.id === row.id ? { ...x, status: (x.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE) as GeneralStatus } : x));
    toast(`User ${row.status === STATUS.ACTIVE ? 'deactivated' : 'activated'}`, 'info');
  };

  const openEdit = (row: SystemUser) => { setEditItem(row); setForm({ name: row.name, email: row.email, role: row.role, status: row.status }); setErrors({}); setModalOpen(true); };
  const openAdd  = () => { setEditItem(null); setForm(EMPTY_FORM); setErrors({}); setModalOpen(true); };

  const columns: TableColumn<SystemUser>[] = [
    { header: 'User ID',    accessor: 'id',          key: 'id' },
    { header: 'Name',       accessor: 'name',        sortable: true, key: 'name' },
    { header: 'Email',      accessor: 'email',       key: 'email' },
    { header: 'Role',       key: 'role',             render: (r) => (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[r.role] || 'bg-gray-100 text-gray-700'}`}>{r.role}</span>
    )},
    { header: 'Last Login', key: 'login',            render: (r) => r.lastLogin ? formatDateTime(r.lastLogin) : <span className="text-gray-300">Never</span> },
    { header: 'Status',     key: 'status',           render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Users &amp; Roles" breadcrumbs={['Administration', 'Users &amp; Roles']} description="Manage system users and role assignments"
        actions={<button onClick={openAdd} className="btn-primary gap-1.5"><Plus className="w-4 h-4" /> Add User</button>}
      />
      <DataTable<SystemUser> columns={columns} data={users} searchKeys={['id', 'name', 'email', 'role', 'status']} searchPlaceholder="Search users…" exportFilename="users"
        actions={(row) => (
          <>
            <button onClick={() => openEdit(row)} className="btn-ghost btn-sm p-1.5"><Edit2 className="w-3.5 h-3.5" /></button>
            <button onClick={() => toggleStatus(row)} className="btn-ghost btn-sm p-1.5">
              <Power className={`w-3.5 h-3.5 ${row.status === STATUS.ACTIVE ? 'text-red-500' : 'text-green-500'}`} />
            </button>
          </>
        )}
      />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit User' : 'Add User'} size="sm"
        footer={<><button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button onClick={handleSave} className="btn-primary">Save</button></>}
      >
        <div className="space-y-3">
          <FormInput label="Full Name" id="name" required value={form.name} onChange={(e) => setField('name', e.target.value)} error={errors.name} />
          <FormInput label="Email"     id="email" type="email" required value={form.email} onChange={(e) => setField('email', e.target.value)} error={errors.email} />
          <SelectInput label="Role"     id="role" required value={form.role} onChange={(e) => setField('role', e.target.value)} error={errors.role} placeholder="Select role">
            {Object.values(USER_ROLES).map((r) => <option key={r} value={r}>{r}</option>)}
          </SelectInput>
          <SelectInput label="Status"   id="status" value={form.status} onChange={(e) => setField('status', e.target.value)}>
            <option value={STATUS.ACTIVE}>Active</option>
            <option value={STATUS.INACTIVE}>Inactive</option>
          </SelectInput>
          {!editItem && <p className="text-xs text-gray-400">A password setup email will be sent to the user.</p>}
        </div>
      </Modal>
    </div>
  );
}
