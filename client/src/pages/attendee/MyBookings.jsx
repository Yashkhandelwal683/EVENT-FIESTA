import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  useGetUserBookingsQuery,
  useRequestCancellationMutation,
  useCancelBookingMutation,
} from '../../features/bookings/bookingsApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime, formatDate } from '../../utils/formatDate';
import Spinner from '../../components/ui/Spinner';
import QRModal from '../../components/bookings/QRModal';
import toast from 'react-hot-toast';
import {
  TicketIcon, CalendarDaysIcon, MapPinIcon, ClockIcon,
  MagnifyingGlassIcon, CheckCircleIcon, XCircleIcon,
  CurrencyRupeeIcon, ChevronDownIcon, QrCodeIcon,
  ArrowPathIcon, ExclamationTriangleIcon, EyeIcon,
  TrashIcon, ArrowUpRightIcon, FunnelIcon,
} from '@heroicons/react/24/outline';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const tabs = [
  { key: 'all', label: 'All', icon: TicketIcon },
  { key: 'upcoming', label: 'Upcoming', icon: CalendarDaysIcon },
  { key: 'completed', label: 'Completed', icon: CheckCircleIcon },
  { key: 'cancelled', label: 'Cancelled', icon: XCircleIcon },
];

const statusStyles = {
  pending: { label: 'Pending', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  confirmed: { label: 'Confirmed', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-500/10 text-red-400 border-red-500/20' },
  refunded: { label: 'Refunded', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
};

const cancellationStatusStyles = {
  none: '',
  requested: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [qrTarget, setQrTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useGetUserBookingsQuery({ page, limit: 20 });
  const [requestCancellation, { isLoading: cancelling }] = useRequestCancellationMutation();
  const [cancelBookingDirect, { isLoading: directCancelling }] = useCancelBookingMutation();

  const bookings = data?.bookings || [];
  const pagination = data?.pagination;

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bookingRef?.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return b.status === 'confirmed' && new Date(b.event?.startDate) > new Date();
    if (activeTab === 'completed') return b.status === 'confirmed' && new Date(b.event?.startDate) <= new Date();
    if (activeTab === 'cancelled') return b.status === 'cancelled' || b.status === 'refunded';
    return true;
  });

  const handleRequestCancel = async () => {
    if (!cancelTarget) return;
    try {
      await requestCancellation({
        bookingId: cancelTarget._id,
        cancellationReason: cancelReason || 'No reason provided',
      }).unwrap();
      toast.success('Cancellation request submitted! Admin will review within 24 hours.');
      setCancelTarget(null);
      setCancelReason('');
    } catch (err) {
      toast.error(err?.data?.message ?? 'Failed to submit cancellation request.');
    }
  };

  const handleDirectCancel = async (bookingId) => {
    try {
      await cancelBookingDirect(bookingId).unwrap();
      toast.success('Booking cancelled successfully.');
    } catch (err) {
      toast.error(err?.data?.message ?? 'Failed to cancel booking.');
    }
  };

  const isUpcoming = (b) => b.status === 'confirmed' && new Date(b.event?.startDate) > new Date();
  const canCancel = (b) => b.status === 'confirmed' && b.cancellationStatus !== 'requested';
  const canDirectCancel = (b) => b.status === 'pending';

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">My Bookings</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage your event bookings</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
        >
          <ArrowPathIcon className="w-3.5 h-3.5" />
          Refresh
        </button>
      </motion.div>

      {/* Tabs + Search */}
      <motion.div variants={item} className="flex items-center gap-2 border-b border-white/[0.06] pb-3 flex-wrap">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key); setPage(1); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === key
                ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
                : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
        <div className="ml-auto relative max-w-xs">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/40 transition-all"
          />
        </div>
      </motion.div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <motion.div variants={item} className="glass rounded-2xl p-12 text-center">
          <TicketIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 font-medium">
            {activeTab === 'all' ? 'No bookings yet' : `No ${activeTab} bookings`}
          </p>
          <p className="text-xs text-zinc-600 mt-1 mb-4">
            {activeTab === 'all' ? 'Browse events and book your first ticket!' : 'Try a different filter'}
          </p>
          {activeTab === 'all' && (
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600/80 text-white text-xs font-medium hover:bg-violet-500 transition-all"
            >
              Browse Events <ArrowUpRightIcon className="w-3.5 h-3.5" />
            </Link>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => {
            const ev = booking.event || {};
            const isExpanded = expandedId === booking._id;
            const config = statusStyles[booking.status] || statusStyles.pending;
            const cancelConfig = cancellationStatusStyles[booking.cancellationStatus] || '';

            return (
              <motion.div
                key={booking._id}
                variants={item}
                layout
                className={`glass rounded-2xl overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'ring-1 ring-violet-500/30' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Event Banner */}
                  <div className="relative w-full sm:w-48 h-32 sm:h-auto flex-shrink-0 bg-gradient-to-br from-violet-900/60 to-indigo-900/60">
                    {ev.bannerImage || ev.poster ? (
                      <img src={ev.bannerImage || ev.poster} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <CalendarDaysIcon className="w-10 h-10 text-violet-400/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/60 hidden sm:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent sm:hidden" />
                  </div>

                  {/* Booking Content */}
                  <div className="flex-1 p-4 sm:p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-white truncate">{ev.title || 'Event'}</h3>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${config.bg}`}>
                            {config.label}
                          </span>
                          {booking.cancellationStatus && booking.cancellationStatus !== 'none' && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${cancelConfig}`}>
                              Cancellation {booking.cancellationStatus}
                            </span>
                          )}
                          <span className="text-[10px] text-zinc-500 font-mono">REF: {booking.bookingRef}</span>
                        </div>
                      </div>
                      {booking.issuedTicket?.qrImage && (
                        <button
                          onClick={() => setQrTarget(booking)}
                          className="p-2 rounded-xl bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-all flex-shrink-0"
                          title="View QR"
                        >
                          <QrCodeIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <CalendarDaysIcon className="w-3 h-3 text-zinc-500" />
                        {ev.startDate ? formatDate(ev.startDate, 'dd MMM yyyy') : 'TBD'}
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <MapPinIcon className="w-3 h-3 text-zinc-500" />
                        <span className="truncate">{ev.location || ev.venue?.name || 'Online'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <CurrencyRupeeIcon className="w-3 h-3 text-zinc-500" />
                        {formatCurrency(booking.totalAmount)}
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <TicketIcon className="w-3 h-3 text-zinc-500" />
                        {booking.tickets?.reduce((s, t) => s + t.quantity, 0) || 0} ticket{(booking.tickets?.reduce((s, t) => s + t.quantity, 0) || 0) !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : booking._id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-all"
                      >
                        <EyeIcon className="w-3.5 h-3.5" />
                        {isExpanded ? 'Less' : 'Details'}
                      </button>
                      <Link
                        to={`/events/${ev._id}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-all"
                      >
                        View Event <ArrowUpRightIcon className="w-3 h-3" />
                      </Link>
                      {canDirectCancel(booking) && (
                        <button
                          onClick={() => handleDirectCancel(booking._id)}
                          disabled={directCancelling}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      )}
                      {canCancel(booking) && isUpcoming(booking) && (
                        <button
                          onClick={() => setCancelTarget(booking)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 hover:bg-amber-500/20 transition-all"
                        >
                          <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                          Request Cancel
                        </button>
                      )}
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-white/[0.06] pt-3 space-y-3">
                            {/* Ticket Lines */}
                            {booking.tickets?.length > 0 && (
                              <div>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Tickets</p>
                                <div className="space-y-1">
                                  {booking.tickets.map((t, i) => (
                                    <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs">
                                      <span className="text-zinc-300">{t.ticket?.name || t.ticket?.type || 'Ticket'}</span>
                                      <div className="flex items-center gap-3">
                                        <span className="text-zinc-500">Qty: {t.quantity}</span>
                                        <span className="text-zinc-300 font-medium">{formatCurrency(t.unitPrice * t.quantity)}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Booking Info */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              <div className="p-2 rounded-lg bg-white/[0.02]">
                                <p className="text-[9px] text-zinc-500">Booking Ref</p>
                                <p className="text-zinc-300 font-mono text-[10px]">{booking.bookingRef}</p>
                              </div>
                              <div className="p-2 rounded-lg bg-white/[0.02]">
                                <p className="text-[9px] text-zinc-500">Booked On</p>
                                <p className="text-zinc-300 text-[10px]">{formatDateTime(booking.createdAt)}</p>
                              </div>
                              <div className="p-2 rounded-lg bg-white/[0.02]">
                                <p className="text-[9px] text-zinc-500">Attendee</p>
                                <p className="text-zinc-300 text-[10px]">{booking.attendeeInfo?.name || '—'}</p>
                              </div>
                              {booking.issuedTicket && (
                                <>
                                  <div className="p-2 rounded-lg bg-white/[0.02]">
                                    <p className="text-[9px] text-zinc-500">Ticket Code</p>
                                    <p className="text-zinc-300 font-mono text-[10px]">{booking.issuedTicket.ticketCode}</p>
                                  </div>
                                  <div className="p-2 rounded-lg bg-white/[0.02]">
                                    <p className="text-[9px] text-zinc-500">Entry Status</p>
                                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                                      booking.issuedTicket.isUsed
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'bg-zinc-500/10 text-zinc-400'
                                    }`}>
                                      {booking.issuedTicket.isUsed ? 'Checked In' : 'Not Used'}
                                    </span>
                                  </div>
                                </>
                              )}
                              {booking.cancellationStatus && booking.cancellationStatus !== 'none' && (
                                <div className="p-2 rounded-lg bg-white/[0.02]">
                                  <p className="text-[9px] text-zinc-500">Cancellation</p>
                                  <p className="text-zinc-300 text-[10px] capitalize">{booking.cancellationStatus}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-400 hover:text-white disabled:opacity-30 transition-all"
          >
            Previous
          </button>
          <span className="text-xs text-zinc-500">Page {page} of {pagination.totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={page >= pagination.totalPages}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-400 hover:text-white disabled:opacity-30 transition-all"
          >
            Next
          </button>
        </div>
      )}

      {/* QR Modal */}
      <QRModal isOpen={!!qrTarget} onClose={() => setQrTarget(null)} booking={qrTarget} />

      {/* Cancel Request Modal */}
      <AnimatePresence>
        {cancelTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setCancelTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md glass rounded-2xl p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10">
                  <ExclamationTriangleIcon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Request Cancellation</h3>
                  <p className="text-[10px] text-zinc-500">Admin will review within 24 hours</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs space-y-1">
                <p className="text-zinc-300">{cancelTarget.event?.title}</p>
                <p className="text-zinc-500">REF: {cancelTarget.bookingRef}</p>
                <p className="text-zinc-500">Amount: {formatCurrency(cancelTarget.totalAmount)}</p>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1.5">Reason</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                  placeholder="Why do you want to cancel?"
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/40 resize-none transition-all"
                />
              </div>

              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => { setCancelTarget(null); setCancelReason(''); }}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-400 hover:text-white transition-all"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleRequestCancel}
                  disabled={cancelling}
                  className="px-4 py-2 rounded-xl bg-amber-600/80 text-white text-xs font-medium hover:bg-amber-500 transition-all disabled:opacity-50"
                >
                  {cancelling ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
