import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Cog6ToothIcon, BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

function PaletteIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  );
}
import toast from 'react-hot-toast';

const SETTINGS_TABS = [
  { id: 'general', label: 'General', icon: Cog6ToothIcon },
  { id: 'notifications', label: 'Notifications', icon: BellIcon },
  { id: 'security', label: 'Security', icon: ShieldCheckIcon },
  { id: 'appearance', label: 'Appearance', icon: PaletteIcon },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  useState(true);

  const handleSave = () => {
    toast.success('Settings saved');
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-card/60 rounded-xl border border-surface-border/60 w-fit">
        {SETTINGS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-primary-600/20 text-primary-300 shadow-glow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="glass p-6 border-surface-border/60">
        {activeTab === 'general' && (
          <div className="space-y-5">
            <h2 className="font-display font-semibold text-white text-base">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Organization Name</label>
                <input type="text" defaultValue={user?.name || ''} className="input" placeholder="Your organization name" />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input type="email" defaultValue={user?.email || ''} className="input" placeholder="your@email.com" />
              </div>
              <div>
                <label className="label">Phone Number</label>
                <input type="tel" className="input" placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="label">Timezone</label>
                <select className="input">
                  <option>Asia/Kolkata (IST)</option>
                  <option>America/New_York (EST)</option>
                  <option>Europe/London (GMT)</option>
                  <option>Asia/Dubai (GST)</option>
                </select>
              </div>
            </div>
            <button onClick={handleSave} className="btn-md btn-primary">Save Changes</button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-5">
            <h2 className="font-display font-semibold text-white text-base">Notification Preferences</h2>
            <div className="space-y-4">
              {[
                { label: 'New bookings', desc: 'When someone books a ticket for your event' },
                { label: 'Cancellations', desc: 'When a booking is cancelled or refund requested' },
                { label: 'Reviews', desc: 'When someone leaves a review for your event' },
                { label: 'Payment updates', desc: 'When a payment succeeds or fails' },
                { label: 'Event reminders', desc: 'Reminders before your event starts' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-surface-border/40">
                  <div>
                    <p className="text-sm text-white">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-surface-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600" />
                  </label>
                </div>
              ))}
            </div>
            <button onClick={handleSave} className="btn-md btn-primary">Save Preferences</button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-5">
            <h2 className="font-display font-semibold text-white text-base">Security</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Current Password</label>
                <input type="password" className="input" placeholder="••••••••" />
              </div>
              <div>
                <label className="label">New Password</label>
                <input type="password" className="input" placeholder="Min 8 characters" />
              </div>
              <div>
                <label className="label">Confirm New Password</label>
                <input type="password" className="input" placeholder="Re-enter new password" />
              </div>
            </div>
            <button onClick={handleSave} className="btn-md btn-primary">Update Password</button>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-5">
            <h2 className="font-display font-semibold text-white text-base">Appearance</h2>
            <p className="text-sm text-slate-400">Dark mode is enabled by default for the best experience.</p>
            <div className="flex items-center gap-4 p-4 bg-surface-card/40 rounded-xl">
              <PaletteIcon className="w-6 h-6 text-primary-400" />
              <div>
                <p className="text-sm text-white">Dark Mode</p>
                <p className="text-xs text-slate-500">Currently active</p>
              </div>
              <div className="ml-auto px-3 py-1.5 bg-primary-600/20 rounded-lg text-primary-300 text-xs font-medium">Active</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
