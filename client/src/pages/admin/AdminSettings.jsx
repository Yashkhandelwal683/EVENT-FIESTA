import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cog6ToothIcon, KeyIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const sessionOptions = [
  { value: '30m', label: '30 minutes' },
  { value: '1h', label: '1 hour' },
  { value: '2h', label: '2 hours' },
  { value: '4h', label: '4 hours' },
  { value: 'never', label: 'Never' },
];

function Toggle({ enabled, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
          enabled ? 'bg-primary-500' : 'bg-white/10'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

export default function AdminSettings() {
  const [commissionPct, setCommissionPct] = useState(10);
  const [minPayout, setMinPayout] = useState(500);
  const [allowRegistrations, setAllowRegistrations] = useState(true);
  const [allowOrganizerApps, setAllowOrganizerApps] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('1h');

  const handleSaveCommission = () => {
    toast.success('Settings saved');
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <motion.div variants={item}>
        <h1 className="page-title">Platform Settings</h1>
        <p className="page-subtitle">Configure platform-wide settings</p>
      </motion.div>

      <motion.div variants={item} className="glass rounded-2xl p-5 space-y-5">
        <div className="flex items-center gap-2.5">
          <Cog6ToothIcon className="w-5 h-5 text-primary-400" />
          <h2 className="text-base font-semibold text-white">Commission Settings</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Commission Percentage (%)</label>
            <input
              type="number"
              className="input"
              value={commissionPct}
              onChange={(e) => setCommissionPct(Number(e.target.value))}
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="label">Minimum Payout Amount (₹)</label>
            <input
              type="number"
              className="input"
              value={minPayout}
              onChange={(e) => setMinPayout(Number(e.target.value))}
              min="0"
            />
          </div>
        </div>
        <button onClick={handleSaveCommission} className="btn btn-primary">
          Save
        </button>
      </motion.div>

      <motion.div variants={item} className="glass rounded-2xl p-5 space-y-1">
        <div className="flex items-center gap-2.5 pb-2">
          <Cog6ToothIcon className="w-5 h-5 text-primary-400" />
          <h2 className="text-base font-semibold text-white">Platform Configuration</h2>
        </div>
        <Toggle
          enabled={allowRegistrations}
          onChange={() => { setAllowRegistrations(!allowRegistrations); toast('Registration setting updated'); }}
          label="Allow New Registrations"
          description="Enable self-registration for new users"
        />
        <div className="border-t border-white/5" />
        <Toggle
          enabled={allowOrganizerApps}
          onChange={() => { setAllowOrganizerApps(!allowOrganizerApps); toast('Organizer applications setting updated'); }}
          label="Allow Organizer Applications"
          description="Let users apply to become organizers"
        />
        <div className="border-t border-white/5" />
        <Toggle
          enabled={maintenanceMode}
          onChange={() => { setMaintenanceMode(!maintenanceMode); toast('Maintenance mode toggled'); }}
          label="Maintenance Mode"
          description="Restrict access to admins only"
        />
      </motion.div>

      <motion.div variants={item} className="glass rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheckIcon className="w-5 h-5 text-primary-400" />
          <h2 className="text-base font-semibold text-white">Security</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/[0.03] rounded-xl p-4 space-y-3 border border-white/[0.06]">
            <KeyIcon className="w-7 h-7 text-amber-400" />
            <div>
              <p className="text-sm font-medium text-white">Change Admin Password</p>
              <p className="text-xs text-slate-400 mt-0.5">Update your account password</p>
            </div>
            <button
              onClick={() => toast('Password change coming soon')}
              className="btn btn-secondary text-sm"
            >
              Change Password
            </button>
          </div>
          <div className="bg-white/[0.03] rounded-xl p-4 space-y-3 border border-white/[0.06]">
            <ShieldCheckIcon className="w-7 h-7 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
              <p className="text-xs text-slate-400 mt-0.5">Add an extra layer of security</p>
            </div>
            <Toggle
              enabled={twoFactor}
              onChange={() => { setTwoFactor(!twoFactor); toast('2FA setup coming soon'); }}
              label=""
              description=""
            />
          </div>
          <div className="bg-white/[0.03] rounded-xl p-4 space-y-3 border border-white/[0.06]">
            <Cog6ToothIcon className="w-7 h-7 text-cyan-400" />
            <div>
              <p className="text-sm font-medium text-white">Session Timeout</p>
              <p className="text-xs text-slate-400 mt-0.5">Auto-logout idle sessions</p>
            </div>
            <select
              className="input"
              value={sessionTimeout}
              onChange={(e) => { setSessionTimeout(e.target.value); toast('Session timeout updated'); }}
            >
              {sessionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
