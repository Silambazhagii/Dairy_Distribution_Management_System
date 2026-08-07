// Salesperson Settlement Page
import React, { useState } from 'react';
import { Check, AlertTriangle, TrendingUp, TrendingDown, Calculator } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import { SelectInput, DateInput } from '../../components/ui/FormInputs';
import { mockSalespersons, mockDispatches, mockSales, mockCollections } from '../../mock';
import { formatCurrency, formatNumber, todayISO } from '../../utils';
import { useToast } from '../../hooks/useToast';
import { ConfirmDialog } from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';

interface LineRowProps {
  label: string;
  value: string | number;
  highlight?: boolean;
  sub?: boolean;
}

const LineRow = ({ label, value, highlight = false, sub = false }: LineRowProps) => (
  <div className={`flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 ${sub ? 'pl-4' : ''}`}>
    <span className={`text-xs ${sub ? 'text-gray-400' : highlight ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{label}</span>
    <span className={`text-sm tabular-nums ${highlight ? 'font-bold' : 'font-medium'} ${sub ? 'text-gray-500' : 'text-gray-800'}`}>{value}</span>
  </div>
);

export default function SettlementPage() {
  const toast = useToast();
  const [salespersonId, setSalespersonId] = useState('');
  const [date, setDate]                  = useState(todayISO());
  const [session, setSession]            = useState('Morning');
  const [settled, setSettled]            = useState(false);
  const [confirmOpen, setConfirmOpen]    = useState(false);

  const sp = mockSalespersons.find((s) => s.id === salespersonId);

  // Compute settlement data for selected salesperson
  const spDispatches  = mockDispatches.filter((d) => d.salesperson === sp?.name);
  const spSales       = mockSales.filter((s) => s.salesperson === sp?.name);
  const spCollections = mockCollections.filter((c) => c.salesperson === sp?.name);

  const totalDispatched  = spDispatches.reduce((s, d) => s + d.totalQty, 0);
  const totalSold        = spSales.reduce((s, r) => s + r.soldQty, 0);
  const totalFree        = spSales.reduce((s, r) => s + r.freeQty, 0);
  const totalReturns     = spSales.reduce((s, r) => s + r.returnQty, 0);
  const totalCashSales   = spSales.filter((s) => s.saleType === 'Cash').reduce((s, r) => s + r.amount, 0);
  const totalCreditSales = spSales.filter((s) => s.saleType === 'Credit').reduce((s, r) => s + r.amount, 0);
  const totalCollected   = spCollections.reduce((s, c) => s + c.amount, 0);
  const amountDue        = totalCashSales;
  const difference       = totalCollected - amountDue;
  const settlementStatus = difference === 0 ? 'Settled' : difference > 0 ? 'Excess' : 'Short';

  const handleSettle = () => {
    setSettled(true);
    setConfirmOpen(false);
    toast('Settlement completed successfully', 'success');
  };

  return (
    <div>
      <PageHeader
        title="Salesperson Settlement"
        breadcrumbs={['Settlement']}
        description="End-of-session reconciliation: Dispatch → Sales → Collections → Amount Due"
      />

      {/* Filter bar */}
      <div className="card mb-5">
        <div className="card-body">
          <div className="grid grid-cols-3 gap-4 max-w-xl">
            <SelectInput label="Salesperson" id="sp" value={salespersonId} onChange={(e) => { setSalespersonId(e.target.value); setSettled(false); }} placeholder="Select salesperson">
              {mockSalespersons.filter((s) => s.status === 'Active').map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </SelectInput>
            <DateInput    label="Date"    id="date"    value={date}    onChange={(e) => setDate(e.target.value)} />
            <SelectInput  label="Session" id="session" value={session} onChange={(e) => setSession(e.target.value)}>
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
            </SelectInput>
          </div>
        </div>
      </div>

      {!salespersonId ? (
        <EmptyState icon={Calculator} message="Select a salesperson to view settlement" description="Choose a salesperson and date above" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left – breakdown */}
          <div className="lg:col-span-2 space-y-4">
            {/* Dispatch */}
            <div className="card">
              <div className="card-header"><h3 className="text-sm font-semibold">Dispatch Summary</h3></div>
              <div className="card-body">
                {spDispatches.length === 0 ? <p className="text-xs text-gray-400">No dispatches found</p> : spDispatches.map((d) => (
                  <div key={d.id} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-600">{d.id} · {d.session}</span>
                    <span className="text-xs font-semibold">{d.totalQty} units</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 mt-1 border-t border-gray-100">
                  <span className="text-xs font-semibold text-gray-700">Total Dispatched</span>
                  <span className="text-sm font-bold">{formatNumber(totalDispatched)} units</span>
                </div>
              </div>
            </div>

            {/* Sales */}
            <div className="card">
              <div className="card-header"><h3 className="text-sm font-semibold">Sales Summary</h3></div>
              <div className="card-body">
                <LineRow label="Sold Quantity"      value={formatNumber(totalSold) + ' units'} />
                <LineRow label="Free Quantity"      value={formatNumber(totalFree) + ' units'} sub />
                <LineRow label="Returns"            value={formatNumber(totalReturns) + ' units'} sub />
                <LineRow label="Cash Sales"         value={formatCurrency(totalCashSales)} />
                <LineRow label="Credit Sales"       value={formatCurrency(totalCreditSales)} sub />
                <LineRow label="Total Sales Value"  value={formatCurrency(totalCashSales + totalCreditSales)} highlight />
              </div>
            </div>

            {/* Collections */}
            <div className="card">
              <div className="card-header"><h3 className="text-sm font-semibold">Collections</h3></div>
              <div className="card-body">
                {spCollections.map((c) => (
                  <div key={c.id} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-600">{c.route} · {c.mode}</span>
                    <span className="text-xs font-semibold">{formatCurrency(c.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 mt-1 border-t border-gray-100">
                  <span className="text-xs font-semibold text-gray-700">Total Collected</span>
                  <span className="text-sm font-bold text-green-700">{formatCurrency(totalCollected)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right – reconciliation */}
          <div>
            <div className="card sticky top-5">
              <div className="card-header"><h3 className="text-sm font-semibold">Reconciliation</h3></div>
              <div className="card-body space-y-0">
                <LineRow label="Amount Due (Cash Sales)" value={formatCurrency(amountDue)} />
                <LineRow label="Amount Collected"        value={formatCurrency(totalCollected)} />
                <div className="pt-3 mt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Difference</span>
                    <div className="flex items-center gap-2">
                      {difference !== 0 && (
                        difference > 0
                          ? <TrendingUp   className="w-4 h-4 text-blue-600" />
                          : <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-lg font-bold tabular-nums ${difference === 0 ? 'text-green-700' : difference > 0 ? 'text-blue-700' : 'text-red-700'}`}>
                        {difference >= 0 ? '+' : ''}{formatCurrency(difference)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-500">Settlement Status</span>
                    <StatusBadge status={settled ? 'Settled' : settlementStatus} />
                  </div>

                  {difference !== 0 && !settled && (
                    <div className={`flex items-start gap-2 p-3 rounded-lg mb-3 text-xs ${difference > 0 ? 'bg-blue-50 text-blue-800' : 'bg-red-50 text-red-800'}`}>
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      {difference > 0
                        ? `Excess of ${formatCurrency(difference)} collected. Verify and adjust.`
                        : `Short by ${formatCurrency(Math.abs(difference))}. Follow up required.`}
                    </div>
                  )}

                  {settled ? (
                    <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3 text-xs font-medium">
                      <Check className="w-4 h-4" /> Settlement completed
                    </div>
                  ) : (
                    <button onClick={() => setConfirmOpen(true)} className="btn-primary w-full justify-center">
                      Complete Settlement
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleSettle}
        title="Complete Settlement"
        message={`Settle for ${sp?.name} on ${date} (${session} session)? This will close the settlement and cannot be reopened.`}
        confirmLabel="Confirm Settlement"
      />
    </div>
  );
}
