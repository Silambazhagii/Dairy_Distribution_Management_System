// Dealer Ledger Page
import React, { useState } from 'react';
import { SelectInput } from '../../components/ui/FormInputs';
import PageHeader from '../../components/ui/PageHeader';
import { mockDealers, mockSales, mockCollections } from '../../mock';
import { formatDate, formatCurrency } from '../../utils';
import EmptyState from '../../components/ui/EmptyState';
import { BookOpen } from 'lucide-react';

export default function DealerLedgerPage() {
  const [dealerId, setDealerId] = useState('');
  const dealer = mockDealers.find((d) => d.id === dealerId);

  const sales = mockSales.filter((s) => dealer && s.dealer === dealer.name);
  const collections = mockCollections.filter((c) => dealer && c.dealer === dealer.name);

  // Build ledger entries
  const entries = [
    ...sales.map((s) => ({ date: s.date, type: 'Sale', reference: s.id, debit: s.saleType === 'Credit' ? s.amount : 0, credit: 0, description: `Sale – ${s.soldQty} units` })),
    ...collections.map((c) => ({ date: c.date, type: 'Collection', reference: c.id, debit: 0, credit: c.amount, description: `${c.mode} collection` })),
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  let balance = dealer?.outstanding || 0;
  const ledgerRows = entries.map((e) => {
    balance += e.debit - e.credit;
    return { ...e, balance };
  });

  return (
    <div>
      <PageHeader title="Dealer Ledger" breadcrumbs={['Collections', 'Dealer Ledger']} description="Individual dealer transaction history" />

      <div className="card mb-5">
        <div className="card-body">
          <div className="max-w-sm">
            <SelectInput label="Select Dealer" id="dealer" value={dealerId} onChange={(e) => setDealerId(e.target.value)} placeholder="Choose a dealer">
              {mockDealers.map((d) => <option key={d.id} value={d.id}>{d.name} ({d.route})</option>)}
            </SelectInput>
          </div>
          {dealer && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">Credit Limit</p>
                <p className="text-lg font-bold text-gray-800">{formatCurrency(dealer.creditLimit)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Current Outstanding</p>
                <p className={`text-lg font-bold ${dealer.outstanding > 0 ? 'text-red-600' : 'text-green-700'}`}>{formatCurrency(dealer.outstanding)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="text-lg font-bold text-gray-800">{dealer.status}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {!dealerId ? (
        <EmptyState icon={BookOpen} message="Select a dealer to view ledger" description="Choose a dealer from the dropdown above" />
      ) : (
        <div className="card">
          <div className="card-header">
            <h3 className="text-sm font-semibold">{dealer?.name} – Ledger</h3>
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
