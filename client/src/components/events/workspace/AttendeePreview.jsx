import { motion } from 'framer-motion';
import { User, Mail, Ticket, DollarSign, CheckCircle2, Clock, XCircle, ArrowUpRight } from 'lucide-react';

function getStatusStyle(status) {
  switch (status) {
    case 'paid': case 'confirmed': case 'approved':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'pending': case 'pending_approval':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'failed': case 'cancelled': case 'rejected':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
  }
}

export default function AttendeePreview({ registrations, bookings }) {
  const recentAttendees = [
    ...registrations.slice(0, 5).map(r => ({
      id: r._id,
      name: r.attendee?.name || r.attendeeDetails?.fullName || '—',
      email: r.attendee?.email || r.attendeeDetails?.email || '—',
      ticket: r.ticketStatus || '—',
      payment: r.paymentStatus || '—',
      amount: r.grandTotal || r.amount || 0,
      date: r.createdAt,
      source: 'Registration',
    })),
    ...bookings.slice(0, 5).map(b => ({
      id: b._id,
      name: b.user?.name || b.attendeeInfo?.name || '—',
      email: b.user?.email || b.attendeeInfo?.email || '—',
      ticket: b.status || '—',
      payment: b.status || '—',
      amount: b.totalAmount || 0,
      date: b.createdAt,
      source: 'Booking',
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  if (recentAttendees.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
          <User className="w-5 h-5 text-zinc-600" />
        </div>
        <p className="text-xs text-zinc-500">No registrations yet</p>
        <p className="text-[10px] text-zinc-600 mt-1">Attendees will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {recentAttendees.map((a, i) => (
        <motion.div
          key={a.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group"
        >
          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/25 to-fuchsia-500/25 flex items-center justify-center text-[11px] font-bold text-violet-300 ring-1 ring-white/[0.06] flex-shrink-0">
            {a.name !== '—' ? a.name.charAt(0).toUpperCase() : '?'}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-white truncate">{a.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getStatusStyle(a.ticket)}`}>
                {a.ticket?.replace(/_/g, ' ')}
              </span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getStatusStyle(a.payment)}`}>
                {a.payment}
              </span>
            </div>
          </div>

          {/* Amount */}
          <div className="text-right flex-shrink-0">
            <p className="text-xs font-bold text-emerald-400">₹{a.amount.toLocaleString('en-IN')}</p>
            <p className="text-[9px] text-zinc-600">
              {new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
