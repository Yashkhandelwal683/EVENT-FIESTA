import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-slate-900/95 border border-white/[0.1] px-4 py-3 shadow-2xl backdrop-blur-sm">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-lg font-black text-white tabular-nums">₹{payload[0].value?.toLocaleString('en-IN')}</p>
    </div>
  );
}

export default function RevenueChart({ revenue = {}, events = [] }) {
  const [period, setPeriod] = useState('monthly');

  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const currentMonth = now.getMonth();

    return Array.from({ length: 6 }, (_, i) => {
      const monthIdx = (currentMonth - 5 + i + 12) % 12;
      const isCurrent = i === 5;
      return {
        name: months[monthIdx],
        revenue: isCurrent ? (revenue.total || 0) : 0,
        tickets: isCurrent ? Math.floor((revenue.total || 0) * 0.8) : 0,
      };
    });
  }, [revenue.total]);

  const totalRevenue = revenue.total || 0;
  const earnings = revenue.earnings || 0;
  const commission = revenue.commission || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Revenue</h2>
        </div>
        <div className="flex items-center gap-1 bg-white/[0.03] rounded-xl p-0.5 border border-white/[0.06]">
          {['weekly', 'monthly', 'yearly'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold capitalize transition-all ${
                period === p
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/20'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: 'text-emerald-400' },
            { label: 'Your Earnings', value: `₹${earnings.toLocaleString('en-IN')}`, color: 'text-violet-400' },
            { label: 'Commission', value: `₹${commission.toLocaleString('en-IN')}`, color: 'text-rose-400' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className={`text-lg font-black ${s.color} tabular-nums`}>{s.value}</p>
              <p className="text-[10px] text-slate-600 uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#7c3aed"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                dot={false}
                activeDot={{ r: 5, fill: '#7c3aed', stroke: '#0a0a0f', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
