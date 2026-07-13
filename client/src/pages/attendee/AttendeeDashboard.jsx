
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { useGetDashboardQuery } from '../../features/attendee/attendeeApi';
import {
  TicketIcon, CalendarDaysIcon, HeartIcon, CurrencyRupeeIcon,
  ClockIcon, MapPinIcon, BellIcon, ArrowTrendingUpIcon,
  ArrowRightIcon, SparklesIcon, FireIcon, GiftIcon,
  QrCodeIcon, ShareIcon, CalendarIcon, ChevronRightIcon,
  PlusIcon, MagnifyingGlassIcon, CheckCircleIcon, XCircleIcon,
  ArrowUpRightIcon, StarIcon, UsersIcon, BoltIcon,
  BookmarkIcon, EyeIcon, MegaphoneIcon,
} from '@heroicons/react/24/outline';

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } };
const MotionLink = motion(Link);

function daysUntil(date) {
  if (!date) return null;
  const diff = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

function timeAgo(date) {
  if (!date) return '';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const STATUS_STYLES = {
  confirmed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
  pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-400' },
  cancelled: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-400' },
  completed: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-400' },
};

const CATEGORY_ICONS = {
  music: '🎵', workshop: '🛠️', sports: '⚽', hackathon: '💻',
  comedy: '😂', festival: '🎪', seminar: '🎓', tech: '🚀', default: '✨',
};

const NOTIF_ICONS = {
  new_booking: { icon: TicketIcon, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  refund: { icon: CurrencyRupeeIcon, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  cancellation: { icon: XCircleIcon, color: 'text-red-400', bg: 'bg-red-500/10' },
  review: { icon: StarIcon, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  event_reminder: { icon: BellIcon, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  ticket_checked_in: { icon: CheckCircleIcon, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  event_update: { icon: MegaphoneIcon, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  default: { icon: BellIcon, color: 'text-zinc-400', bg: 'bg-zinc-500/10' },
};

export default function AttendeeDashboard() {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const { data, isLoading } = useGetDashboardQuery();
  const d = data?.data;
  const counts = d?.counts || {};
  const upcomingBookings = d?.upcomingBookings || [];
  const recentBookings = d?.recentBookings || [];
  const recentTickets = d?.recentTickets || [];
  const recommendedEvents = d?.recommendedEvents || [];
  const wishlistItems = d?.wishlistItems || [];
  const recentNotifications = d?.recentNotifications || [];

  const hr = new Date().getHours();
  const greeting = hr < 12 ? 'Good Morning' : hr < 18 ? 'Good Afternoon' : 'Good Evening';
  const emoji = hr < 12 ? '☀️' : hr < 18 ? '🌤️' : '🌙';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const displayName = user?.name?.split(' ')[0] || 'there';

  const nextEvent = upcomingBookings[0] || null;
  const nextEventDays = nextEvent ? daysUntil(nextEvent.event?.startDate) : null;

  const hasData = upcomingBookings.length > 0 || recentBookings.length > 0 || recentTickets.length > 0;

  const statCards = [
    { label: 'Total Bookings', value: counts.totalBookings, icon: TicketIcon, gradient: 'from-violet-600 to-purple-600', glow: 'shadow-violet-500/20' },
    { label: 'Upcoming', value: counts.upcomingEvents, icon: CalendarDaysIcon, gradient: 'from-emerald-600 to-teal-600', glow: 'shadow-emerald-500/20' },
    { label: 'Completed', value: counts.completedEvents, icon: CheckCircleIcon, gradient: 'from-blue-600 to-cyan-600', glow: 'shadow-blue-500/20' },
    { label: 'Cancelled', value: counts.cancelledBookings, icon: XCircleIcon, gradient: 'from-red-500 to-rose-500', glow: 'shadow-red-500/20' },
    { label: 'Total Spent', value: counts.totalSpent, icon: CurrencyRupeeIcon, gradient: 'from-amber-500 to-orange-500', glow: 'shadow-amber-500/20', prefix: '₹' },
    { label: 'Wishlist', value: counts.wishlistCount, icon: HeartIcon, gradient: 'from-pink-500 to-rose-500', glow: 'shadow-pink-500/20' },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 pb-10">

      {/* ── Hero Welcome ──────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600/20 via-violet-600/10 to-accent-600/10 border border-white/[0.06] p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-zinc-500 font-medium mb-1">{today}</p>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
              {greeting}, {displayName} {emoji}
            </h1>
            <p className="text-sm text-zinc-400 mt-1.5 max-w-md">
              {hasData
                ? `You have ${counts.upcomingEvents || 0} upcoming event${counts.upcomingEvents !== 1 ? 's' : ''} and ${counts.totalBookings || 0} total booking${counts.totalBookings !== 1 ? 's' : ''}.`
                : 'Discover amazing events and start building your collection.'}
            </p>
          </div>
          <Link
            to="/events"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-violet-600 text-white text-sm font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <PlusIcon className="w-4 h-4" />
            Browse Events
          </Link>
        </div>
      </motion.div>

      {/* ── KPI Stats ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map((s) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={`glass rounded-2xl p-4 cursor-default group ${s.glow} hover:shadow-lg transition-shadow`}
          >
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-3 w-16 bg-white/5 rounded" />
                <div className="h-7 w-12 bg-white/5 rounded" />
              </div>
            ) : (
              <>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                  <s.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">{s.label}</p>
                <p className="text-2xl font-black text-white font-display mt-0.5 tabular-nums">
                  {s.prefix || ''}{typeof s.value === 'number' ? s.value.toLocaleString('en-IN') : (s.value ?? 0)}
                </p>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* ── Next Event Hero Card ───────────────────────────────── */}
      <motion.div variants={fadeUp}>
        {isLoading ? (
          <div className="h-48 rounded-3xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
        ) : nextEvent ? (
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-surface-card to-surface-card/50">
            <div className="absolute inset-0">
              {nextEvent.event?.bannerImage ? (
                <img src={nextEvent.event.bannerImage} alt="" className="w-full h-full object-cover opacity-20" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-600/10 to-violet-600/5" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-surface-card via-surface-card/95 to-surface-card/60" />
            </div>
            <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                    Next Event
                  </span>
                  {nextEventDays != null && (
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-[10px] font-bold">
                      {nextEventDays === 0 ? 'Today!' : `${nextEventDays} day${nextEventDays !== 1 ? 's' : ''} left`}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-white truncate">
                  {nextEvent.event?.title || 'Upcoming Event'}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-zinc-400">
                  {nextEvent.event?.startDate && (
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {new Date(nextEvent.event.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  )}
                  {(nextEvent.event?.venue?.name || nextEvent.event?.venue?.city) && (
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="w-3.5 h-3.5" />
                      {nextEvent.event.venue.name || nextEvent.event.venue.city}
                    </span>
                  )}
                  {nextEvent.status && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_STYLES[nextEvent.status]?.bg || 'bg-zinc-500/10'} ${STATUS_STYLES[nextEvent.status]?.text || 'text-zinc-400'} ${STATUS_STYLES[nextEvent.status]?.border || 'border-zinc-500/20'}`}>
                      {nextEvent.status}
                    </span>
                  )}
                  {nextEvent.bookingRef && (
                    <span className="text-[10px] font-mono text-zinc-600">#{nextEvent.bookingRef}</span>
                  )}
                </div>

                {nextEvent.event?.startDate && (
                  <div className="flex items-center gap-4 mt-4">
                    {[
                      { label: 'Days', value: Math.max(0, Math.ceil((new Date(nextEvent.event.startDate) - new Date()) / (1000*60*60*24))) },
                      { label: 'Hours', value: Math.max(0, Math.floor((new Date(nextEvent.event.startDate) - new Date()) / (1000*60*60)) % 24) },
                      { label: 'Mins', value: Math.max(0, Math.floor((new Date(nextEvent.event.startDate) - new Date()) / (1000*60)) % 60) },
                    ].map(({ label, value }) => (
                      <div key={label} className="text-center">
                        <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                          <span className="text-lg font-black text-white font-display tabular-nums">{value}</span>
                        </div>
                        <p className="text-[9px] text-zinc-600 uppercase tracking-wider mt-1">{label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <Link
                  to={`/events/${nextEvent.event?._id || ''}`}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/[0.08] transition-all"
                >
                  <EyeIcon className="w-3.5 h-3.5" />
                  View Event
                </Link>
                <Link
                  to="/dashboard/bookings"
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold transition-all"
                >
                  <TicketIcon className="w-3.5 h-3.5" />
                  View Ticket
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* ── Premium Empty State ────────────────────────────────── */
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-primary-600/5 via-violet-600/5 to-accent-600/5 p-10 sm:p-14 text-center">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary-500/20 to-violet-500/20 border border-primary-500/10 flex items-center justify-center mb-6 shadow-2xl shadow-primary-500/10">
                <span className="text-5xl">🎫</span>
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-2">Your Event Journey Starts Here</h3>
              <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                No bookings yet — but that's about to change. Explore live events, grab your tickets, and watch your dashboard come alive.
              </p>
              <div className="flex items-center justify-center gap-3 mt-6">
                <Link
                  to="/events"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-violet-600 text-white text-sm font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <MagnifyingGlassIcon className="w-4 h-4" />
                  Browse Events
                </Link>
                <Link
                  to="/dashboard/wishlist"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-sm font-semibold border border-white/[0.08] transition-all"
                >
                  <HeartIcon className="w-4 h-4" />
                  My Wishlist
                </Link>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Main Content Grid ──────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left: Upcoming Bookings + Recent Bookings + Activity */}
        <div className="lg:col-span-2 space-y-6">

          {/* Upcoming Bookings */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-violet-400" />
                Upcoming Bookings
              </h2>
              {upcomingBookings.length > 0 && (
                <Link to="/dashboard/bookings" className="text-[11px] text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 transition-colors">
                  View all <ChevronRightIcon className="w-3 h-3" />
                </Link>
              )}
            </div>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
                ))}
              </div>
            ) : upcomingBookings.length === 0 ? (
              <EmptyState
                icon="📅"
                title="No upcoming bookings"
                description="Your next adventure is waiting to be booked."
                action={{ label: 'Browse Events', to: '/events' }}
              />
            ) : (
              <div className="space-y-2">
                {upcomingBookings.map((b, i) => {
                  const eventDate = b.event?.startDate;
                  const days = eventDate ? daysUntil(eventDate) : null;
                  const style = STATUS_STYLES[b.status] || STATUS_STYLES.pending;
                  return (
                    <motion.div
                      key={b._id || i}
                      variants={scaleIn}
                      whileHover={{ x: 4 }}
                      className="glass rounded-2xl p-4 flex items-center gap-4 group cursor-pointer hover:bg-white/[0.03] transition-all"
                      onClick={() => navigate('/dashboard/bookings')}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/20 to-primary-600/20 border border-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
                        {b.event?.bannerImage ? (
                          <img src={b.event.bannerImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <CalendarIcon className="w-5 h-5 text-violet-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate group-hover:text-violet-300 transition-colors">
                          {b.event?.title || 'Event'}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-500">
                          {eventDate && <span>{new Date(eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                          {(b.event?.venue?.name || b.event?.venue?.city) && (
                            <span className="flex items-center gap-0.5">
                              <MapPinIcon className="w-3 h-3" />
                              {b.event.venue.name || b.event.venue.city}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {days != null && (
                          <p className="text-lg font-black text-white font-display tabular-nums">{days}<span className="text-[10px] text-zinc-500 font-normal ml-0.5">d</span></p>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
                          {b.status}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Recent Bookings Timeline */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                <TicketIcon className="w-4 h-4 text-violet-400" />
                Recent Bookings
              </h2>
            </div>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
                ))}
              </div>
            ) : recentBookings.length === 0 ? (
              <EmptyState
                icon="📋"
                title="No booking history"
                description="Your bookings will appear here once you register for events."
                action={{ label: 'Browse Events', to: '/events' }}
              />
            ) : (
              <div className="space-y-2">
                {recentBookings.slice(0, 5).map((b, i) => {
                  const style = STATUS_STYLES[b.status] || STATUS_STYLES.pending;
                  return (
                    <motion.div
                      key={b._id || i}
                      variants={scaleIn}
                      className="glass rounded-2xl p-3.5 flex items-center gap-3"
                    >
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 border border-white/[0.04] flex items-center justify-center overflow-hidden">
                          {b.event?.bannerImage ? (
                            <img src={b.event.bannerImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <CalendarIcon className="w-4 h-4 text-zinc-500" />
                          )}
                        </div>
                        {i < recentBookings.length - 1 && (
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-2 bg-white/[0.06]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{b.event?.title || 'Event'}</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {b.totalAmount ? ` · ₹${b.totalAmount.toLocaleString('en-IN')}` : ''}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${style.bg} ${style.text} ${style.border}`}>
                        {b.status}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Recent Activity Feed */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                <BellIcon className="w-4 h-4 text-amber-400" />
                Recent Activity
              </h2>
              {recentNotifications.length > 0 && (
                <Link to="/dashboard/bookings" className="text-[11px] text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 transition-colors">
                  View all <ChevronRightIcon className="w-3 h-3" />
                </Link>
              )}
            </div>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
                ))}
              </div>
            ) : recentNotifications.length === 0 ? (
              <EmptyState
                icon="🔔"
                title="No activity yet"
                description="Your recent notifications and activity will appear here."
                compact
              />
            ) : (
              <div className="space-y-1.5">
                {recentNotifications.slice(0, 5).map((n, i) => {
                  const nStyle = NOTIF_ICONS[n.type] || NOTIF_ICONS.default;
                  const NIcon = nStyle.icon;
                  return (
                    <motion.div
                      key={n._id || i}
                      variants={scaleIn}
                      className={`glass rounded-xl p-3 flex items-center gap-3 ${!n.isRead ? 'border-l-2 border-l-primary-500' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${nStyle.bg} flex items-center justify-center shrink-0`}>
                        <NIcon className={`w-4 h-4 ${nStyle.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium truncate ${n.isRead ? 'text-zinc-400' : 'text-white'}`}>{n.title}</p>
                        <p className="text-[10px] text-zinc-600 truncate mt-0.5">{n.message}</p>
                      </div>
                      <span className="text-[10px] text-zinc-600 shrink-0 whitespace-nowrap">{timeAgo(n.createdAt)}</span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">

          {/* Quick Actions */}
          <motion.div variants={fadeUp}>
            <h2 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
              <BoltIcon className="w-4 h-4 text-amber-400" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Browse Events', icon: MagnifyingGlassIcon, to: '/events', color: 'from-violet-600 to-purple-600' },
                { label: 'My Tickets', icon: QrCodeIcon, to: '/dashboard/tickets', color: 'from-emerald-600 to-teal-600' },
                { label: 'Wishlist', icon: HeartIcon, to: '/dashboard/wishlist', color: 'from-pink-500 to-rose-500' },
                { label: 'Bookings', icon: TicketIcon, to: '/dashboard/bookings', color: 'from-blue-600 to-cyan-600' },
              ].map((a) => (
                <MotionLink
                  key={a.label}
                  to={a.to}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="glass rounded-xl p-3 flex items-center gap-2.5 hover:bg-white/[0.03] transition-all group"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
                    <a.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">{a.label}</span>
                </MotionLink>
              ))}
            </div>
          </motion.div>

          {/* Latest Ticket */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                <QrCodeIcon className="w-4 h-4 text-emerald-400" />
                Latest Ticket
              </h2>
              {recentTickets.length > 0 && (
                <Link to="/dashboard/tickets" className="text-[11px] text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 transition-colors">
                  View all <ChevronRightIcon className="w-3 h-3" />
                </Link>
              )}
            </div>
            {isLoading ? (
              <div className="h-32 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
            ) : recentTickets.length === 0 ? (
              <EmptyState
                icon="🎟️"
                title="No tickets yet"
                description="Your tickets will appear here after booking."
                compact
              />
            ) : (
              <div className="glass rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  {recentTickets[0]?.qrImage ? (
                    <div className="w-16 h-16 rounded-xl bg-white p-1 shadow-lg shrink-0">
                      <img src={recentTickets[0].qrImage} alt="QR" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                      <QrCodeIcon className="w-6 h-6 text-zinc-600" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{recentTickets[0]?.event?.title || 'Event'}</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {recentTickets[0]?.event?.startDate
                        ? new Date(recentTickets[0].event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : '—'}
                    </p>
                    {recentTickets[0]?.ticketCode && (
                      <p className="text-[10px] font-mono text-zinc-600 mt-1">{recentTickets[0].ticketCode}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Wishlist Preview */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                <BookmarkIcon className="w-4 h-4 text-pink-400" />
                Wishlist
              </h2>
              {wishlistItems.length > 0 && (
                <Link to="/dashboard/wishlist" className="text-[11px] text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 transition-colors">
                  View all <ChevronRightIcon className="w-3 h-3" />
                </Link>
              )}
            </div>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
                ))}
              </div>
            ) : wishlistItems.length === 0 ? (
              <EmptyState
                icon="💖"
                title="Wishlist is empty"
                description="Save events you love and they'll show up here."
                compact
              />
            ) : (
              <div className="space-y-2">
                {wishlistItems.slice(0, 4).map((w, i) => (
                  <Link
                    key={w._id || i}
                    to={`/events/${w.event?._id || ''}`}
                    className="glass rounded-2xl p-3 flex items-center gap-3 hover:bg-white/[0.03] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600/20 to-rose-600/20 border border-white/[0.04] flex items-center justify-center overflow-hidden shrink-0">
                      {w.event?.bannerImage ? (
                        <img src={w.event.bannerImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <HeartIcon className="w-4 h-4 text-pink-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate group-hover:text-pink-300 transition-colors">{w.event?.title || 'Event'}</p>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                        <span>{w.event?.category || 'Event'}</span>
                        {w.event?.startDate && <span>{new Date(w.event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                      </div>
                    </div>
                    <ArrowUpRightIcon className="w-4 h-4 text-zinc-600 group-hover:text-pink-400 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recommended Events */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-amber-400" />
                Recommended
              </h2>
            </div>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
                ))}
              </div>
            ) : recommendedEvents.length === 0 ? (
              <EmptyState
                icon="✨"
                title="No recommendations"
                description="Attend events to get personalized suggestions."
                compact
              />
            ) : (
              <div className="space-y-2">
                {recommendedEvents.slice(0, 4).map((e, i) => (
                  <Link
                    key={e._id || i}
                    to={`/events/${e._id}`}
                    className="glass rounded-2xl p-3 flex items-center gap-3 hover:bg-white/[0.03] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 border border-white/[0.04] flex items-center justify-center overflow-hidden shrink-0">
                      {e.bannerImage ? (
                        <img src={e.bannerImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg">{CATEGORY_ICONS[e.category?.toLowerCase()] || CATEGORY_ICONS.default}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate group-hover:text-violet-300 transition-colors">{e.title}</p>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                        <span>{e.category}</span>
                        {e.startDate && <span>{new Date(e.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
                      </div>
                    </div>
                    <ArrowUpRightIcon className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Bottom Stats Bar ───────────────────────────────────── */}
      {!isLoading && hasData && (
        <motion.div variants={fadeUp} className="glass rounded-2xl p-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-center">
          {[
            { icon: TicketIcon, value: counts.totalBookings || 0, label: 'Total Bookings', color: 'text-violet-400' },
            { icon: CalendarDaysIcon, value: counts.upcomingEvents || 0, label: 'Upcoming', color: 'text-emerald-400' },
            { icon: CheckCircleIcon, value: counts.completedEvents || 0, label: 'Completed', color: 'text-blue-400' },
            { icon: CurrencyRupeeIcon, value: `₹${(counts.totalSpent || 0).toLocaleString('en-IN')}`, label: 'Total Spent', color: 'text-amber-400' },
            { icon: HeartIcon, value: counts.wishlistCount || 0, label: 'Wishlist', color: 'text-pink-400' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2.5">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <div className="text-left">
                <p className="text-sm font-bold text-white tabular-nums">{s.value}</p>
                <p className="text-[10px] text-zinc-500">{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

/* ── Empty State Component ──────────────────────────────────── */
function EmptyState({ icon, title, description, action, compact }) {
  return (
    <div className={`glass rounded-2xl text-center ${compact ? 'p-5' : 'p-8'}`}>
      <div className={`mx-auto rounded-2xl bg-gradient-to-br from-primary-500/10 to-violet-500/10 flex items-center justify-center mb-3 ${compact ? 'w-12 h-12' : 'w-16 h-16'}`}>
        <span className={compact ? 'text-2xl' : 'text-3xl'}>{icon}</span>
      </div>
      <p className={`font-semibold text-white ${compact ? 'text-sm' : 'text-base'}`}>{title}</p>
      <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">{description}</p>
      {action && (
        <Link
          to={action.to}
          className="inline-flex items-center gap-1.5 mt-3 px-4 py-1.5 rounded-lg bg-primary-600/20 hover:bg-primary-600/30 text-primary-300 text-xs font-semibold border border-primary-500/20 transition-all"
        >
          {action.label}
          <ArrowRightIcon className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}
