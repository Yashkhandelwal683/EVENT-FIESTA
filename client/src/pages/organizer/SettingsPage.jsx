import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cog6ToothIcon, UserCircleIcon, BellIcon, ShieldCheckIcon,
  PaintBrushIcon, LinkIcon,
} from '@heroicons/react/24/outline';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const tabs = [
  { id: 'profile', label: 'Profile', icon: UserCircleIcon },
  { id: 'notifications', label: 'Notifications', icon: BellIcon },
  { id: 'appearance', label: 'Appearance', icon: PaintBrushIcon },
  { id: 'integrations', label: 'Integrations', icon: LinkIcon },
  { id: 'security', label: 'Security', icon: ShieldCheckIcon },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Settings</h1>
        <p className="text-zinc-400 text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Side tabs */}
        <div className="lg:w-48 flex-shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-violet-500/15 text-violet-300' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]'
              }`}
            >
              <tab.icon className="w-4.5 h-4.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <motion.div variants={item} className="space-y-4">
              <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', value: 'Yash Khandelwal' },
                    { label: 'Email', value: 'yash@example.com' },
                    { label: 'Phone', value: '+91 98765 43210' },
                    { label: 'Organization', value: 'Event Fiesta Pro' },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="text-xs text-zinc-500 block mb-1.5">{f.label}</label>
                      <input type="text" defaultValue={f.value}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.05] transition-all"
                      />
                    </div>
                  ))}
                </div>
                <button className="mt-4 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-600/20">Save Changes</button>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Notification Preferences</h3>
              {[
                { label: 'New Registrations', desc: 'When someone registers for your event' },
                { label: 'Cancellations', desc: 'When a booking is cancelled' },
                { label: 'Refund Requests', desc: 'When an attendee requests a refund' },
                { label: 'Payment Received', desc: 'When a payment is successfully processed' },
                { label: 'Check-In Alerts', desc: 'When an attendee checks in or out' },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                  <div>
                    <p className="text-sm text-white">{n.label}</p>
                    <p className="text-xs text-zinc-500">{n.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 rounded-full bg-zinc-700 peer-checked:bg-violet-600 peer-focus:ring-2 peer-focus:ring-violet-500/30 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                  </label>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Appearance</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-500 block mb-2">Theme</label>
                  <div className="flex items-center gap-3">
                    {['Dark', 'Light', 'System'].map((t) => (
                      <button key={t} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${t === 'Dark' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'bg-white/[0.03] text-zinc-400 border border-white/[0.06] hover:text-zinc-200'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-2">Accent Color</label>
                  <div className="flex items-center gap-3">
                    {['violet', 'emerald', 'rose', 'amber', 'cyan', 'fuchsia'].map((c) => (
                      <button key={c} className={`w-8 h-8 rounded-full border-2 transition-all ${c === 'violet' ? 'border-white bg-violet-500' : 'border-transparent bg-${c}-500 hover:scale-110'}`}
                        style={{ backgroundColor: c === 'violet' ? '#7c3aed' : c === 'emerald' ? '#10b981' : c === 'rose' ? '#f43f5e' : c === 'amber' ? '#f59e0b' : c === 'cyan' ? '#06b6d4' : '#d946ef' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'integrations' && (
            <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Integrations</h3>
              <p className="text-zinc-500 text-xs">Connect your account with third-party services. Available soon.</p>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Security</h3>
              <div className="space-y-4">
                {[
                  { label: 'Change Password', desc: 'Update your account password' },
                  { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security' },
                  { label: 'Active Sessions', desc: 'Manage your logged-in devices' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                    <div>
                      <p className="text-sm text-white">{s.label}</p>
                      <p className="text-xs text-zinc-500">{s.desc}</p>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-200 text-xs font-medium hover:bg-white/[0.06] transition-all">Manage</button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
