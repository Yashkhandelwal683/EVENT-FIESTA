import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, DollarSign, ExternalLink, Edit3, BarChart3, Clock } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return 'TBD';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getStatusStyle(status) {
  switch (status) {
    case 'published': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'draft': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'completed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
}

export default function UpcomingEvents({ events = [], isLoading }) {
  const upcoming = events
    .filter(e => e.status === 'published' || e.status === 'draft')
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-500/10">
            <Calendar className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upcoming Events</h2>
        </div>
        <Link to="/organizer/events" className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors font-semibold">
          View all →
        </Link>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-5 py-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 rounded bg-white/5" />
                  <div className="h-2 w-20 rounded bg-white/5" />
                </div>
              </div>
            </div>
          ))
        ) : upcoming.length > 0 ? (
          upcoming.map((event, i) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <Link
                to={`/organizer/events/${event._id}/manage`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-all group"
              >
                {/* Poster */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/[0.04]">
                  {event.bannerImage ? (
                    <img src={event.bannerImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Calendar className="w-5 h-5 text-slate-500" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white truncate group-hover:text-violet-300 transition-colors">{event.title}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getStatusStyle(event.status)} uppercase`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {event.startDate && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3" />
                        {formatDate(event.startDate)}
                      </span>
                    )}
                    {event.location && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[100px]">{event.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-400 tabular-nums">₹{(event.ticketPrice || 0).toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-slate-600">{event.soldCount || 0}/{event.totalCapacity || '∞'} sold</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
                      <Edit3 className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
                      <BarChart3 className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🎪</div>
            <p className="text-sm text-slate-500 mb-3">No events yet</p>
            <Link
              to="/organizer/create-event"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold shadow-lg shadow-violet-500/20"
            >
              Create Your First Event
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
