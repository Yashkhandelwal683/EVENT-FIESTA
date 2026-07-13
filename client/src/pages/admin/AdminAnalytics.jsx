import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UsersIcon, CalendarDaysIcon, TicketIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import axiosClient from '../../api/axiosClient';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const tooltipStyle = {
  background: '#1c1c2e',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12,
  fontSize: 13,
};

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          axiosClient.get('/api/admin/stats'),
          axiosClient.get('/api/admin/analytics'),
        ]);
        if (cancelled) return;
        setStats(statsRes.data?.data ?? statsRes.data);
        setAnalytics(analyticsRes.data?.data ?? analyticsRes.data);
      } catch {
        if (cancelled) return;
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: UsersIcon, color: 'text-blue-400' },
    { label: 'Total Events', value: stats?.totalEvents, icon: CalendarDaysIcon, color: 'text-primary-400' },
    { label: 'Total Bookings', value: stats?.totalBookings, icon: TicketIcon, color: 'text-violet-400' },
    { label: 'Total Revenue', value: stats?.totalRevenue, icon: CurrencyRupeeIcon, color: 'text-emerald-400', prefix: '₹' },
  ];

  const da = analytics || { monthlyRevenue: [], monthlyBookings: [], userGrowth: [], topEvents: [] };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <motion.div variants={item}>
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Platform-wide trends and insights</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((c) => (
          <div key={c.label} className="glass rounded-2xl p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">{c.label}</span>
              <c.icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <p className="text-xl font-bold text-white font-display tabular-nums">
              {c.prefix || ''}{typeof c.value === 'number' ? c.value.toLocaleString('en-IN') : (c.value ?? '—')}
            </p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">Monthly Revenue</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={da.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#e4e4e7' }} />
                <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">Monthly Bookings</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={da.monthlyBookings} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#e4e4e7' }} />
                <Bar dataKey="bookings" name="Bookings" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">User Growth</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={da.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#e4e4e7' }} />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="glass rounded-2xl p-5">
        <h2 className="text-base font-semibold text-white mb-4">Top Events</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-surface-border text-slate-400">
                <th className="px-4 py-3 font-medium">Event Name</th>
                <th className="px-4 py-3 font-medium">Organizer</th>
                <th className="px-4 py-3 font-medium text-right">Bookings</th>
                <th className="px-4 py-3 font-medium text-right">Revenue</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {da.topEvents.map((ev) => (
                <tr key={ev._id} className="border-b border-surface-border/50 hover:bg-white/3">
                  <td className="px-4 py-3 font-medium text-white">{ev.title}</td>
                  <td className="px-4 py-3 text-slate-300">{ev.organizer?.name || '—'}</td>
                  <td className="px-4 py-3 text-right text-slate-200 tabular-nums">{ev.bookings.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right text-slate-200 tabular-nums">₹{ev.revenue.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <Badge variant={ev.status === 'published' ? 'success' : ev.status === 'draft' ? 'warning' : 'neutral'}>
                      {ev.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
