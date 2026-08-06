// Settings Page
import React, { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import { FormInput, SelectInput } from '../../components/ui/FormInputs';
import { useToast } from '../../hooks/useToast';

export default function SettingsPage() {
  const toast = useToast();
  const [companyForm, setCompanyForm] = useState({ name: 'SriLakshmi Dairy', address: '123 Dairy Road, Chennai', phone: '9876543200', email: 'info@srilakshmidairy.com', gstin: '33XXXXX1234X1Z5' });
  const [opForm, setOpForm] = useState({ lowStockThreshold: '200', defaultSession: 'Morning', financialYear: '2026-27', creditWarningDays: '30' });

  const handleSaveCompany = (e) => { e.preventDefault(); toast('Company settings saved', 'success'); };
  const handleSaveOp = (e) => { e.preventDefault(); toast('Operational settings saved', 'success'); };

  const setComp = (k, v) => setCompanyForm((f) => ({ ...f, [k]: v }));
  const setOp = (k, v) => setOpForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <PageHeader title="Settings" breadcrumbs={['Administration', 'Settings']} description="System configuration and preferences" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Company Settings */}
        <div className="card">
          <div className="card-header"><h3 className="text-sm font-semibold">Company Information</h3></div>
          <form onSubmit={handleSaveCompany} className="card-body space-y-4">
            <FormInput label="Company Name" id="cname" value={companyForm.name} onChange={(e) => setComp('name', e.target.value)} required />
            <FormInput label="Address" id="addr" value={companyForm.address} onChange={(e) => setComp('address', e.target.value)} />
            <FormInput label="Phone" id="cphone" value={companyForm.phone} onChange={(e) => setComp('phone', e.target.value)} />
            <FormInput label="Email" id="cemail" type="email" value={companyForm.email} onChange={(e) => setComp('email', e.target.value)} />
            <FormInput label="GSTIN" id="gstin" value={companyForm.gstin} onChange={(e) => setComp('gstin', e.target.value.toUpperCase())} />
            <div className="flex justify-end pt-2">
              <button type="submit" className="btn-primary">Save Company Info</button>
            </div>
          </form>
        </div>

        {/* Operational Settings */}
        <div className="card">
          <div className="card-header"><h3 className="text-sm font-semibold">Operational Settings</h3></div>
          <form onSubmit={handleSaveOp} className="card-body space-y-4">
            <FormInput
              label="Low Stock Threshold (units)"
              id="lst"
              type="number"
              min="0"
              value={opForm.lowStockThreshold}
              onChange={(e) => setOp('lowStockThreshold', e.target.value)}
              hint="Alert when available stock drops below this level"
            />
            <SelectInput
              label="Default Session"
              id="dsession"
              value={opForm.defaultSession}
              onChange={(e) => setOp('defaultSession', e.target.value)}
            >
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
            </SelectInput>
            <SelectInput
              label="Financial Year"
              id="fy"
              value={opForm.financialYear}
              onChange={(e) => setOp('financialYear', e.target.value)}
            >
              <option value="2025-26">2025-26</option>
              <option value="2026-27">2026-27</option>
            </SelectInput>
            <FormInput
              label="Credit Warning (days)"
              id="cwd"
              type="number"
              min="0"
              value={opForm.creditWarningDays}
              onChange={(e) => setOp('creditWarningDays', e.target.value)}
              hint="Warn when credit outstanding exceeds this many days"
            />
            <div className="flex justify-end pt-2">
              <button type="submit" className="btn-primary">Save Settings</button>
            </div>
          </form>
        </div>

        {/* API Integration */}
        <div className="card">
          <div className="card-header"><h3 className="text-sm font-semibold">Backend Integration</h3></div>
          <div className="card-body space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <div>
                <p className="text-xs font-medium text-gray-700">API Base URL</p>
                <p className="text-xs text-gray-400 font-mono">http://localhost:8000/api/v1</p>
              </div>
              <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full font-medium">Not Connected</span>
            </div>
            <p className="text-xs text-gray-400">Set <code className="bg-gray-100 px-1 py-0.5 rounded">VITE_API_BASE_URL</code> in <code className="bg-gray-100 px-1 py-0.5 rounded">.env</code> to connect to your FastAPI backend.</p>
            <button className="btn-secondary btn-sm">Test Connection</button>
          </div>
        </div>
      </div>
    </div>
  );
}
