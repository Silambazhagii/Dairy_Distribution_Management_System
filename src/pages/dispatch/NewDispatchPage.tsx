import { useState } from 'react';
import { Plus, Trash2, Send, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { SelectInput, DateInput, QuantityInput } from '../../components/ui/FormInputs';
import { PRODUCTS, SESSIONS } from '../../constants';
import { mockBatches, mockSalespersons, mockRoutes, mockVehicles } from '../../mock';
import { todayISO, formatNumber } from '../../utils';
import { useToast } from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';

interface DispatchHeaderForm {
  date: string;
  session: string;
  salespersonId: string;
  routeId: string;
  vehicleId: string;
}

interface DispatchLine {
  batchId: string;
  productId: string;
  qty: string;
}

type FormErrors = Partial<Record<keyof DispatchHeaderForm, string>> & { lines?: string };

const EMPTY_LINE: DispatchLine = { batchId: '', productId: '', qty: '' };

export default function NewDispatchPage() {
  const toast    = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState<DispatchHeaderForm>({
    date: todayISO(), session: SESSIONS.MORNING,
    salespersonId: '', routeId: '', vehicleId: '',
  });
  const [lines, setLines]               = useState<DispatchLine[]>([{ ...EMPTY_LINE }]);
  const [errors, setErrors]             = useState<FormErrors>({});
  const [stockWarning, setStockWarning] = useState('');

  const activeBatches      = mockBatches.filter((b) => b.status === 'Active' && b.availableQty > 0);
  const activeSalespersons = mockSalespersons.filter((s) => s.status === 'Active');
  const activeVehicles     = mockVehicles.filter((v) => v.status === 'Active');

  const setField = (k: keyof DispatchHeaderForm, v: string) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: '' })); };

  const addLine    = () => setLines((l) => [...l, { ...EMPTY_LINE }]);
  const removeLine = (i: number) => setLines((l) => l.filter((_, idx) => idx !== i));

  const updateLine = (i: number, key: keyof DispatchLine, value: string) => {
    setLines((l) => l.map((line, idx) => {
      if (idx !== i) return line;
      const updated = { ...line, [key]: value };
      if (key === 'batchId') {
        const batch = activeBatches.find((b) => b.id === value);
        updated.productId = batch?.productId || '';
      }
      return updated;
    }));
    setStockWarning('');
  };

  const validateStock = (): string => {
    for (const line of lines) {
      if (!line.batchId || !line.qty) continue;
      const batch = activeBatches.find((b) => b.id === line.batchId);
      if (batch && Number(line.qty) > batch.availableQty) {
        return `Batch ${line.batchId}: only ${batch.availableQty} units available (requested ${line.qty})`;
      }
    }
    return '';
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.date)           e.date          = 'Date required';
    if (!form.salespersonId)  e.salespersonId  = 'Select salesperson';
    if (!form.routeId)        e.routeId        = 'Select route';
    if (!form.vehicleId)      e.vehicleId      = 'Select vehicle';
    if (lines.every((l) => !l.batchId || !l.qty)) e.lines = 'Add at least one dispatch item';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const warning = validateStock();
    if (warning) { setStockWarning(warning); return; }
    toast('Dispatch created successfully', 'success');
    navigate('/dispatch/history');
  };

  const totalQty = lines.reduce((s, l) => s + (Number(l.qty) || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Dispatch"
        breadcrumbs={['Dispatch', 'New Dispatch']}
        description="Configure header details and add items for vehicle route dispatch"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left – form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header details */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Dispatch Metadata</h3>
            </div>
            <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateInput    label="Dispatch Date" id="date"    required value={form.date}          onChange={(e) => setField('date', e.target.value)}          error={errors.date} />
              <SelectInput  label="Session"       id="session"          value={form.session}        onChange={(e) => setField('session', e.target.value)}>
                <option value={SESSIONS.MORNING}>Morning</option>
                <option value={SESSIONS.EVENING}>Evening</option>
              </SelectInput>
              <SelectInput  label="Salesperson"   id="sp"     required value={form.salespersonId}  onChange={(e) => setField('salespersonId', e.target.value)} error={errors.salespersonId} placeholder="Select salesperson">
                {activeSalespersons.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </SelectInput>
              <SelectInput  label="Route"         id="route"  required value={form.routeId}        onChange={(e) => setField('routeId', e.target.value)}       error={errors.routeId}       placeholder="Select route">
                {mockRoutes.filter((r) => r.status === 'Active').map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </SelectInput>
              <SelectInput  label="Vehicle"       id="vehicle" required value={form.vehicleId}     onChange={(e) => setField('vehicleId', e.target.value)}     error={errors.vehicleId}     placeholder="Select vehicle" className="md:col-span-2">
                {activeVehicles.map((v) => <option key={v.id} value={v.id}>{v.regNumber} ({v.type})</option>)}
              </SelectInput>
            </div>
          </div>

          {/* Dispatch items */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Dispatch Line Items</h3>
              <button onClick={addLine} className="btn-secondary btn-xs gap-1.5 font-semibold">
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>
            <div className="card-body space-y-4">
              {errors.lines && (
                <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 animate-fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="font-semibold">{errors.lines}</span>
                </div>
              )}
              {stockWarning && (
                <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 animate-fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="font-semibold">{stockWarning}</span>
                </div>
              )}
              <div className="space-y-3">
                {lines.map((line, i) => {
                  const batch = activeBatches.find((b) => b.id === line.batchId);
                  return (
                    <div key={i} className="flex flex-col md:flex-row md:items-end gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors animate-slide-up relative">
                      <div className="flex-1 min-w-[200px]">
                        <SelectInput label="Batch" id={`batch-${i}`} value={line.batchId} onChange={(e) => updateLine(i, 'batchId', e.target.value)} placeholder="Select active batch">
                          {activeBatches.map((b) => <option key={b.id} value={b.id}>{b.id} – {b.product}</option>)}
                        </SelectInput>
                      </div>
                      <div className="w-full md:w-48">
                        <QuantityInput
                          label={`Quantity ${batch ? `(max ${batch.availableQty})` : ''}`}
                          id={`qty-${i}`}
                          value={line.qty}
                          max={batch?.availableQty}
                          onChange={(e) => updateLine(i, 'qty', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div className="flex items-center justify-end flex-shrink-0">
                        {lines.length > 1 && (
                          <button
                            onClick={() => removeLine(i)}
                            className="btn-ghost text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-md"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {batch && (
                        <div className="absolute top-2.5 right-4 text-right">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                            Avail: <strong className="text-green-700 font-bold">{batch.availableQty}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right – summary */}
        <div>
          <div className="card sticky top-6">
            <div className="card-header">
              <h3 className="card-title">Dispatch Summary</h3>
            </div>
            <div className="card-body space-y-4">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400 uppercase tracking-wider">Total Items</span>
                <span className="text-slate-800 font-bold">{lines.filter((l) => l.batchId && l.qty).length}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400 uppercase tracking-wider">Total Quantity</span>
                <span className="text-blue-700 font-bold text-base tabular-nums">{formatNumber(totalQty)} units</span>
              </div>
              <div className="divider" />
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {lines.filter((l) => l.batchId && l.qty).map((l, i) => {
                  const batch = activeBatches.find((b) => b.id === l.batchId);
                  return (
                    <div key={i} className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500 truncate max-w-[150px]">{batch?.product || l.batchId}</span>
                      <span className="text-slate-800 font-mono">{formatNumber(Number(l.qty))}</span>
                    </div>
                  );
                })}
              </div>
              <div className="divider" />
              <div className="space-y-2">
                <button onClick={handleSubmit} className="btn-primary w-full justify-center gap-1.5 font-semibold">
                  <Send className="w-4 h-4" /> Create Dispatch
                </button>
                <button onClick={() => navigate('/dispatch/history')} className="btn-secondary w-full justify-center font-semibold">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Suppress unused import warning for PRODUCTS (used by other pages)
void PRODUCTS;
