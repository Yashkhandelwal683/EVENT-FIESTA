import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Plus, Calendar, Zap, TrendingUp, Users, Clock, ArrowRight } from 'lucide-react';

export default function AdminWelcomeHero({ stats }) {
  const now = useMemo(() => new Date(), []);
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const quickActions = [
    { to: '/admin/organizer-approvals', label: 'Approve Organizers', icon: Shield, color: 'from-blue-600 to-cyan-600' },
    { to: '/admin/events', label: 'Manage Events', icon: Calendar, color: 'from-indigo-600 to-blue-600' },
    { to: '/admin/users', label: 'Manage Users', icon: Users, color: 'from-cyan-600 to-teal-600' },
    { to: '/admin/revenue', label: 'Revenue', icon: TrendingUp, color: 'from-emerald-600 to-cyan-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-white/[0.06]"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-600/5 to-indigo-600/8" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500/6 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/4 rounded-full blur-3xl" />

      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="w-3.5 h-3.5" />
              <span>{dateStr}</span>
              <span className="text-slate-700">·</span>
              <span className="font-mono text-blue-400">Admin Panel</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {greeting}, <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">Admin</span>
                <motion.span
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-block ml-2"
                >
                  👋
                </motion.span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">Platform-wide overview and management dashboard.</p>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-semibold text-blue-300">{(stats?.totalUsers || 0).toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-blue-500/60">users</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300">₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-emerald-500/60">revenue</span>
              </div>
              {(stats?.pendingOrganizerRequests || 0) > 0 && (
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-300">{stats.pendingOrganizerRequests}</span>
                  <span className="text-[10px] text-amber-500/60">pending</span>
                </div>
              )}
            </div>
          </div>

          {/* Right — Quick Actions */}
          <div className="flex flex-wrap gap-2">
            {quickActions.map(({ to, label, icon: Icon, color }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-300 text-xs font-semibold hover:border-blue-500/30 hover:bg-white/[0.05] transition-all group"
              >
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                {label}
                <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
