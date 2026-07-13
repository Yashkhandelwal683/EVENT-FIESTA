import { useGetNotificationsQuery, useMarkAsReadMutation, useMarkAllAsReadMutation } from '../../features/notifications/notificationsApi';
import { BellIcon, CheckIcon } from '@heroicons/react/24/outline';

const NOTIFICATION_ICONS = {
  new_booking: '🎟️',
  refund: '💰',
  cancellation: '❌',
  review: '⭐',
  payment_failed: '⚠️',
  new_registration: '📝',
  event_reminder: '🔔',
  ticket_checked_in: '✅',
  event_update: '📢',
};

const NOTIFICATION_COLORS = {
  new_booking: 'border-l-primary-500',
  refund: 'border-l-emerald-500',
  cancellation: 'border-l-red-500',
  review: 'border-l-amber-500',
  payment_failed: 'border-l-red-500',
  new_registration: 'border-l-violet-500',
  event_reminder: 'border-l-blue-500',
  ticket_checked_in: 'border-l-emerald-500',
  event_update: 'border-l-cyan-500',
};

export default function NotificationsPage() {
  const { data, isLoading } = useGetNotificationsQuery({ limit: 50 });
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;
  const total = data?.pagination?.total || 0;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Notifications</h1>
          <p className="text-slate-400 text-sm mt-1">{total} total · {unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="btn-sm btn-secondary gap-1.5"
          >
            <CheckIcon className="w-4 h-4" /> Mark All Read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : notifications.length === 0 ? (
        <div className="glass p-12 text-center">
          <BellIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-white text-lg mb-2">No notifications</h3>
          <p className="text-slate-400 text-sm">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => !notif.isRead && markAsRead(notif._id)}
              className={`glass p-4 border-l-4 ${NOTIFICATION_COLORS[notif.type] || 'border-l-primary-500'} cursor-pointer transition-all hover:bg-white/[0.02] ${
                !notif.isRead ? 'bg-primary-600/5' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0">{NOTIFICATION_ICONS[notif.type] || '📌'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-medium ${notif.isRead ? 'text-slate-300' : 'text-white'}`}>{notif.title}</h3>
                    {!notif.isRead && <span className="w-2 h-2 rounded-full bg-primary-400 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                  <p className="text-[10px] text-slate-600 mt-1">{new Date(notif.createdAt).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
