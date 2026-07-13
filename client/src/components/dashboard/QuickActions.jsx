import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, QrCode, Users, DollarSign, BarChart3,
  FileText, Bell, Calendar, Ticket, Settings
} from 'lucide-react';

const actions = [
  { to: '/organizer/create-event', icon: Plus, label: 'Create Event', color: 'from-violet-600 to-fuchsia-600', glow: 'shadow-violet-500/20', featured: true },
  { to: '/organizer/scan-ticket', icon: QrCode, label: 'Scan QR', color: 'from-emerald-600 to-teal-600', glow: 'shadow-emerald-500/20' },
  { to: '/organizer/tickets', icon: Ticket, label: 'Tickets', color: 'from-rose-600 to-pink-600', glow: 'shadow-rose-500/20' },
  { to: '/organizer/attendees', icon: Users, label: 'Attendees', color: 'from-cyan-600 to-blue-600', glow: 'shadow-cyan-500/20' },
  { to: '/organizer/revenue', icon: DollarSign, label: 'Revenue', color: 'from-emerald-600 to-green-600', glow: 'shadow-emerald-500/20' },
  { to: '/organizer/analytics', icon: BarChart3, label: 'Analytics', color: 'from-blue-600 to-indigo-600', glow: 'shadow-blue-500/20' },
  { to: '/organizer/calendar', icon: Calendar, label: 'Calendar', color: 'from-amber-600 to-orange-600', glow: 'shadow-amber-500/20' },
  { to: '/organizer/reports', icon: FileText, label: 'Reports', color: 'from-purple-600 to-violet-600', glow: 'shadow-purple-500/20' },
];

export default function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {actions.map(({ to, icon: Icon, label, color, glow, featured }, i) => (
          <Link
            key={to}
            to={to}
            className={`group flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] ${
              featured
                ? 'bg-gradient-to-br ' + color + ' border-white/[0.1] shadow-xl ' + glow
                : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1]'
            }`}
          >
            <div className={`p-2 rounded-xl ${featured ? 'bg-white/20' : 'bg-white/[0.04] group-hover:bg-white/[0.08]'} group-hover:scale-110 transition-all duration-300`}>
              <Icon className={`w-4 h-4 ${featured ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
            </div>
            <span className={`text-[10px] font-semibold text-center leading-tight ${featured ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`}>
              {label}
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
