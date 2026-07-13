import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useGetOrganizerRegistrationsQuery,
  useApproveTicketMutation,
  useRejectTicketMutation,
} from '../../features/checkout/checkoutApi';
import { useGetEventsQuery } from '../../features/organizer/organizerApi';
import Spinner from '../../components/ui/Spinner';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDate';
import {
  TicketIcon, MagnifyingGlassIcon, FunnelIcon,
  ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon,
  XCircleIcon, EyeIcon, UserCircleIcon, CalendarDaysIcon,
  CurrencyRupeeIcon, ClockIcon, FolderOpenIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const statusFilters = [
  { key: '', label: 'All' },
  { key: 'pending_approval', label: 'Pending Approval' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

export default function TicketManagement() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedReg, setSelectedReg] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data: eventsData } = useGetEventsQuery();
  const { data, isLoading } = useGetOrganizerRegistrationsQuery({
    page,
    status: statusFilter || undefined,
    eventId: eventFilter || undefined,
  });
  const [approveTicket, { isLoading: approving }] = useApproveTicketMutation();
  const [rejectTicket, { isLoading: rejecting }] = useRejectTicketMutation();

  const events = eventsData?.data?.events || [];
  const registrations = data?.registrations || [];
  const pagination = data?.pagination || { total: 0, page: 1, totalPages: 1 };

  const handleApprove = async (id) => {
    try {
      await approveTicket({ id }).unwrap();
      toast.success('Ticket approved successfully');
      setSelectedReg(null);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to approve ticket');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectTicket({ id, reason: rejectReason || 'Rejected by organizer' }).unwrap();
      toast.success('Ticket rejected');
      setSelectedReg(null);
      setRejectReason('');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to reject ticket');
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Ticket Management</h1>
        <p className="text-zinc-400 text-sm mt-1">Approve or reject ticket registrations for your events</p>
      </div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Registrations', value: pagination.total, icon: TicketIcon, color: 'text-primary-400' },
          { label: 'Pending', value: registrations.filter((r) => r.ticketStatus === 'pending_approval').length, icon: ClockIcon, color: 'text-amber-400' },
          { label: 'Approved', value: registrations.filter((r) => r.ticketStatus === 'approved').length, icon: CheckCircleIcon, color: 'text-emerald-400' },
          { label: 'Rejected', value: registrations.filter((r) => r.ticketStatus === 'rejected').length, icon: XCircleIcon, color: 'text-red-400' },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-xl font-bold text-white font-display tabular-nums">{s.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text" placeholder="Search attendee, event..."
            value={search} onChange={(e) => setSearch(e.target.value)}
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
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Attendee</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Event</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Qty</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Amount</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Payment</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={7} className="px-4 py-16 text-center"><Spinner /></td></tr>
              )}
              {!isLoading && registrations.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-16 text-center">
                  <TicketIcon className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                  <p className="text-zinc-500 text-sm">No registrations found</p>
                </td></tr>
              )}
              {registrations.map((reg) => (
                <motion.tr key={reg._id} variants={item} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                        {(reg.attendeeDetails?.fullName || reg.attendee?.name || '?')[0]}
                      </div>
                      <div>
                        <p className="text-sm text-white truncate max-w-[150px]">{reg.attendeeDetails?.fullName || reg.attendee?.name || 'Unknown'}</p>
                        <p className="text-[10px] text-zinc-500">{reg.attendeeDetails?.email || reg.attendee?.email || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-zinc-300 truncate max-w-[150px] inline-block">{reg.event?.title || '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-sm">{reg.quantity || 1}</td>
                  <td className="px-4 py-3 text-zinc-300 font-medium">{formatCurrency(reg.grandTotal || reg.amount || 0)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      reg.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-300' :
                      reg.paymentStatus === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'
                    }`}>{reg.paymentStatus}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      reg.ticketStatus === 'approved' ? 'bg-emerald-500/20 text-emerald-300' :
                      reg.ticketStatus === 'pending_approval' ? 'bg-amber-500/20 text-amber-300' :
                      reg.ticketStatus === 'rejected' ? 'bg-red-500/20 text-red-300' :
                      'bg-zinc-500/20 text-zinc-400'
                    }`}>{reg.ticketStatus?.replace('_', ' ') || 'pending_approval'}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedReg(selectedReg === reg._id ? null : reg._id)}
                        className="p-1.5 rounded-lg hover:bg-white/[0.04] text-zinc-500 hover:text-zinc-200 transition-all"
                        title="View Registration"
                      >
                        <EyeIcon className="w-3.5 h-3.5" />
                      </button>
                      {reg.ticketStatus === 'pending_approval' && (
                        <>
                          <button
                            onClick={() => handleApprove(reg._id)}
                            disabled={approving}
                            className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-500 hover:text-emerald-400 transition-all"
                            title="Approve Ticket"
                          >
                            <CheckCircleIcon className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { setSelectedReg(reg._id); setRejectReason(''); }}
                            disabled={rejecting}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 hover:text-red-400 transition-all"
                            title="Reject Ticket"
                          >
                            <XCircleIcon className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Detail/Reject Modal */}
      <AnimatePresence>
        {selectedReg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedReg(null)}>
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative glass rounded-2xl p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Registration Details</h3>
                <button onClick={() => setSelectedReg(null)} className="p-1 rounded-lg hover:bg-white/[0.04] text-zinc-500">
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>

              {(() => {
                const reg = registrations.find((r) => r._id === selectedReg);
                if (!reg) return null;
                return (
                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="glass-sm p-3 rounded-xl">
                        <p className="text-[10px] text-zinc-500 uppercase">Attendee</p>
                        <p className="text-xs text-white mt-0.5">{reg.attendeeDetails?.fullName || reg.attendee?.name || '—'}</p>
                        <p className="text-[10px] text-zinc-500">{reg.attendeeDetails?.email || reg.attendee?.email || ''}</p>
                      </div>
                      <div className="glass-sm p-3 rounded-xl">
                        <p className="text-[10px] text-zinc-500 uppercase">Phone</p>
                        <p className="text-xs text-zinc-300 mt-0.5">{reg.attendeeDetails?.phone || reg.attendee?.phone || '—'}</p>
                      </div>
                      <div className="glass-sm p-3 rounded-xl">
                        <p className="text-[10px] text-zinc-500 uppercase">Event</p>
                        <p className="text-xs text-white mt-0.5">{reg.event?.title || '—'}</p>
                      </div>
                      <div className="glass-sm p-3 rounded-xl">
                        <p className="text-[10px] text-zinc-500 uppercase">Quantity</p>
                        <p className="text-xs text-white mt-0.5">{reg.quantity}</p>
                      </div>
                      <div className="glass-sm p-3 rounded-xl">
                        <p className="text-[10px] text-zinc-500 uppercase">Amount</p>
                        <p className="text-xs text-white font-medium mt-0.5">{formatCurrency(reg.grandTotal || reg.amount || 0)}</p>
                      </div>
                      <div className="glass-sm p-3 rounded-xl">
                        <p className="text-[10px] text-zinc-500 uppercase">Payment</p>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                          reg.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>{reg.paymentStatus}</span>
                      </div>
                    </div>

                    {reg.attendeeDetails?.college && (
                      <div className="glass-sm p-3 rounded-xl">
                        <p className="text-[10px] text-zinc-500 uppercase">College</p>
                        <p className="text-xs text-zinc-300 mt-0.5">{reg.attendeeDetails.college}{reg.attendeeDetails.department ? ` · ${reg.attendeeDetails.department}` : ''}</p>
                      </div>
                    )}

                    {reg.ticketStatus === 'pending_approval' && (
                      <div className="border-t border-white/[0.06] pt-4 space-y-3">
                        <div>
                          <label className="text-xs text-zinc-400 block mb-1.5">Rejection Reason (optional)</label>
                          <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter reason for rejection..."
                            rows={2}
                            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/40 transition-all resize-none"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleApprove(reg._id)}
                            disabled={approving}
                            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-medium hover:from-emerald-500 hover:to-emerald-400 transition-all disabled:opacity-50"
                          >
                            <CheckCircleIcon className="w-4 h-4" /> Approve Ticket
                          </button>
                          <button
                            onClick={() => handleReject(reg._id)}
                            disabled={rejecting}
                            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-medium hover:from-red-500 hover:to-red-400 transition-all disabled:opacity-50"
                          >
                            <XCircleIcon className="w-4 h-4" /> Reject Ticket
                          </button>
                        </div>
                      </div>
                    )}

                    {reg.ticketStatus === 'approved' && reg.ticket?.qrImage && (
                      <div className="border-t border-white/[0.06] pt-4 text-center">
                        <p className="text-xs text-zinc-500 mb-2">Generated Ticket QR</p>
                        <img src={reg.ticket.qrImage} alt="Ticket QR" className="w-32 h-32 mx-auto rounded-xl" />
                        <p className="text-xs text-violet-300 font-mono mt-2">{reg.ticket.ticketCode}</p>
                      </div>
                    )}
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
