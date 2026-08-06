// Products Master Page
import React, { useState } from 'react';
import { Plus, Edit2, Power } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import PageHeader from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { FormInput, SelectInput } from '../../components/ui/FormInputs';
import { PRODUCTS, PRODUCT_CATEGORIES, STATUS } from '../../constants';
import { useToast } from '../../hooks/useToast';

const toTableData = (products) => products.map((p) => ({ ...p, status: STATUS.ACTIVE }));

export default function ProductsMasterPage() {
  const toast = useToast();
  const [products, setProducts] = useState(toTableData(PRODUCTS));
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ category: '', name: '', packSize: '', unit: 'pcs', price: '' });
  const [errors, setErrors] = useState({});

  const setField = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.category) e.category = 'Select category';
    if (!form.name.trim()) e.name = 'Enter product name';
    if (!form.packSize.trim()) e.packSize = 'Enter pack size';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editItem) {
      setProducts((p) => p.map((x) => x.id === editItem.id ? { ...x, ...form } : x));
      toast('Product updated', 'success');
    } else {
      setProducts((p) => [...p, { ...form, id: `custom-${Date.now()}`, status: STATUS.ACTIVE }]);
      toast('Product added', 'success');
    }
    setModalOpen(false);
  };

  const toggleStatus = (row) => {
    setProducts((p) => p.map((x) => x.id === row.id ? { ...x, status: x.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE } : x));
    toast(`Product ${row.status === STATUS.ACTIVE ? 'deactivated' : 'activated'}`, 'info');
  };

  const openEdit = (row) => { setEditItem(row); setForm({ category: row.category, name: row.name, packSize: row.packSize, unit: row.unit || 'pcs', price: row.price || '' }); setErrors({}); setModalOpen(true); };
  const openAdd = () => { setEditItem(null); setForm({ category: '', name: '', packSize: '', unit: 'pcs', price: '' }); setErrors({}); setModalOpen(true); };

  const columns = [
    { header: 'ID', accessor: 'id', key: 'id' },
    { header: 'Category', accessor: 'category', sortable: true, key: 'cat' },
    { header: 'Product Name', accessor: 'name', sortable: true, key: 'name' },
    { header: 'Pack Size', accessor: 'packSize', key: 'ps' },
    { header: 'Unit', accessor: 'unit', key: 'unit' },
    { header: 'Status', key: 'status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Products" breadcrumbs={['Masters', 'Products']} description="Manage product categories and pack sizes"
        actions={<button onClick={openAdd} className="btn-primary gap-1.5"><Plus className="w-4 h-4" /> Add Product</button>}
      />
      <DataTable
        columns={columns}
        data={products}
        searchKeys={['id', 'category', 'name', 'packSize']}
        searchPlaceholder="Search products…"
        exportFilename="products"
        actions={(row) => (
          <>
            <button onClick={() => openEdit(row)} className="btn-ghost btn-sm p-1.5"><Edit2 className="w-3.5 h-3.5" /></button>
            <button onClick={() => toggleStatus(row)} className="btn-ghost btn-sm p-1.5" title={row.status === STATUS.ACTIVE ? 'Deactivate' : 'Activate'}>
              <Power className={`w-3.5 h-3.5 ${row.status === STATUS.ACTIVE ? 'text-red-500' : 'text-green-500'}`} />
            </button>
          </>
        )}
      />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Product' : 'Add Product'} size="sm"
        footer={<><button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button onClick={handleSave} className="btn-primary">Save</button></>}
      >
        <div className="space-y-3">
          <SelectInput label="Category" id="cat" required value={form.category} onChange={(e) => setField('category', e.target.value)} error={errors.category} placeholder="Select category">
            {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </SelectInput>
          <FormInput label="Product Name" id="name" required value={form.name} onChange={(e) => setField('name', e.target.value)} error={errors.name} placeholder="e.g. Milk 250ml" />
          <FormInput label="Pack Size" id="packSize" required value={form.packSize} onChange={(e) => setField('packSize', e.target.value)} error={errors.packSize} placeholder="e.g. 250ml" />
          <SelectInput label="Unit" id="unit" value={form.unit} onChange={(e) => setField('unit', e.target.value)}>
            <option value="pcs">pcs</option><option value="litre">litre</option><option value="kg">kg</option>
          </SelectInput>
        </div>
      </Modal>
    </div>
  );
}
