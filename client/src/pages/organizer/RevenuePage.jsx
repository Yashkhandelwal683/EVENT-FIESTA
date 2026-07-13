import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGetRevenueQuery } from '../../features/organizer/organizerApi';
import {
  CurrencyDollarIcon, ArrowTrendingUpIcon, ClockIcon,
  BanknotesIcon, ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function RevenuePage() {
  const [period, setPeriod] = useState('monthly');
  const { data } = useGetRevenueQuery(period);
  const d = data?.data || {};

  const totals = d.totals || {};
  const revenueData = d.data || [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Revenue</h1>
          <p className="text-zinc-400 text-sm mt-1">Track your earnings and financial performance</p>
        </div>
        <div className="flex items-center gap-2">
          {['daily', 'weekly', 'monthly'].map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                period === p ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'bg-white/[0.03] text-zinc-400 border border-white/[0.06] hover:text-zinc-200'
              }`}
            >
              {p}
            </button>
          ))}
          <button className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-400 text-xs hover:text-zinc-200 transition-all">
            <ArrowDownTrayIcon className="w-3.5 h-3.5 inline mr-1" /> Export
          </button>
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: "Today's Revenue", value: `₹${(revenueData[revenueData.length - 1]?.revenue || 0).toLocaleString('en-IN')}`, icon: ClockIcon, color: 'text-cyan-400' },
          { label: 'Total Revenue', value: `₹${(totals.total || 0).toLocaleString('en-IN')}`, icon: CurrencyDollarIcon, color: 'text-emerald-400' },
          { label: 'Your Earnings', value: `₹${(totals.earnings || 0).toLocaleString('en-IN')}`, icon: BanknotesIcon, color: 'text-violet-400' },
          { label: 'Commission', value: `₹${(totals.commission || 0).toLocaleString('en-IN')}`, icon: ArrowTrendingUpIcon, color: 'text-amber-400' },
          { label: 'Pending Payout', value: `₹${(d.pendingPayout || 0).toLocaleString('en-IN')}`, icon: ClockIcon, color: 'text-orange-400' },
          { label: 'Transactions', value: totals.count || 0, icon: CurrencyDollarIcon, color: 'text-blue-400' },
          { label: 'Refunds', value: `₹${(d.refunds?.total || 0).toLocaleString('en-IN')}`, icon: CurrencyDollarIcon, color: 'text-red-400' },
        ].map((s) => (
          <motion.div key={s.label} variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-xs text-zinc-500">{s.label}</span>
            </div>
            <p className={`text-lg font-bold font-display ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-400" /> Revenue Over Time ({period})
        </h3>
        <div className="h-64 flex items-end gap-2">
          {revenueData.length === 0 && (
            <p className="text-zinc-500 text-sm w-full text-center py-12">No revenue data yet</p>
          )}
          {revenueData.map((d, i) => {
            const all = revenueData.map((r) => r.revenue || 0);
            const max = Math.max(...all, 1);
            const h = ((d.revenue || 0) / max) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-800 px-2 py-1 rounded-lg text-[10px] text-white opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity z-10 shadow-lg">
                  ₹{(d.revenue || 0).toLocaleString('en-IN')}
                </div>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all duration-300 cursor-pointer"
                  style={{ height: `${Math.max(h, 1)}%` }}
                />
                <span className="text-[9px] text-zinc-600 mt-1">
                  {period === 'daily' ? d._id?.day || '' : period === 'weekly' ? `W${d._id?.week || ''}` : `${d._id?.month || ''}/${d._id?.year || ''}`}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Transaction History placeholder */}
      <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Transaction History</h3>
          <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors">View all</button>
        </div>
        <p className="text-zinc-500 text-xs text-center py-8">Transaction history will appear here as payments are processed.</p>
      </motion.div>
    </motion.div>
  );
}
