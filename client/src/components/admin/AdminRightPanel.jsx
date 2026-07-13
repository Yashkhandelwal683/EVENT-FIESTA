import { motion } from 'framer-motion';
import { Target, Award, Star, Calendar, TrendingUp, Users } from 'lucide-react';

export default function AdminRightPanel({ stats }) {
  stats = stats || {};
  const totalRevenue = stats.totalRevenue || 0;
  const earningsGoal = stats?.totalRevenue ? Math.max(stats.totalRevenue * 1.5, 100000) : 100000;
  const goalPercent = Math.min(100, Math.round((totalRevenue / earningsGoal) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-4"
    >
      {/* Revenue Goal */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-blue-500/10">
            <Target className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Revenue Goal</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <p className="text-2xl font-black text-white tabular-nums">₹{totalRevenue.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-slate-600">of ₹{earningsGoal.toLocaleString('en-IN')}</p>
          </div>
          <div className="h-2 rounded-full bg-slate-800/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${goalPercent}%` }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-600"
            />
          </div>
          <p className="text-[10px] text-slate-500">{goalPercent}% achieved</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-cyan-500/10">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Platform Stats</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Total Users', value: (stats.totalUsers || 0).toLocaleString('en-IN'), icon: Users, color: 'text-blue-400' },
            { label: 'Active Events', value: (stats.liveEvents || 0).toLocaleString('en-IN'), icon: Calendar, color: 'text-emerald-400' },
            { label: 'Registrations', value: (stats.totalRegistrations || 0).toLocaleString('en-IN'), icon: Award, color: 'text-cyan-400' },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                <span className="text-xs text-slate-400">{s.label}</span>
              </div>
              <span className="text-sm font-bold text-white tabular-nums">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Organizer Level */}
      <div className="rounded-2xl border border-blue-500/10 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 p-5 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-blue-500/10">
            <Star className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <h3 className="text-xs font-bold text-blue-400/80 uppercase tracking-widest">Admin Level</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-xl">🛡️</span>
          </div>
          <div>
            <p className="text-sm font-bold text-white">Super Admin</p>
            <p className="text-[10px] text-slate-500">Full platform access · All permissions</p>
          </div>
        </div>
      </div>

      {/* Motivational */}
      <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-blue-600/5 to-cyan-600/5 p-5 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <p className="text-sm font-semibold text-white">Platform Overview</p>
            <p className="text-[11px] text-slate-500 mt-1">{(stats?.totalUsers || 0)} users · {(stats?.totalEvents || 0)} events · ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')} revenue</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
