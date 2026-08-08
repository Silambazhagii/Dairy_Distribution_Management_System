// Salesperson Ledger Page
import { useState } from 'react';
import { SelectInput } from '../../components/ui/FormInputs';
import PageHeader from '../../components/ui/PageHeader';
import { mockSalespersons, mockSales, mockCollections } from '../../mock';
import { formatDate, formatCurrency } from '../../utils';
import EmptyState from '../../components/ui/EmptyState';
import { BookOpen } from 'lucide-react';

interface LedgerEntry {
  date: string;
  type: string;
  reference: string;
  debit: number;
  credit: number;
  description: string;
}

interface LedgerRow extends LedgerEntry {
  balance: number;
}

export default function DealerLedgerPage() {
  const [salespersonId, setSalespersonId] = useState('');
  const sp = mockSalespersons.find((s) => s.id === salespersonId);

  const sales       = mockSales.filter((s) => sp && s.salesperson === sp.name);
  const collections = mockCollections.filter((c) => sp && c.salesperson === sp.name);

  // Build ledger entries
  const entries: LedgerEntry[] = [
    ...sales.map((s) => ({ date: s.date, type: 'Sale', reference: s.id, debit: s.saleType === 'Credit' ? s.amount : 0, credit: 0, description: `Sale – ${s.soldQty} units${s.customer ? ` (${s.customer})` : ''}` })),
    ...collections.map((c) => ({ date: c.date, type: 'Collection', reference: c.id, debit: 0, credit: c.amount, description: `${c.mode} collection${c.customer ? ` (${c.customer})` : ''}` })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let balance = 0;
  const ledgerRows: LedgerRow[] = entries.map((e) => {
    balance += e.debit - e.credit;
    return { ...e, balance };
  });

  return (
    <div>
      <PageHeader title="Salesperson Ledger" breadcrumbs={['Collections', 'Salesperson Ledger']} description="Individual salesperson transaction history" />

      <div className="card mb-5">
        <div className="card-body">
          <div className="max-w-sm">
            <SelectInput label="Select Salesperson" id="sp" value={salespersonId} onChange={(e) => setSalespersonId(e.target.value)} placeholder="Choose a salesperson">
              {mockSalespersons.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.routes.join(', ')})</option>)}
            </SelectInput>
          </div>
          {sp && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-lg font-bold text-gray-800">{sp.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Assigned Routes</p>
                <p className="text-lg font-bold text-gray-800">{sp.routes.join(', ') || 'None'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="text-lg font-bold text-gray-800">{sp.status}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {!salespersonId ? (
        <EmptyState icon={BookOpen} message="Select a salesperson to view ledger" description="Choose a salesperson from the dropdown above" />
      ) : (
        <div className="card">
          <div className="card-header">
            <h3 className="text-sm font-semibold">{sp?.name} – Ledger</h3>
            <span className="text-xs text-gray-400">{ledgerRows.length} entries</span>
          </div>
          <div className="table-container">
            <table className="erp-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Reference</th>
                  <th>Description</th>
                  <th className="text-right">Debit (Dr)</th>
                  <th className="text-right">Credit (Cr)</th>
                  <th className="text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {ledgerRows.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-400 text-xs">No transactions found</td></tr>
                ) : (
                  ledgerRows.map((row, i) => (
                    <tr key={i}>
                      <td>{formatDate(row.date)}</td>
                      <td>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${row.type === 'Sale' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>{row.type}</span>
                      </td>
                      <td className="font-mono text-xs">{row.reference}</td>
                      <td className="text-gray-500">{row.description}</td>
                      <td className="text-right tabular-nums">{row.debit > 0 ? <span className="text-red-600">{formatCurrency(row.debit)}</span> : <span className="text-gray-300">—</span>}</td>
                      <td className="text-right tabular-nums">{row.credit > 0 ? <span className="text-green-600">{formatCurrency(row.credit)}</span> : <span className="text-gray-300">—</span>}</td>
                      <td className="text-right tabular-nums font-semibold">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
