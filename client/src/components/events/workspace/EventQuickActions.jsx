import { motion } from 'framer-motion';
import {
  Edit3, Ticket, Calendar, Send, BarChart3, Download,
  QrCode, Share2, Copy, Trash2, ArrowUpRight
} from 'lucide-react';

const actions = [
  {
    icon: Edit3, label: 'Edit Event', desc: 'Update details & settings',
    gradient: 'from-violet-600/20 to-purple-600/10', iconBg: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
    hoverBorder: 'hover:border-violet-500/30',
  },
  {
    icon: Ticket, label: 'Manage Tickets', desc: 'View & manage ticket types',
    gradient: 'from-blue-600/20 to-cyan-600/10', iconBg: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    hoverBorder: 'hover:border-blue-500/30',
  },
  {
    icon: Calendar, label: 'Manage Schedule', desc: 'Set up event sessions',
    gradient: 'from-emerald-600/20 to-teal-600/10', iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    hoverBorder: 'hover:border-emerald-500/30',
  },
  {
    icon: Send, label: 'Send Announcement', desc: 'Notify all attendees',
    gradient: 'from-amber-600/20 to-orange-600/10', iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    hoverBorder: 'hover:border-amber-500/30',
  },
  {
    icon: BarChart3, label: 'View Analytics', desc: 'Detailed event insights',
    gradient: 'from-rose-600/20 to-pink-600/10', iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    hoverBorder: 'hover:border-rose-500/30',
  },
  {
    icon: Download, label: 'Download Report', desc: 'Export event data as CSV',
    gradient: 'from-cyan-600/20 to-sky-600/10', iconBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
    hoverBorder: 'hover:border-cyan-500/30',
  },
  {
    icon: QrCode, label: 'QR Scanner', desc: 'Scan tickets at entry',
    gradient: 'from-fuchsia-600/20 to-pink-600/10', iconBg: 'bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/20',
    hoverBorder: 'hover:border-fuchsia-500/30',
  },
  {
    icon: Share2, label: 'Share Event', desc: 'Copy shareable link',
    gradient: 'from-indigo-600/20 to-violet-600/10', iconBg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
    hoverBorder: 'hover:border-indigo-500/30',
  },
];

export default function EventQuickActions({ eventId, navigate }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {actions.map((action, i) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (action.label === 'Edit Event') navigate(`/organizer/events/${eventId}/edit`);
            if (action.label === 'QR Scanner') navigate('/organizer/scanner');
          }}
          className={`group relative rounded-xl bg-gradient-to-br ${action.gradient} border border-white/[0.06] ${action.hoverBorder} p-4 text-left transition-all duration-300 overflow-hidden`}
        >
          {/* Hover glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} blur-xl opacity-30`} />
          </div>

          <div className="relative z-10">
            <div className={`inline-flex p-2 rounded-xl border ${action.iconBg} mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <action.icon className="w-4 h-4" />
            </div>
            <p className="text-[13px] font-semibold text-white mb-0.5">{action.label}</p>
            <p className="text-[10px] text-zinc-500 leading-relaxed">{action.desc}</p>
          </div>

          <ArrowUpRight className="absolute top-3 right-3 w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
        </motion.button>
      ))}
    </div>
  );
}
