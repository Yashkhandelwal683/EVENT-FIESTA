import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import {
  UserCircleIcon, BuildingOfficeIcon, EnvelopeIcon, PhoneIcon,
  GlobeAltIcon, LinkIcon, CurrencyDollarIcon, BanknotesIcon,
  ShieldCheckIcon, KeyIcon,
} from '@heroicons/react/24/outline';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const tabs = [
  { id: 'org', label: 'Organization', icon: BuildingOfficeIcon },
  { id: 'contact', label: 'Contact', icon: EnvelopeIcon },
  { id: 'social', label: 'Social Links', icon: LinkIcon },
  { id: 'bank', label: 'Bank Details', icon: BanknotesIcon },
  { id: 'security', label: 'Security', icon: ShieldCheckIcon },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('org');

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Organizer Profile</h1>
        <p className="text-zinc-400 text-sm mt-1">Manage your organization and personal information</p>
      </div>

      {/* Profile Header */}
      <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-gradient-to-br from-violet-500/10 to-transparent p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-violet-500/20">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">{user?.name || 'Organizer'}</h2>
          <p className="text-sm text-zinc-400">{user?.email || ''}</p>
          <p className="text-xs text-zinc-500 mt-1 capitalize">Role: {user?.role || 'organizer'}</p>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-44 flex-shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-violet-500/15 text-violet-300' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]'
              }`}
            ><tab.icon className="w-4.5 h-4.5" /> {tab.label}</button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {activeTab === 'org' && (
            <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Organization Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Organization Name', placeholder: 'Acme Events Inc.' },
                  { label: 'GST Number', placeholder: 'GSTIN123456' },
                  { label: 'Website', placeholder: 'https://example.com' },
                  { label: 'Default Currency', placeholder: 'INR' },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-xs text-zinc-500 block mb-1.5">{f.label}</label>
                    <input type="text" placeholder={f.placeholder}
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/40 transition-all"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1.5">Organization Banner</label>
                <div className="h-32 rounded-xl border-2 border-dashed border-white/[0.06] bg-white/[0.02] flex items-center justify-center">
                  <p className="text-xs text-zinc-500">Click to upload banner image</p>
                </div>
              </div>
              <button className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-600/20">Save Changes</button>
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Email', placeholder: user?.email || 'you@example.com' },
                  { label: 'Phone', placeholder: '+91 98765 43210' },
                  { label: 'Address', placeholder: '123, Main Street' },
                  { label: 'City', placeholder: 'Mumbai' },
                  { label: 'State', placeholder: 'Maharashtra' },
                  { label: 'Country', placeholder: 'India' },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-xs text-zinc-500 block mb-1.5">{f.label}</label>
                    <input type="text" placeholder={f.placeholder}
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/40 transition-all"
                    />
                  </div>
                ))}
              </div>
              <button className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-600/20">Save Changes</button>
            </motion.div>
          )}

          {activeTab === 'social' && (
            <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Social Links</h3>
              <div className="space-y-3">
                {[
                  { label: 'Facebook', placeholder: 'https://facebook.com/...' },
                  { label: 'Instagram', placeholder: 'https://instagram.com/...' },
                  { label: 'Twitter / X', placeholder: 'https://twitter.com/...' },
                  { label: 'LinkedIn', placeholder: 'https://linkedin.com/...' },
                  { label: 'YouTube', placeholder: 'https://youtube.com/...' },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-xs text-zinc-500 block mb-1.5">{f.label}</label>
                    <input type="url" placeholder={f.placeholder}
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/40 transition-all"
                    />
                  </div>
                ))}
              </div>
              <button className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-600/20">Save Changes</button>
            </motion.div>
          )}

          {activeTab === 'bank' && (
            <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Bank Details</h3>
              <p className="text-xs text-zinc-500">Your earnings will be settled to the account below.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Account Holder Name', placeholder: 'John Doe' },
                  { label: 'Bank Name', placeholder: 'State Bank of India' },
                  { label: 'Account Number', placeholder: '1234567890' },
                  { label: 'IFSC Code', placeholder: 'SBIN0001234' },
                  { label: 'UPI ID', placeholder: 'john@upi' },
                  { label: 'Account Type', placeholder: 'Savings / Current' },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-xs text-zinc-500 block mb-1.5">{f.label}</label>
                    <input type="text" placeholder={f.placeholder}
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/40 transition-all"
                    />
                  </div>
                ))}
              </div>
              <button className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-600/20">Save Changes</button>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Security</h3>
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
