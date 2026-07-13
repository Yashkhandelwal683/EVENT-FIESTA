import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useGetOverviewQuery, useGetTopEventsQuery, useGetRecentBookingsQuery } from '../../features/analytics/analyticsApi';
import {
  CurrencyDollarIcon, CalendarDaysIcon, TicketIcon, UsersIcon,
  PlusCircleIcon, StarIcon, ArrowTrendingUpIcon, ClockIcon,
  ChevronRightIcon, ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const statCards = [
  { key: 'revenue.total', label: 'Total Revenue', icon: CurrencyDollarIcon, color: 'text-emerald-400', bg: 'from-emerald-500/10', prefix: '₹', format: true },
  { key: 'events.total', label: 'Total Events', icon: CalendarDaysIcon, color: 'text-primary-400', bg: 'from-primary-500/10' },
  { key: 'events.upcoming', label: 'Upcoming Events', icon: ClockIcon, color: 'text-violet-400', bg: 'from-violet-500/10' },
  { key: 'events.completed', label: 'Completed', icon: ArrowTrendingUpIcon, color: 'text-emerald-400', bg: 'from-emerald-500/10' },
  { key: 'events.cancelled', label: 'Cancelled', icon: ExclamationCircleIcon, color: 'text-red-400', bg: 'from-red-500/10' },
  { key: 'tickets.total', label: 'Tickets Sold', icon: TicketIcon, color: 'text-amber-400', bg: 'from-amber-500/10' },
  { key: 'revenue.earnings', label: 'Your Earnings', icon: CurrencyDollarIcon, color: 'text-emerald-400', bg: 'from-emerald-500/10', prefix: '₹', format: true },
  { key: 'tickets.checkedIn', label: 'Checked In', icon: UsersIcon, color: 'text-cyan-400', bg: 'from-cyan-500/10' },
  { key: 'ratings.averageRating', label: 'Avg Rating', icon: StarIcon, color: 'text-amber-400', bg: 'from-amber-500/10', suffix: '★' },
  { key: 'bookings.pending', label: 'Pending Bookings', icon: ClockIcon, color: 'text-orange-400', bg: 'from-orange-500/10' },
];

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useGetOverviewQuery();
  const { data: topEvents } = useGetTopEventsQuery();
  const { data: recentBookings } = useGetRecentBookingsQuery();
  const overview = data?.data || {};
  const topEventsList = topEvents?.data || [];
  const recent = recentBookings?.bookings || [];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="skeleton h-10 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 skeleton h-80 rounded-2xl" />
          <div className="skeleton h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back, {user?.name || 'Organizer'} 👋</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/scanner" className="btn-sm btn-secondary gap-1.5">
            <TicketIcon className="w-4 h-4" /> QR Scanner
          </Link>
          <Link to="/dashboard/events/new" className="btn-sm btn-primary gap-1.5 shadow-glow-sm">
            <PlusCircleIcon className="w-4 h-4" /> New Event
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {statCards.map(({ key, label, icon: Icon, color, bg, prefix = '', suffix = '', format: fmt }) => {
          const value = getNestedValue(overview, key);
          const display = value != null
            ? (fmt ? `${prefix}${Number(value).toLocaleString('en-IN')}${suffix}` : `${value}${suffix}`)
            : '—';
          return (
            <div key={key} className={`bg-gradient-to-br ${bg} to-surface-card rounded-2xl border border-surface-border/60 p-4 hover:border-primary-500/40 transition-all`}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">{label}</span>
              </div>
              <p className={`font-display font-bold text-xl sm:text-2xl text-white ${fmt ? 'text-emerald-400' : ''}`}>
                {display}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Events */}
        <div className="lg:col-span-2 glass p-5 border-surface-border/60">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-white text-sm flex items-center gap-2">
              <ArrowTrendingUpIcon className="w-4 h-4 text-primary-400" />
              Top Performing Events
            </h2>
            <Link to="/dashboard/events" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
              View all <ChevronRightIcon className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {topEventsList.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No events yet. Create your first event!</p>
            ) : (
              topEventsList.slice(0, 5).map((event) => (
                <Link
                  key={event._id}
                  to={`/dashboard/events/${event._id}`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-card/60 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-surface-border overflow-hidden flex-shrink-0">
                    {event.bannerImage ? (
                      <img src={event.bannerImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-900/60 to-violet-900/60 flex items-center justify-center">
                        <CalendarDaysIcon className="w-5 h-5 text-primary-400/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate group-hover:text-primary-300 transition-colors">{event.title}</p>
                    <p className="text-xs text-slate-500">{event.ticketCount || 0} tickets · {event.checkedIn || 0} checked in</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary-300">{event.soldCount || 0}/{event.totalCapacity || 0}</p>
                    <p className="text-xs text-slate-500">capacity</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="glass p-5 border-surface-border/60">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-white text-sm flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-violet-400" />
              Recent Bookings
            </h2>
          </div>
          <div className="space-y-3">
            {recent.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No bookings yet.</p>
            ) : (
              recent.slice(0, 6).map((booking) => (
                <div key={booking._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-card/40 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {booking.user?.name?.[0] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{booking.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-slate-500 truncate">{booking.event?.title || ''}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-primary-300">₹{booking.totalAmount || 0}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      booking.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300' :
                      booking.status === 'pending' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
