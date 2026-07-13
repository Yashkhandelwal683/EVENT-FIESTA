import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGetNotificationsQuery, useMarkAsReadMutation, useMarkAllAsReadMutation } from '../../features/notifications/notificationsApi';
import {
  BellIcon, CheckCircleIcon, XMarkIcon, CheckIcon,
} from '@heroicons/react/24/outline';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const TYPE_ICONS = {
  new_booking: { emoji: '🎟️', bg: 'bg-violet-500/20 text-violet-300' },
  refund: { emoji: '💰', bg: 'bg-emerald-500/20 text-emerald-300' },
  cancellation: { emoji: '❌', bg: 'bg-red-500/20 text-red-300' },
  review: { emoji: '⭐', bg: 'bg-amber-500/20 text-amber-300' },
  payment_failed: { emoji: '⚠️', bg: 'bg-red-500/20 text-red-300' },
  new_registration: { emoji: '📝', bg: 'bg-emerald-500/20 text-emerald-300' },
  event_reminder: { emoji: '🔔', bg: 'bg-blue-500/20 text-blue-300' },
  ticket_checked_in: { emoji: '✅', bg: 'bg-cyan-500/20 text-cyan-300' },
  event_update: { emoji: '📢', bg: 'bg-orange-500/20 text-orange-300' },
  organizer_approved: { emoji: '🎉', bg: 'bg-emerald-500/20 text-emerald-300' },
  organizer_rejected: { emoji: '😞', bg: 'bg-red-500/20 text-red-300' },
};

const BORDER_COLORS = {
  new_booking: 'border-l-violet-500',
  refund: 'border-l-emerald-500',
  cancellation: 'border-l-red-500',
  review: 'border-l-amber-500',
  payment_failed: 'border-l-red-500',
  new_registration: 'border-l-emerald-500',
  event_reminder: 'border-l-blue-500',
  ticket_checked_in: 'border-l-emerald-500',
  event_update: 'border-l-cyan-500',
  organizer_approved: 'border-l-emerald-500',
  organizer_rejected: 'border-l-red-500',
};

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetNotificationsQuery({ page, limit: 50 });
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;
  const total = data?.pagination?.total || 0;

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try { await markAsRead(id).unwrap(); } catch {}
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Notifications</h1>
          <p className="text-zinc-400 text-sm mt-1">{total} total · {unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/10 text-violet-300 text-xs font-medium hover:bg-violet-500/20 transition-all"
          >
            <CheckIcon className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <BellIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 font-medium">No notifications</p>
          <p className="text-xs text-zinc-600 mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => {
            const typeConfig = TYPE_ICONS[notif.type] || { emoji: '📌', bg: 'bg-zinc-500/20 text-zinc-400' };
            const borderColor = BORDER_COLORS[notif.type] || 'border-l-violet-500';

            return (
              <motion.div
                key={notif._id}
                variants={item}
                onClick={() => !notif.isRead && markAsRead(notif._id)}
                className={`rounded-2xl border-l-4 ${borderColor} p-4 cursor-pointer transition-all hover:bg-white/[0.02] ${
                  !notif.isRead ? 'bg-violet-500/[0.03] border border-violet-500/10' : 'border border-white/[0.03] bg-white/[0.01]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 flex-shrink-0 ${typeConfig.bg}`}>
                    <span className="text-sm">{typeConfig.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm ${notif.isRead ? 'text-zinc-400' : 'text-white font-medium'}`}>
                        {notif.title}
                      </p>
                      {!notif.isRead && <span className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">{notif.message}</p>
                    <p className="text-[10px] text-zinc-600 mt-1">
                      {new Date(notif.createdAt).toLocaleString('en-IN', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!notif.isRead && (
                      <button
                        onClick={(e) => handleMarkRead(notif._id, e)}
                        className="p-1.5 rounded-lg hover:bg-white/[0.04] text-zinc-500 hover:text-emerald-400 transition-all"
                        title="Mark read"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!isLoading && data?.pagination?.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-400 hover:text-white disabled:opacity-30 transition-all"
          >
            Previous
          </button>
          <span className="text-xs text-zinc-500">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= (data?.pagination?.pages || 1)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-400 hover:text-white disabled:opacity-30 transition-all"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
}
