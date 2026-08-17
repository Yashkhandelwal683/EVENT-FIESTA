import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import axiosClient from '../../api/axiosClient';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';
import {
  BuildingOfficeIcon, EnvelopeIcon, LinkIcon, BanknotesIcon, ShieldCheckIcon,
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

const emptyForm = {
  organizationName: '', organizationType: '', gstNumber: '', website: '', aboutOrganization: '',
  phone: '', address: '', city: '', state: '', country: '',
  social: { facebook: '', instagram: '', twitter: '', linkedin: '', youtube: '' },
  bank: { accountHolder: '', bankName: '', accountNumber: '', ifsc: '', upi: '', accountType: '' },
};

const inputCls =
  'w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/40 transition-all';

export default function ProfilePage() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('org');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  // Load the full profile (server returns fresh data via no-store cache headers)
  useEffect(() => {
    let cancelled = false;
    axiosClient
      .get('/api/users/profile', { headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' } })
      .then(({ data }) => {
        if (cancelled) return;
        const raw = data?.data ?? data;
        setForm({
          organizationName: raw.organizationName || '',
          organizationType: raw.organizationType || '',
          gstNumber: raw.gstNumber || '',
          website: raw.website || '',
          aboutOrganization: raw.aboutOrganization || '',
          phone: raw.phone || '',
          address: raw.address || '',
          city: raw.city || '',
          state: raw.state || '',
          country: raw.country || '',
          social: {
            facebook: raw.social?.facebook || '',
            instagram: raw.social?.instagram || '',
            twitter: raw.social?.twitter || '',
            linkedin: raw.social?.linkedin || '',
            youtube: raw.social?.youtube || '',
          },
          bank: {
            accountHolder: raw.bank?.accountHolder || '',
            bankName: raw.bank?.bankName || '',
            accountNumber: raw.bank?.accountNumber || '',
            ifsc: raw.bank?.ifsc || '',
            upi: raw.bank?.upi || '',
            accountType: raw.bank?.accountType || '',
          },
        });
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setNested = (group, key, value) =>
    setForm((f) => ({ ...f, [group]: { ...f[group], [key]: value } }));

  const saveTab = async (tab) => {
    setSaving(true);
    try {
      let payload = {};
      if (tab === 'org') {
        payload = {
          organizationName: form.organizationName,
          organizationType: form.organizationType,
          gstNumber: form.gstNumber,
          website: form.website,
          aboutOrganization: form.aboutOrganization,
        };
      } else if (tab === 'contact') {
        payload = {
          phone: form.phone, address: form.address, city: form.city,
          state: form.state, country: form.country,
        };
      } else if (tab === 'social') {
        payload = { social: form.social };
      } else if (tab === 'bank') {
        payload = { bank: form.bank };
      }

      const { data } = await axiosClient.patch('/api/users/profile', payload, {
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      });
      const raw = data?.data ?? data;

      dispatch(setCredentials({
        user: {
          id: raw._id ?? raw.id,
          name: raw.name, email: raw.email, role: raw.role,
          avatar: raw.avatar ?? null, phone: raw.phone ?? '', bio: raw.bio ?? '',
          organizationName: raw.organizationName, organizationType: raw.organizationType,
          gstNumber: raw.gstNumber, website: raw.website, aboutOrganization: raw.aboutOrganization,
          city: raw.city, address: raw.address, state: raw.state, country: raw.country,
          social: raw.social, bank: raw.bank,
        },
      }));

      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const field = (label, value, onChange, placeholder, type = 'text') => (
    <div>
      <label className="text-xs text-zinc-500 block mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </div>
  );

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

      {loading && (
        <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-10 text-center text-sm text-zinc-500">
          Loading profile…
        </div>
      )}

      {!loading && (
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
                  {field('Organization Name', form.organizationName, (v) => setField('organizationName', v), 'Acme Events Inc.')}
                  {field('Organization Type', form.organizationType, (v) => setField('organizationType', v), 'Pvt Ltd / NGO / Individual')}
                  {field('GST Number', form.gstNumber, (v) => setField('gstNumber', v), 'GSTIN123456')}
                  {field('Website', form.website, (v) => setField('website', v), 'https://example.com', 'url')}
                </div>
                <div>
                  <label className="text-xs text-zinc-500 block mb-1.5">About Organization</label>
                  <textarea
                    rows={3}
                    value={form.aboutOrganization}
                    placeholder="Short description of your organization…"
                    onChange={(e) => setField('aboutOrganization', e.target.value)}
                    className={`${inputCls} resize-none`}
                  />
                </div>
                <button
                  disabled={saving}
                  onClick={() => saveTab('org')}
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium transition-all shadow-lg shadow-violet-600/20"
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </motion.div>
            )}

            {activeTab === 'contact' && (
              <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {field('Email', user?.email || '', () => {}, 'you@example.com', 'email')}
                  {field('Phone', form.phone, (v) => setField('phone', v), '+91 98765 43210', 'tel')}
                  {field('Address', form.address, (v) => setField('address', v), '123, Main Street')}
                  {field('City', form.city, (v) => setField('city', v), 'Mumbai')}
                  {field('State', form.state, (v) => setField('state', v), 'Maharashtra')}
                  {field('Country', form.country, (v) => setField('country', v), 'India')}
                </div>
                <button
                  disabled={saving}
                  onClick={() => saveTab('contact')}
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium transition-all shadow-lg shadow-violet-600/20"
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </motion.div>
            )}

            {activeTab === 'social' && (
              <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">Social Links</h3>
                <div className="space-y-3">
                  {field('Facebook', form.social.facebook, (v) => setNested('social', 'facebook', v), 'https://facebook.com/...', 'url')}
                  {field('Instagram', form.social.instagram, (v) => setNested('social', 'instagram', v), 'https://instagram.com/...', 'url')}
                  {field('Twitter / X', form.social.twitter, (v) => setNested('social', 'twitter', v), 'https://twitter.com/...', 'url')}
                  {field('LinkedIn', form.social.linkedin, (v) => setNested('social', 'linkedin', v), 'https://linkedin.com/...', 'url')}
                  {field('YouTube', form.social.youtube, (v) => setNested('social', 'youtube', v), 'https://youtube.com/...', 'url')}
                </div>
                <button
                  disabled={saving}
                  onClick={() => saveTab('social')}
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium transition-all shadow-lg shadow-violet-600/20"
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </motion.div>
            )}

            {activeTab === 'bank' && (
              <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">Bank Details</h3>
                <p className="text-xs text-zinc-500">Your earnings will be settled to the account below.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {field('Account Holder Name', form.bank.accountHolder, (v) => setNested('bank', 'accountHolder', v), 'John Doe')}
                  {field('Bank Name', form.bank.bankName, (v) => setNested('bank', 'bankName', v), 'State Bank of India')}
                  {field('Account Number', form.bank.accountNumber, (v) => setNested('bank', 'accountNumber', v), '1234567890')}
                  {field('IFSC Code', form.bank.ifsc, (v) => setNested('bank', 'ifsc', v), 'SBIN0001234')}
                  {field('UPI ID', form.bank.upi, (v) => setNested('bank', 'upi', v), 'john@upi')}
                  {field('Account Type', form.bank.accountType, (v) => setNested('bank', 'accountType', v), 'Savings / Current')}
                </div>
                <button
                  disabled={saving}
                  onClick={() => saveTab('bank')}
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium transition-all shadow-lg shadow-violet-600/20"
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
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
      )}
    </motion.div>
  );
}
