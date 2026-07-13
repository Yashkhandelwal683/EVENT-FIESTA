import { motion } from 'framer-motion';
import {
  Calendar, CheckCircle2, Clock, Users, Zap, Flag,
  Edit3, Globe, Ticket, MessageSquare, Star, AlertCircle
} from 'lucide-react';

function getEventTimeline(event) {
  const now = new Date();
  const created = new Date(event.createdAt);
  const start = event.startDate ? new Date(event.startDate) : null;
  const end = event.endDate ? new Date(event.endDate) : null;

  const milestones = [
    {
      icon: Edit3,
      label: 'Event Created',
      date: created,
      description: `Created by ${event.organizer?.name || 'Organizer'}`,
      color: 'from-zinc-500 to-zinc-600',
      dotColor: 'bg-zinc-500',
      completed: true,
    },
    {
      icon: Globe,
      label: 'Published',
      date: event.status === 'published' || event.status === 'completed' ? created : null,
      description: event.status === 'published' ? 'Event is live and accepting registrations' : event.status === 'completed' ? 'Event was published' : 'Awaiting publication',
      color: 'from-violet-500 to-purple-600',
      dotColor: 'bg-violet-500',
      completed: event.status === 'published' || event.status === 'completed',
    },
    {
      icon: Ticket,
      label: 'Registration Open',
      date: start ? new Date(start.getTime() - 7 * 86400000) : null,
      description: 'Attendees can register',
      color: 'from-blue-500 to-cyan-600',
      dotColor: 'bg-blue-500',
      completed: start && now > new Date(start.getTime() - 7 * 86400000),
    },
    {
      icon: Users,
      label: 'Registration Closed',
      date: start,
      description: 'Registration deadline passed',
      color: 'from-amber-500 to-orange-600',
      dotColor: 'bg-amber-500',
      completed: start && now > start,
    },
    {
      icon: Zap,
      label: 'Event Live',
      date: start,
      description: start ? `${now > start ? 'Event is currently live' : 'Upcoming'}` : 'TBD',
      color: 'from-emerald-500 to-teal-600',
      dotColor: 'bg-emerald-500',
      completed: event.status === 'completed',
      active: start && end ? (now >= start && now <= end) : (start && now >= start),
    },
    {
      icon: Flag,
      label: 'Completed',
      date: end || start,
      description: event.status === 'completed' ? 'Event has concluded' : 'Awaiting completion',
      color: 'from-rose-500 to-pink-600',
      dotColor: 'bg-rose-500',
      completed: event.status === 'completed',
    },
  ];

  return milestones;
}

export default function EventTimeline({ event }) {
  const milestones = getEventTimeline(event);

  return (
    <div className="space-y-1">
      {milestones.map((m, i) => {
        const isLast = i === milestones.length - 1;
        const Icon = m.icon;

        return (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex gap-4"
          >
            {/* Timeline Line + Dot */}
            <div className="flex flex-col items-center flex-shrink-0">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 300, damping: 20 }}
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                  m.completed
                    ? `bg-gradient-to-br ${m.color} shadow-lg`
                    : m.active
                    ? `bg-gradient-to-br ${m.color} shadow-lg shadow-violet-500/20`
                    : 'bg-white/[0.06] border border-white/[0.1]'
                }`}
              >
                {m.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : m.active ? (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                ) : (
                  <Icon className="w-3.5 h-3.5 text-zinc-500" />
                )}
              </motion.div>
              {!isLast && (
                <div className={`w-px flex-1 min-h-[24px] ${
                  m.completed ? 'bg-gradient-to-b from-white/20 to-white/[0.04]' : 'bg-white/[0.04]'
                }`} />
              )}
            </div>

            {/* Content */}
            <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className={`text-sm font-semibold ${m.completed || m.active ? 'text-white' : 'text-zinc-500'}`}>
                  {m.label}
                </h4>
                {m.active && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 uppercase tracking-wider">
                    Live
                  </span>
                )}
              </div>
              <p className={`text-xs ${m.completed ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {m.description}
              </p>
              {m.date && (
                <p className="text-[10px] text-zinc-600 mt-1 font-mono">
                  {m.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
