import { motion } from 'framer-motion';
import {
  Clock, Bell, Target, TrendingUp, Star, Cloud,
  Calendar, Award, Flame, ChevronRight
} from 'lucide-react';

function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function RightPanel({ data = {}, counts = {}, revenue = {}, ratings = {} }) {
  const upcomingEvents = (data.events || []).filter(e => e.status === 'published').slice(0, 3);
  const totalRevenue = revenue.total || 0;
  const earningsGoal = totalRevenue ? Math.max(totalRevenue * 1.5, 50000) : 50000;
  const goalPercent = Math.min(100, Math.round((totalRevenue / earningsGoal) * 100));

  const topEvent = [...(data.events || [])].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))[0];

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
          <div className="p-1.5 rounded-lg bg-violet-500/10">
            <Target className="w-3.5 h-3.5 text-violet-400" />
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
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600"
            />
          </div>
          <p className="text-[10px] text-slate-500">{goalPercent}% achieved</p>
        </div>
      </div>

      {/* Top Event */}
      {topEvent && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-amber-500/10">
              <Award className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top Event</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/20 flex items-center justify-center overflow-hidden flex-shrink-0">
              {topEvent.bannerImage ? (
                <img src={topEvent.bannerImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <Flame className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{topEvent.title}</p>
              <p className="text-[11px] text-slate-500">{topEvent.soldCount || 0} tickets sold</p>
            </div>
          </div>
        </div>
      )}

      {/* Today's Schedule */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-cyan-500/10">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upcoming</h3>
        </div>
        <div className="space-y-2">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, i) => (
              <div key={event._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.02] transition-colors">
                <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{event.title}</p>
                  <p className="text-[10px] text-slate-500">
                    {event.startDate && new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-600 text-center py-4">No upcoming events</p>
          )}
        </div>
      </div>

      {/* Organizer Level */}
      <div className="rounded-2xl border border-amber-500/10 bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-5 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-amber-500/10">
            <Star className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <h3 className="text-xs font-bold text-amber-400/80 uppercase tracking-widest">Organizer Level</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="text-xl">🏆</span>
          </div>
          <div>
            <p className="text-sm font-bold text-white">Gold Organizer</p>
            <p className="text-[10px] text-slate-500">{ratings.average ? Number(ratings.average).toFixed(1) : '—'}★ rating · {(counts.totalEvents || 0)} events hosted</p>
          </div>
        </div>
      </div>

      {/* Motivational */}
      <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-violet-600/5 to-fuchsia-600/5 p-5 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <p className="text-sm font-semibold text-white">Your Progress</p>
            <p className="text-[11px] text-slate-500 mt-1">{(counts.totalEvents || 0)} events · {(counts.totalTicketsSold || 0)} tickets sold · ₹{(revenue.total || 0).toLocaleString('en-IN')} earned</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
