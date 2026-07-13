import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetMyTicketsQuery } from '../../features/checkout/checkoutApi';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime, formatDate } from '../../utils/formatDate';
import {
  TicketIcon, CalendarDaysIcon, MapPinIcon, UserCircleIcon,
  ChevronDownIcon, MagnifyingGlassIcon, QrCodeIcon,
  ArrowDownTrayIcon, EyeIcon, ClockIcon, CheckCircleIcon,
  XCircleIcon, CurrencyRupeeIcon,
} from '@heroicons/react/24/outline';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const tabs = [
  { key: 'upcoming', label: 'Upcoming', icon: CalendarDaysIcon },
  { key: 'past', label: 'Past', icon: CheckCircleIcon },
  { key: 'cancelled', label: 'Cancelled', icon: XCircleIcon },
];

const statusConfig = {
  pending_approval: { label: 'Pending Approval', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  approved: { label: 'Approved', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  cancelled: { label: 'Cancelled', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
};

export default function MyTickets() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useGetMyTicketsQuery({ status: activeTab });
  const tickets = data?.tickets || [];

  const filtered = tickets.filter((t) =>
    t.event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.registrationId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const downloadPDF = async (ticket) => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [100, 180] });

      const primary = '#4f46e5';
      const white = '#ffffff';

      doc.setFillColor(79, 70, 229);
      doc.rect(0, 0, 100, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('EVENT FIESTA', 50, 10, { align: 'center' });
      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
      doc.text('Premium Event Ticket', 50, 16, { align: 'center' });
      doc.text('Digital Entry Pass', 50, 21, { align: 'center' });

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      const title = ticket.event?.title || 'Event';
      doc.text(title.length > 20 ? title.substring(0, 18) + '..' : title, 50, 32, { align: 'center' });

      doc.setFontSize(5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      let y = 40;
      const leftX = 10;
      const rightX = 55;
      const lineH = 4;

      const details = [
        ['Ticket ID', ticket.ticket?.ticketCode || ticket.registrationId || 'N/A'],
        ['Attendee', ticket.attendeeDetails?.fullName || 'N/A'],
        ['Email', ticket.attendeeDetails?.email || 'N/A'],
        ['Phone', ticket.attendeeDetails?.phone || 'N/A'],
        ['Event', ticket.event?.title || 'N/A'],
        ['Date', ticket.event?.startDate ? formatDate(ticket.event.startDate, 'dd MMM yyyy') : 'N/A'],
      ];

      details.forEach(([label, value]) => {
        doc.setTextColor(100, 116, 139);
        doc.text(label, leftX, y);
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        const valStr = String(value);
        doc.text(valStr.length > 18 ? valStr.substring(0, 16) + '..' : valStr, rightX, y);
        doc.setFont('helvetica', 'normal');
        y += lineH;
      });

      y += 3;
      if (ticket.ticket?.qrImage) {
        const qrData = ticket.ticket.qrImage;
        if (qrData.startsWith('data:')) {
          doc.addImage(qrData, 'PNG', 25, y, 20, 20);
          y += 22;
        }
      } else if (ticket.issuedTicket?.qrImage) {
        const qrData = ticket.issuedTicket.qrImage;
        if (qrData.startsWith('data:')) {
          doc.addImage(qrData, 'PNG', 25, y, 20, 20);
          y += 22;
        }
      } else {
        doc.setDrawColor(200);
        doc.setFillColor(245, 245, 250);
        doc.roundedRect(30, y, 15, 15, 2, 2, 'FD');
        doc.setTextColor(150, 150, 180);
        doc.setFontSize(4);
        doc.text('QR', 37.5, y + 8, { align: 'center' });
        y += 18;
      }

      doc.setFontSize(4);
      doc.setTextColor(148, 163, 184);
      doc.text('Valid for one-time entry only. Non-transferable.', 50, y + 2, { align: 'center' });
      doc.text('Powered by Event Fiesta', 50, 178, { align: 'center' });

      doc.save(`ticket-${ticket.registrationId || 'download'}.pdf`);
    } catch (e) {
      console.error('PDF generation error:', e);
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-white font-display">My Tickets</h1>
        <p className="text-zinc-400 text-sm mt-1">View and manage all your event tickets</p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={item} className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key); setExpandedId(null); }}
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
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/40 transition-all"
          />
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <motion.div variants={item} className="glass rounded-2xl p-12 text-center">
          <TicketIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 font-medium">No {activeTab} tickets</p>
          <p className="text-xs text-zinc-600 mt-1">
            {activeTab === 'upcoming' ? 'Register for events to see your tickets here' :
             activeTab === 'past' ? 'Your past event tickets will appear here' :
             'You have no cancelled tickets'}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((ticket) => {
            const ev = ticket.event || {};
            const isExpanded = expandedId === ticket._id;
            const config = statusConfig[ticket.ticketStatus] || statusConfig.pending_approval;
            const qrImage = ticket.ticket?.qrImage || ticket.issuedTicket?.qrImage;

            return (
              <motion.div
                key={ticket._id}
                variants={item}
                layout
                className={`glass rounded-2xl overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-1 ring-violet-500/30' : ''}`}
              >
                {/* Card Header - Banner */}
                <div className="relative h-28 bg-gradient-to-br from-primary-900/60 to-violet-900/60">
                  {ev.bannerImage ? (
                    <img src={ev.bannerImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CalendarDaysIcon className="w-10 h-10 text-primary-400/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-white truncate max-w-[70%]">{ev.title || 'Event'}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium border ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <MapPinIcon className="w-3 h-3 text-zinc-500" />
                      {ev.venue?.name || 'Venue'}{ev.venue?.city ? `, ${ev.venue.city}` : ''}
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <CalendarDaysIcon className="w-3 h-3 text-zinc-500" />
                      {ev.startDate ? formatDateTime(ev.startDate) : 'TBD'}
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <CurrencyRupeeIcon className="w-3 h-3 text-zinc-500" />
                      {formatCurrency(ticket.grandTotal)} · {ticket.quantity} ticket{ticket.quantity > 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* QR Preview */}
                  {qrImage && (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <img src={qrImage} alt="QR" className="w-10 h-10 rounded-lg" />
                      <div>
                        <p className="text-[10px] font-medium text-zinc-300">QR Ticket</p>
                        <p className="text-[9px] text-zinc-500">{ticket.ticket?.ticketCode || 'Scan for entry'}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => toggleExpand(ticket._id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-all"
                    >
                      <EyeIcon className="w-3.5 h-3.5" />
                      {isExpanded ? 'Less' : 'Details'}
                    </button>
                    <button
                      onClick={() => downloadPDF(ticket)}
                      disabled={ticket.ticketStatus !== 'approved'}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-violet-600/80 to-fuchsia-600/80 text-xs text-white font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                      Download PDF
                    </button>
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
                        <div className="border-t border-white/[0.06] pt-3 space-y-2 text-xs">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="glass-sm p-2 rounded-lg">
                              <p className="text-[9px] text-zinc-500">Registration ID</p>
                              <p className="text-zinc-300 font-mono text-[10px] truncate">{ticket.registrationId}</p>
                            </div>
                            <div className="glass-sm p-2 rounded-lg">
                              <p className="text-[9px] text-zinc-500">Transaction ID</p>
                              <p className="text-zinc-300 font-mono text-[10px] truncate">{ticket.transactionId || '—'}</p>
                            </div>
                            <div className="glass-sm p-2 rounded-lg">
                              <p className="text-[9px] text-zinc-500">Attendee</p>
                              <p className="text-zinc-300 text-[10px] truncate">{ticket.attendeeDetails?.fullName || '—'}</p>
                            </div>
                            <div className="glass-sm p-2 rounded-lg">
                              <p className="text-[9px] text-zinc-500">Payment</p>
                              <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                                ticket.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                              }`}>{ticket.paymentStatus}</span>
                            </div>
                            {ticket.attendeeDetails?.college && (
                              <div className="glass-sm p-2 rounded-lg col-span-2">
                                <p className="text-[9px] text-zinc-500">College</p>
                                <p className="text-zinc-300 text-[10px]">{ticket.attendeeDetails.college}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!isLoading && filtered.length > 0 && data?.pagination?.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <p className="text-xs text-zinc-500">Page 1 of {data.pagination.totalPages}</p>
        </div>
      )}
    </motion.div>
  );
}
