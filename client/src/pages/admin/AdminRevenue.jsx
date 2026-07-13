import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CurrencyRupeeIcon } from '@heroicons/react/24/outline';
import axiosClient from '../../api/axiosClient';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function AdminRevenue() {
  const [stats, setStats] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axiosClient.get('/api/admin/stats'),
      axiosClient.get('/api/admin/revenue'),
    ])
      .then(([statsRes, revenueRes]) => {
        setStats(statsRes.data?.data ?? statsRes.data);
        const revData = revenueRes.data?.data ?? revenueRes.data;
        setMonthlyData(revData?.monthlyRevenue ?? []);
        setRecentTransactions(revData?.recentTransactions ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const statCards = [
    { label: 'Total Revenue', value: stats?.totalRevenue, color: 'text-emerald-400' },
    { label: 'Platform Commission', value: stats?.totalCommission, color: 'text-amber-400' },
    { label: 'Organizer Payouts', value: stats?.organizerEarnings, color: 'text-violet-400' },
    { label: 'Today Revenue', value: stats?.todayRevenue, color: 'text-cyan-400' },
    { label: 'Pending Payouts', value: stats?.pendingPayout, color: 'text-rose-400' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <motion.div variants={item}>
        <h1 className="page-title">Revenue Dashboard</h1>
        <p className="page-subtitle">Track platform earnings, commissions, and payouts</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((c) => (
          <div key={c.label} className="glass rounded-2xl p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">{c.label}</span>
              <CurrencyRupeeIcon className={`w-4 h-4 ${c.color}`} />
            </div>
            <p className="text-xl font-bold text-white font-display tabular-nums">
              ₹{typeof c.value === 'number' ? c.value.toLocaleString('en-IN') : (c.value ?? '—')}
            </p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={item} className="glass rounded-2xl p-5">
        <h2 className="text-base font-semibold text-white mb-4">Monthly Revenue & Commission</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1c1c2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 13 }}
                labelStyle={{ color: '#e4e4e7' }}
              />
              <Bar dataKey="revenue" name="Revenue" fill="#22c55e" radius={[6, 6, 0, 0]} />
              <Bar dataKey="commission" name="Commission" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div variants={item} className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Recent Transactions</h2>
          <button onClick={() => toast('Report generation coming soon')} className="btn btn-primary text-sm">
            Generate Report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-surface-border text-slate-400">
                <th className="px-4 py-3 font-medium">Transaction</th>
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">User</th>
                <th className="px-4 py-3 font-medium text-right">Amount</th>
                <th className="px-4 py-3 font-medium text-right hidden sm:table-cell">Commission</th>
                <th className="px-4 py-3 font-medium text-right hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">No transactions yet</td>
                </tr>
              ) : recentTransactions.map((txn) => (
                <tr key={txn.id} className="border-b border-surface-border/50 hover:bg-white/3">
                  <td className="px-4 py-3 font-medium text-white">{txn.id}</td>
                  <td className="px-4 py-3 text-slate-300">{txn.event}</td>
                  <td className="px-4 py-3 text-slate-300 hidden sm:table-cell">{txn.user}</td>
                  <td className="px-4 py-3 text-right text-slate-200 tabular-nums">₹{txn.amount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right text-slate-400 tabular-nums hidden sm:table-cell">₹{txn.commission.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right text-slate-500 hidden md:table-cell">{txn.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
