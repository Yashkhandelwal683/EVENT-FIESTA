import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axiosClient from '../../api/axiosClient';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-slate-900/95 border border-white/[0.1] px-4 py-3 shadow-2xl backdrop-blur-sm">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-lg font-black text-white tabular-nums">₹{payload[0].value?.toLocaleString('en-IN')}</p>
    </div>
  );
}

export default function AdminRevenueChart({ stats }) {
  const [period, setPeriod] = useState('monthly');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    axiosClient.get('/api/admin/revenue')
      .then(({ data }) => {
        if (cancelled) return;
        const rev = data?.data ?? data;
        const monthly = rev?.monthlyRevenue || [];
        setChartData(monthly.map(m => ({ name: m.month, revenue: m.revenue || 0 })));
      })
      .catch(() => {
        if (cancelled) return;
        setChartData([]);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10">
            <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Revenue</h2>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, color: 'text-emerald-400' },
            { label: 'Commission', value: `₹${(stats?.totalCommission || 0).toLocaleString('en-IN')}`, color: 'text-blue-400' },
            { label: 'Today', value: `₹${(stats?.todayRevenue || 0).toLocaleString('en-IN')}`, color: 'text-cyan-400' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className={`text-lg font-black ${s.color} tabular-nums`}>{s.value}</p>
              <p className="text-[10px] text-slate-600 uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="h-48">
          {loading ? (
            <div className="flex items-center justify-center h-full text-xs text-slate-500">Loading chart...</div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-xs text-slate-500">No revenue data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#adminRevenueGrad)" dot={false} activeDot={{ r: 5, fill: '#3b82f6', stroke: '#0a0a0f', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </motion.div>
  );
}
