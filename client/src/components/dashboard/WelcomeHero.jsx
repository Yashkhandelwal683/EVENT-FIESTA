import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Calendar, Zap, TrendingUp, Clock } from 'lucide-react';

export default function WelcomeHero({ data, isLoading }) {
  const d = data?.data;
  const now = useMemo(() => new Date(), []);
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const nextEvent = d?.nextEvent;
  const liveEvents = d?.counts?.liveEvents || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-white/[0.06]"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-purple-600/5 to-fuchsia-600/8" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-violet-500/8 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-fuchsia-500/6 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/4 rounded-full blur-3xl" />

      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateStr}</span>
              <span className="text-slate-700">·</span>
              <span className="font-mono text-violet-400">{timeStr}</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {greeting}, <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">{d?.welcome?.name || 'Organizer'}</span>
                <motion.span
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-block ml-2"
                >
                  👋
                </motion.span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">Here's what's happening with your events today.</p>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300">₹{(d?.revenue?.earnings || 0).toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-emerald-500/60">earned</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <Zap className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-xs font-semibold text-violet-300">{d?.counts?.totalTicketsSold || 0}</span>
                <span className="text-[10px] text-violet-500/60">tickets sold</span>
              </div>
              {liveEvents > 0 && (
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-semibold text-emerald-300">{liveEvents} live</span>
                </div>
              )}
            </div>
          </div>

          {/* Right — Next Event */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {nextEvent && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {nextEvent.bannerImage ? (
                    <img src={nextEvent.bannerImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Calendar className="w-5 h-5 text-violet-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Next Event</p>
                  <p className="text-sm font-bold text-white truncate max-w-[180px]">{nextEvent.title}</p>
                </div>
                <div className="flex items-center gap-2 pl-3 border-l border-white/[0.06]">
                  <div className="text-center">
                    <p className="text-lg font-black text-violet-300 tabular-nums">{Math.floor((new Date(nextEvent.startDate) - now) / (1000 * 60 * 60 * 24))}</p>
                    <p className="text-[9px] text-slate-600 uppercase tracking-wider">Days</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-violet-300 tabular-nums">{Math.floor(((new Date(nextEvent.startDate) - now) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}</p>
                    <p className="text-[9px] text-slate-600 uppercase tracking-wider">Hrs</p>
                  </div>
                </div>
              </div>
            )}

            <Link
              to="/organizer/create-event"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold shadow-xl shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
