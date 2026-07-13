import { motion } from 'framer-motion';
import {
  Ticket, UserPlus, DollarSign, CalendarCheck, Star, MessageSquare,
  Clock, CheckCircle, AlertCircle, Zap
} from 'lucide-react';

const activityTypes = {
  ticket_sold: { icon: Ticket, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Ticket Sold' },
  registration: { icon: UserPlus, color: 'text-violet-400', bg: 'bg-violet-500/10', label: 'New Registration' },
  payment: { icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Payment Received' },
  event_published: { icon: CalendarCheck, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Event Published' },
  review: { icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Review Received' },
  checkin: { icon: CheckCircle, color: 'text-cyan-400', bg: 'bg-cyan-500/10', label: 'Check-in' },
};

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function RecentActivity({ activities = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Activity</h2>
        </div>
      </div>

      <div className="p-3">
        {activities.length > 0 ? (
          activities.map((activity, i) => {
            const config = activityTypes[activity.type] || activityTypes.ticket_sold;
            const Icon = config.icon;
            return (
              <motion.div
                key={activity.id || i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-all group"
              >
                <div className={`p-2 rounded-xl ${config.bg} flex-shrink-0 mt-0.5`}>
                  <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {activity.user && <span className="text-[10px] text-slate-600">{activity.user}</span>}
                    {activity.user && activity.time && <span className="text-[10px] text-slate-700">·</span>}
                    {activity.time && <span className="text-[10px] text-slate-600">{formatTime(activity.time)}</span>}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-10">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-xs text-slate-500">No recent activity</p>
            <p className="text-[10px] text-slate-600 mt-1">Activity will appear here as events happen</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
