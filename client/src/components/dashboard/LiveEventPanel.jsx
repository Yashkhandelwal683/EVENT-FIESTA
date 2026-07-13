import { motion } from 'framer-motion';
import { Radio, Users, QrCode, Ticket, TrendingUp } from 'lucide-react';

function AnimatedNumber({ value }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-2xl font-black text-white tabular-nums"
    >
      {value || 0}
    </motion.span>
  );
}

export default function LiveEventPanel({ counts = {}, isLoading }) {
  const stats = [
    { label: 'Check-ins Today', value: counts.todayCheckIns || 0, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Active Events', value: counts.liveEvents || 0, icon: Radio, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'Tickets Sold Today', value: counts.todayCheckIns || 0, icon: Ticket, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Pending Refunds', value: counts.pendingRefunds || 0, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="p-1.5 rounded-lg bg-emerald-500/10">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            {(counts.liveEvents || 0) > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Status</h2>
        </div>
        {(counts.liveEvents || 0) > 0 && (
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            LIVE
          </span>
        )}
      </div>

      <div className="p-4 grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i }}
            className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4 text-center space-y-2"
          >
            <div className={`inline-flex p-2 rounded-xl ${bg}`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <AnimatedNumber value={value} />
            <p className="text-[10px] text-slate-600 uppercase tracking-wider">{label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
