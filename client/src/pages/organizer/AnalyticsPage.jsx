import { motion } from 'framer-motion';
import { useGetAnalyticsQuery, useGetRevenueQuery } from '../../features/organizer/organizerApi';
import {
  ChartBarIcon, CurrencyDollarIcon, TicketIcon, UsersIcon,
  ArrowTrendingUpIcon, ClockIcon,
} from '@heroicons/react/24/outline';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

function MiniBar({ data, color = 'bg-violet-500', height = 60 }) {
  if (!data || data.length === 0) return <div className="text-zinc-500 text-xs text-center py-8">No data yet</div>;
  const max = Math.max(...data.map((d) => d.revenue || d.tickets || d.count || 0), 1);
  return (
    <div className="flex items-end gap-1 h-full">
      {data.slice(-12).map((d, i) => {
        const val = d.revenue || d.tickets || d.count || 0;
        const h = (val / max) * height;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-zinc-800 px-1.5 py-0.5 rounded text-[9px] text-white opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
              {val.toLocaleString()}
            </div>
            <div className={`w-full rounded-t ${color} transition-all duration-300`} style={{ height: Math.max(h, 2) }} />
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsPage() {
  const { data: analyticsData } = useGetAnalyticsQuery();
  const { data: revenueData } = useGetRevenueQuery('monthly');
  const a = analyticsData?.data || {};

  const totalRevenue = revenueData?.data?.totals?.total || 0;
  const totalTickets = a.ticketChart?.reduce((s, d) => s + (d.tickets || 0), 0) || 0;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Analytics</h1>
        <p className="text-zinc-400 text-sm mt-1">Comprehensive insights into your events performance</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: CurrencyDollarIcon, color: 'text-emerald-400' },
          { label: 'Total Tickets', value: totalTickets.toLocaleString(), icon: TicketIcon, color: 'text-rose-400' },
          { label: 'Conversion Rate', value: `${a.conversionRate || 0}%`, icon: ArrowTrendingUpIcon, color: 'text-cyan-400' },
          { label: 'Categories', value: a.categoryDistribution?.length || 0, icon: ChartBarIcon, color: 'text-violet-400' },
        ].map((s) => (
          <motion.div key={s.label} variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-xs text-zinc-500">{s.label}</span>
            </div>
            <p className={`text-xl font-bold font-display ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Chart */}
        <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <CurrencyDollarIcon className="w-4 h-4 text-emerald-400" /> Revenue Trend
          </h3>
          <div className="h-60">
            <MiniBar data={a.revenueChart || []} color="bg-emerald-500" />
          </div>
        </motion.div>

        {/* Ticket Sales */}
        <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <TicketIcon className="w-4 h-4 text-rose-400" /> Ticket Sales
          </h3>
          <div className="h-60">
            <MiniBar data={a.ticketChart || []} color="bg-rose-500" />
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <ChartBarIcon className="w-4 h-4 text-violet-400" /> Category Distribution
          </h3>
          <div className="space-y-3">
            {(a.categoryDistribution || []).slice(0, 8).map((cat) => {
              const total = a.categoryDistribution?.reduce((s, c) => s + (c.count || 0), 1) || 1;
              const pct = ((cat.count || 0) / total) * 100;
              return (
                <div key={cat._id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-zinc-300">{cat._id || 'Uncategorized'}</span>
                    <span className="text-zinc-500">{cat.count} ({Math.round(pct)}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {(!a.categoryDistribution || a.categoryDistribution.length === 0) && (
              <p className="text-zinc-500 text-xs text-center py-4">No categories yet</p>
            )}
          </div>
        </motion.div>

        {/* Top Events */}
        <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <ArrowTrendingUpIcon className="w-4 h-4 text-amber-400" /> Top Performing Events
          </h3>
          <div className="space-y-3">
            {(a.topEvents || []).slice(0, 6).map((ev, i) => {
              const maxTickets = Math.max(...(a.topEvents || []).map((e) => e.tickets || 0), 1);
              const barWidth = ((ev.tickets || 0) / maxTickets) * 100;
              return (
                <div key={ev._id || i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-zinc-300 truncate flex-1">{ev.title || 'Unknown'}</span>
                    <span className="text-zinc-500 ml-2">{ev.tickets || 0} tix</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${barWidth}%` }} />
                  </div>
                </div>
              );
            })}
            {(!a.topEvents || a.topEvents.length === 0) && (
              <p className="text-zinc-500 text-xs text-center py-4">No events yet</p>
            )}
          </div>
        </motion.div>

        {/* Hourly Bookings */}
        <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <ClockIcon className="w-4 h-4 text-cyan-400" /> Peak Booking Hours
          </h3>
          <div className="h-60">
            <MiniBar data={a.hourlyBookings || []} color="bg-cyan-500" />
          </div>
        </motion.div>

        {/* Monthly Growth */}
        <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <ArrowTrendingUpIcon className="w-4 h-4 text-fuchsia-400" /> Monthly Growth
          </h3>
          <div className="h-60">
            <MiniBar data={a.monthlyGrowth || []} color="bg-fuchsia-500" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
