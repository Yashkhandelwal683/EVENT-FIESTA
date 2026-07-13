import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyDollarIcon, TicketIcon, UsersIcon, CalendarDaysIcon,
  ArrowTrendingUpIcon, CheckCircleIcon, ClockIcon,
} from '@heroicons/react/24/outline';
import axiosClient from '../../api/axiosClient';

export default function DashboardPreview() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axiosClient.get('/api/admin/stats')
      .then(({ data }) => setStats(data?.data ?? data))
      .catch(() => {});
    axiosClient.get('/api/events')
      .then(({ data }) => {
        const raw = data?.data ?? data;
        setEvents((raw?.events ?? (Array.isArray(raw) ? raw : [])).slice(0, 3));
      })
      .catch(() => {});
  }, []);

  const statsCards = [
    { icon: CurrencyDollarIcon, label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, color: 'text-emerald-400', bg: 'from-emerald-500/10' },
    { icon: TicketIcon, label: 'Tickets Sold', value: (stats?.activeTickets || 0).toLocaleString('en-IN'), color: 'text-primary-400', bg: 'from-primary-500/10' },
    { icon: UsersIcon, label: 'Attendees', value: (stats?.totalAttendees || 0).toLocaleString('en-IN'), color: 'text-violet-400', bg: 'from-violet-500/10' },
    { icon: CalendarDaysIcon, label: 'Events', value: (stats?.totalEvents || 0).toString(), color: 'text-accent-400', bg: 'from-accent-500/10' },
  ];

  return (
    <section className="container-app mb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">
          Organizer Dashboard
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Powerful analytics and management tools at your fingertips
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass p-6 sm:p-8 border-surface-border/60"
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4 }}
              className={`bg-gradient-to-br ${stat.bg} to-surface-card rounded-xl border border-surface-border/60 p-4`}
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="font-display font-bold text-2xl text-white mb-0.5">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Events */}
          <div className="lg:col-span-3 glass-sm p-5 border-surface-border/60">
            <h3 className="font-display font-semibold text-white text-sm mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {events.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No events yet</p>
              ) : events.map((ev) => (
                <div key={ev._id} className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-card/40">
                  <div className="w-9 h-9 rounded-lg bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                    <CalendarDaysIcon className="w-4 h-4 text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{ev.title}</p>
                    <p className="text-xs text-slate-500">{new Date(ev.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Quick Stats */}
          <div className="glass-sm p-5 border-surface-border/60">
            <h3 className="font-display font-semibold text-white text-sm mb-4">Quick Summary</h3>
            <div className="space-y-4">
              {[
                { label: 'Total Bookings', value: (stats?.totalBookings || 0).toLocaleString('en-IN'), sub: `Today: ${stats?.todayBookings || 0}` },
                { label: 'Live Events', value: (stats?.liveEvents || 0).toString(), sub: `Draft: ${stats?.draftEvents || 0}` },
                { label: 'Total Organizers', value: (stats?.totalOrganizers || 0).toString(), sub: `Pending: ${stats?.pendingOrganizerRequests || 0}` },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-surface-card/40">
                  <div>
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="text-sm font-semibold text-white mt-0.5">{item.value}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    {item.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="glass-sm p-5 border-surface-border/60">
            <h3 className="font-display font-semibold text-white text-sm mb-4">Platform Overview</h3>
            <div className="space-y-4">
              {[
                { label: 'Platform Commission', value: `₹${(stats?.totalCommission || 0).toLocaleString('en-IN')}`, color: 'text-emerald-400' },
                { label: 'Organizer Earnings', value: `₹${(stats?.organizerEarnings || 0).toLocaleString('en-IN')}`, color: 'text-violet-400' },
                { label: 'Today Revenue', value: `₹${(stats?.todayRevenue || 0).toLocaleString('en-IN')}`, color: 'text-cyan-400' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-surface-card/40">
                  <div>
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className={`text-sm font-semibold ${item.color} mt-0.5`}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
