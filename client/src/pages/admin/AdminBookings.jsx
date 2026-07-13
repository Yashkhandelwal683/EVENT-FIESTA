import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useGetAdminBookingsQuery,
  useGetAdminBookingStatsQuery,
  useGetAdminEventsQuery,
} from '../../features/checkout/checkoutApi';
import Spinner from '../../components/ui/Spinner';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDate';
import {
  TicketIcon, MagnifyingGlassIcon, FunnelIcon,
  ChevronLeftIcon, ChevronRightIcon, EyeIcon,
  CalendarDaysIcon, CurrencyRupeeIcon, ClockIcon,
  CheckCircleIcon, XCircleIcon, ArrowPathIcon,
  UserCircleIcon, BuildingOfficeIcon, QrCodeIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const statusFilters = [
  { key: '', label: 'All' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'pending', label: 'Pending' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'refunded', label: 'Refunded' },
];

const statusStyles = {
  confirmed: 'bg-emerald-500/20 text-emerald-300',
  pending: 'bg-amber-500/20 text-amber-300',
  cancelled: 'bg-red-500/20 text-red-300',
  refunded: 'bg-blue-500/20 text-blue-300',
};

const cancellationStyles = {
  none: '',
  requested: 'bg-amber-500/20 text-amber-300',
  approved: 'bg-emerald-500/20 text-emerald-300',
  rejected: 'bg-red-500/20 text-red-300',
};

export default function AdminBookings() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { data, isLoading } = useGetAdminBookingsQuery({
    page,
    limit: 20,
    status: statusFilter || undefined,
    eventId: eventFilter || undefined,
    search: search || undefined,
  });
  const { data: statsData, isLoading: statsLoading } = useGetAdminBookingStatsQuery();
  const { data: eventsData } = useGetAdminEventsQuery({ limit: 200 });

  const bookings = data?.bookings || [];
  const pagination = data?.pagination || { total: 0, page: 1, totalPages: 1 };
  const stats = statsData || { total: 0, confirmed: 0, pending: 0, cancelled: 0, refunded: 0, todayCount: 0, totalRevenue: 0 };
  const events = eventsData?.events || [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Bookings</h1>
        <p className="text-zinc-400 text-sm mt-1">View and manage all platform bookings</p>
      </div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Bookings', value: stats.total, icon: TicketIcon, color: 'text-primary-400' },
          { label: "Today's Bookings", value: stats.todayCount, icon: CalendarDaysIcon, color: 'text-fuchsia-400' },
          { label: 'Confirmed', value: stats.confirmed, icon: CheckCircleIcon, color: 'text-emerald-400' },
          { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: CurrencyRupeeIcon, color: 'text-amber-400' },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            {statsLoading ? (
              <div className="h-7 w-20 bg-white/5 rounded animate-pulse" />
            ) : (
              <p className="text-xl font-bold text-white font-display tabular-nums">{s.value}</p>
            )}
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by booking ref, name, event..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/40 transition-all"
          />
        </div>
        <select
          value={eventFilter}
          onChange={(e) => { setEventFilter(e.target.value); setPage(1); }}
          className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-violet-500/40 transition-all"
        >
          <option value="">All Events</option>
          {events.map((ev) => (
            <option key={ev._id} value={ev._id}>{ev.title}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-4 h-4 text-zinc-500" />
          {statusFilters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setStatusFilter(key); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === key
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'bg-white/[0.03] text-zinc-400 border border-white/[0.06] hover:text-zinc-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Booking Ref</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Event</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Attendee</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Tickets</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Amount</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Date</th>
                <th className="text-right px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={8} className="px-4 py-16 text-center"><Spinner /></td></tr>
              )}
              {!isLoading && bookings.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-16 text-center">
                  <TicketIcon className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                  <p className="text-zinc-500 text-sm">No bookings found</p>
                </td></tr>
              )}
              {bookings.map((b) => (
                <motion.tr key={b._id} variants={item} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-violet-300 font-mono text-xs">{b.bookingRef || b._id?.toString().slice(-8)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-zinc-300 truncate max-w-[150px] inline-block">{b.event?.title || '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                        {(b.user?.name || b.attendeeInfo?.name || '?')[0]}
                      </div>
                      <div>
                        <p className="text-sm text-white truncate max-w-[150px]">{b.user?.name || b.attendeeInfo?.name || '—'}</p>
                        <p className="text-[10px] text-zinc-500">{b.user?.email || b.attendeeInfo?.email || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-sm">{b.ticketCount || 0}</td>
                  <td className="px-4 py-3 text-zinc-300 font-medium">{formatCurrency(b.totalAmount || 0)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusStyles[b.status] || 'bg-zinc-500/20 text-zinc-400'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">{formatDateTime(b.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedBooking(selectedBooking === b._id ? null : b._id)}
                      className="p-1.5 rounded-lg hover:bg-white/[0.04] text-zinc-500 hover:text-zinc-200 transition-all"
                      title="View Details"
                    >
                      <EyeIcon className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedBooking(null)}>
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative glass rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Booking Details</h3>
                <button onClick={() => setSelectedBooking(null)} className="p-1 rounded-lg hover:bg-white/[0.04] text-zinc-500">
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>

              {(() => {
                const b = bookings.find((bk) => bk._id === selectedBooking);
                if (!b) return null;
                return (
                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="glass-sm p-3 rounded-xl">
                        <p className="text-[10px] text-zinc-500 uppercase">Booking Ref</p>
                        <p className="text-xs font-mono text-violet-300 mt-0.5">{b.bookingRef || '—'}</p>
                      </div>
                      <div className="glass-sm p-3 rounded-xl">
                        <p className="text-[10px] text-zinc-500 uppercase">Status</p>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-block mt-0.5 ${statusStyles[b.status] || ''}`}>
                          {b.status}
                        </span>
                      </div>
                      <div className="glass-sm p-3 rounded-xl">
                        <p className="text-[10px] text-zinc-500 uppercase">Event</p>
                        <p className="text-xs text-white mt-0.5">{b.event?.title || '—'}</p>
                        {b.event?.startDate && (
                          <p className="text-[10px] text-zinc-500 mt-0.5">{formatDateTime(b.event.startDate)}</p>
                        )}
                      </div>
                      <div className="glass-sm p-3 rounded-xl">
                        <p className="text-[10px] text-zinc-500 uppercase">Venue</p>
                        <p className="text-xs text-zinc-300 mt-0.5">{b.event?.venue || '—'}</p>
                      </div>
                      <div className="glass-sm p-3 rounded-xl">
                        <p className="text-[10px] text-zinc-500 uppercase">Attendee</p>
                        <p className="text-xs text-white mt-0.5">{b.user?.name || b.attendeeInfo?.name || '—'}</p>
                        <p className="text-[10px] text-zinc-500">{b.user?.email || b.attendeeInfo?.email || ''}</p>
                      </div>
                      <div className="glass-sm p-3 rounded-xl">
                        <p className="text-[10px] text-zinc-500 uppercase">Phone</p>
                        <p className="text-xs text-zinc-300 mt-0.5">{b.attendeeInfo?.phone || '—'}</p>
                      </div>
                      <div className="glass-sm p-3 rounded-xl">
                        <p className="text-[10px] text-zinc-500 uppercase">Tickets</p>
                        <p className="text-xs text-white mt-0.5">{b.ticketCount || 0}</p>
                      </div>
                      <div className="glass-sm p-3 rounded-xl">
                        <p className="text-[10px] text-zinc-500 uppercase">Amount</p>
                        <p className="text-xs text-white font-medium mt-0.5">{formatCurrency(b.totalAmount || 0)}</p>
                      </div>
                    </div>

                    {/* Ticket Breakdown */}
                    {b.tickets?.length > 0 && (
                      <div className="glass-sm p-3 rounded-xl">
                        <p className="text-[10px] text-zinc-500 uppercase mb-2">Ticket Breakdown</p>
                        <div className="space-y-1.5">
                          {b.tickets.map((t, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <span className="text-zinc-400">Ticket #{i + 1} &times; {t.quantity}</span>
                              <span className="text-zinc-300">{formatCurrency((t.unitPrice || 0) * (t.quantity || 0))}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Organizer */}
                    {b.organizer && (
                      <div className="glass-sm p-3 rounded-xl">
                        <p className="text-[10px] text-zinc-500 uppercase">Organizer</p>
                        <p className="text-xs text-white mt-0.5">{b.organizer.name || '—'}</p>
                        <p className="text-[10px] text-zinc-500">{b.organizer.email || ''}</p>
                      </div>
                    )}

                    {/* Cancellation Info */}
                    {b.cancellationStatus !== 'none' && (
                      <div className="glass-sm p-3 rounded-xl">
                        <p className="text-[10px] text-zinc-500 uppercase">Cancellation</p>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-block mt-0.5 ${cancellationStyles[b.cancellationStatus] || ''}`}>
                          {b.cancellationStatus}
                        </span>
                        {b.refundStatus !== 'none' && (
                          <p className="text-[10px] text-zinc-500 mt-1">Refund: {b.refundStatus} ({formatCurrency(b.refundAmount || 0)})</p>
                        )}
                      </div>
                    )}

                    {/* QR Code */}
                    {b.qrCode && (
                      <div className="border-t border-white/[0.06] pt-4 text-center">
                        <p className="text-xs text-zinc-500 mb-2">Booking QR Code</p>
                        <img src={b.qrCode} alt="Booking QR" className="w-32 h-32 mx-auto rounded-xl" />
                      </div>
                    )}

                    <div className="text-[10px] text-zinc-600 pt-2 border-t border-white/[0.04]">
                      Created: {formatDateTime(b.createdAt)} &middot; Updated: {formatDateTime(b.updatedAt)}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500">Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)</p>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
              className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-zinc-400 disabled:opacity-30 hover:text-zinc-200 transition-all">
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <span className="text-xs text-zinc-500">{page} / {pagination.totalPages}</span>
            <button disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-zinc-400 disabled:opacity-30 hover:text-zinc-200 transition-all">
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
