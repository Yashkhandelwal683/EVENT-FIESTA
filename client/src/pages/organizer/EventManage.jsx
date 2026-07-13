import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Calendar, MapPin, Users, DollarSign, TrendingUp,
  Search, Download, Filter, CheckCircle2, XCircle, Clock,
  Ticket, Eye, ChevronDown, User, Mail, Phone, Tag, Layers,
  BarChart3, AlertCircle, Copy, ExternalLink, Star
} from 'lucide-react';
import { useGetEventDetailQuery, useLazyExportRegistrationsQuery } from '../../features/organizer/organizerApi';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'registrations', label: 'Registrations', icon: Users },
  { id: 'bookings', label: 'Bookings', icon: Ticket },
];

const STATUS_COLORS = {
  paid: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  failed: 'bg-red-500/15 text-red-400 border-red-500/20',
  refunded: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  confirmed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/20',
  approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  pending_approval: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/20',
};

function KPICard({ icon: Icon, label, value, sub, color = 'violet' }) {
  const colors = {
    violet: 'from-violet-500/20 to-violet-600/10 border-violet-500/20 text-violet-400',
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/20 text-amber-400',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/20 text-red-400',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20 text-cyan-400',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border bg-gradient-to-br p-5 backdrop-blur-sm ${colors[color]}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-white/5"><Icon className="w-4 h-4" /></div>
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
    </motion.div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_COLORS[status] || 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20'}`}>
      {status === 'paid' || status === 'confirmed' || status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> :
       status === 'failed' || status === 'cancelled' || status === 'rejected' ? <XCircle className="w-3 h-3" /> :
       <Clock className="w-3 h-3" />}
      {status?.replace(/_/g, ' ')}
    </span>
  );
}

function OverviewTab({ stats, event }) {
  const capacityPercent = event.maxParticipants
    ? Math.round(((stats.totalRegistrations || 0) / event.maxParticipants) * 100)
    : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Users} label="Total Registrations" value={stats.totalRegistrations || 0} color="violet" />
        <KPICard icon={DollarSign} label="Total Revenue" value={`₹${(stats.revenue || 0).toLocaleString('en-IN')}`} color="emerald" />
        <KPICard icon={CheckCircle2} label="Approved" value={stats.approved || 0} sub={`${stats.pendingApproval || 0} pending approval`} color="emerald" />
        <KPICard icon={Ticket} label="Ticket Types" value={stats.ticketTypes || 0} sub={`${stats.totalBookings || 0} bookings`} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-400" /> Payment Breakdown
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Paid', count: stats.totalPaid || 0, color: 'bg-emerald-500' },
              { label: 'Pending', count: stats.totalPending || 0, color: 'bg-amber-500' },
              { label: 'Refunded', count: stats.totalRefunded || 0, color: 'bg-purple-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-xs text-zinc-400">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" /> Registration Stats
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Solo</span>
              <span className="text-sm font-bold text-blue-300">{stats.soloRegistrations || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Team</span>
              <span className="text-sm font-bold text-cyan-300">{stats.teamRegistrations || 0}</span>
            </div>
            {capacityPercent !== null && (
              <div className="pt-2 border-t border-white/[0.04]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-zinc-400">Capacity Used</span>
                  <span className="text-xs font-bold text-white">{capacityPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-700"
                    style={{ width: `${Math.min(100, capacityPercent)}%` }}
                  />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">
                  {stats.totalRegistrations || 0} / {event.maxParticipants} seats filled
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400" /> Ticket Types
        </h3>
        {event.tickets && event.tickets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {event.tickets.map((t, i) => (
              <div key={i} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
                <p className="text-sm font-semibold text-white">{t.name || `Ticket ${i + 1}`}</p>
                <p className="text-xs text-zinc-400 mt-1">{t.quantity || t.totalQuantity || 0} available · ₹{t.price || 0}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-500">No ticket types configured</p>
        )}
      </div>
    </div>
  );
}

function RegistrationsTab({ registrations, onExport, eventId }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      const d = r.attendeeDetails || {};
      const userName = r.attendee?.name || d.fullName || '';
      const userEmail = r.attendee?.email || d.email || '';
      const matchSearch = !search ||
        userName.toLowerCase().includes(search.toLowerCase()) ||
        userEmail.toLowerCase().includes(search.toLowerCase()) ||
        (d.phone || '').includes(search) ||
        (r.registrationId || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || r.paymentStatus === statusFilter || r.ticketStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [registrations, search, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/40"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-300 focus:outline-none focus:border-violet-500/40"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onExport('csv')} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-300 hover:bg-white/[0.08] transition">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button onClick={() => onExport('excel')} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-300 hover:bg-white/[0.08] transition">
            <Download className="w-3.5 h-3.5" /> Excel
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">No registrations found</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Attendee</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider hidden md:table-cell">Contact</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider hidden lg:table-cell">Reg ID</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Qty</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Payment</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Ticket</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider hidden xl:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((reg) => {
                  const d = reg.attendeeDetails || {};
                  const name = reg.attendee?.name || d.fullName || '—';
                  const email = reg.attendee?.email || d.email || '—';
                  const phone = d.phone || '—';
                  return (
                    <tr key={reg._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 flex items-center justify-center text-[11px] font-bold text-white">
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{name}</p>
                            {d.college && <p className="text-[10px] text-zinc-500">{d.college}{d.year ? ` · ${d.year}` : ''}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-zinc-400 text-xs flex items-center gap-1"><Mail className="w-3 h-3" />{email}</p>
                        {phone !== '—' && <p className="text-zinc-500 text-[10px] flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" />{phone}</p>}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-[10px] text-zinc-500 font-mono">{reg.registrationId || reg._id?.slice(-8)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white text-sm font-semibold">{reg.quantity || 1}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white text-sm font-semibold">₹{(reg.grandTotal || reg.amount || 0).toLocaleString('en-IN')}</span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={reg.paymentStatus} /></td>
                      <td className="px-4 py-3"><StatusBadge status={reg.ticketStatus} /></td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <span className="text-zinc-500 text-xs">{new Date(reg.registeredAt || reg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-white/[0.04] flex items-center justify-between">
            <p className="text-[11px] text-zinc-500">Showing {filtered.length} of {registrations.length} registrations</p>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingsTab({ bookings }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const info = b.attendeeInfo || {};
      const userName = b.user?.name || info.name || '';
      const userEmail = b.user?.email || info.email || '';
      const matchSearch = !search ||
        userName.toLowerCase().includes(search.toLowerCase()) ||
        userEmail.toLowerCase().includes(search.toLowerCase()) ||
        (b.bookingRef || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [bookings, search, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search name, email, ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/40"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-300 focus:outline-none focus:border-violet-500/40"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Ticket className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">No bookings found</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Attendee</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider hidden md:table-cell">Booking Ref</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Tickets</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider hidden xl:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const info = b.attendeeInfo || {};
                  const name = b.user?.name || info.name || '—';
                  const email = b.user?.email || info.email || '—';
                  return (
                    <tr key={b._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center text-[11px] font-bold text-white">
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{name}</p>
                            <p className="text-[10px] text-zinc-500">{email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-[10px] text-zinc-500 font-mono bg-white/[0.04] px-2 py-0.5 rounded">{b.bookingRef || '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          {(b.tickets || []).map((t, i) => (
                            <p key={i} className="text-xs text-zinc-300">
                              {t.ticket?.name || t.name || 'Ticket'} × {t.quantity}
                            </p>
                          ))}
                          {(!b.tickets || b.tickets.length === 0) && <span className="text-xs text-zinc-500">—</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white text-sm font-semibold">₹{(b.totalAmount || 0).toLocaleString('en-IN')}</span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <span className="text-zinc-500 text-xs">{new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-white/[0.04]">
            <p className="text-[11px] text-zinc-500">Showing {filtered.length} of {bookings.length} bookings</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EventManage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetEventDetailQuery(eventId);
  const [triggerExport] = useLazyExportRegistrationsQuery();
  const [activeTab, setActiveTab] = useState('registrations');

  const event = data?.event;
  const registrations = data?.registrations || [];
  const bookings = data?.bookings || [];
  const stats = data?.stats || {};

  const handleExport = async (format) => {
    try {
      const res = await triggerExport({ eventId, format }, true);
      const blob = res.data;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `registrations-${eventId}.${format === 'excel' ? 'jsonl' : 'csv'}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Exported successfully');
    } catch {
      toast.error('Export failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-zinc-400">
        <AlertCircle className="w-16 h-16 text-zinc-700 mb-4" />
        <p className="text-lg">Event not found</p>
        <button onClick={() => navigate('/organizer/events')} className="mt-4 text-sm text-violet-400 hover:underline">Go back to events</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        {/* Event Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/organizer/events')}
              className="p-2 rounded-xl hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-black text-white tracking-tight">{event.title}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                <span className="flex items-center gap-1 text-xs text-zinc-400"><Calendar className="w-3.5 h-3.5" />{new Date(event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="flex items-center gap-1 text-xs text-zinc-400"><MapPin className="w-3.5 h-3.5" />{event.location || 'Online'}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  event.status === 'published' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' :
                  event.status === 'draft' ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' :
                  'bg-zinc-500/15 text-zinc-400 border-zinc-500/20'
                }`}>{event.status}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  event.eventType === 'team' ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20' : 'bg-violet-500/15 text-violet-400 border-violet-500/20'
                }`}>{event.eventType === 'team' ? 'Team' : 'Solo'}</span>
              </div>
            </div>
            <button
              onClick={() => navigate(`/organizer/events/${eventId}/edit`)}
              className="px-4 py-2 rounded-xl bg-violet-500/15 border border-violet-500/20 text-violet-300 text-sm font-medium hover:bg-violet-500/25 transition hidden sm:flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" /> Edit Event
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <KPICard icon={Users} label="Registrations" value={stats.totalRegistrations || 0} color="violet" />
            <KPICard icon={DollarSign} label="Revenue" value={`₹${(stats.revenue || 0).toLocaleString('en-IN')}`} color="emerald" />
            <KPICard icon={CheckCircle2} label="Approved" value={stats.approved || 0} sub={`${stats.pendingApproval || 0} pending`} color="emerald" />
            <KPICard icon={Ticket} label="Bookings" value={stats.totalBookings || 0} color="blue" />
            <KPICard icon={Layers} label="Capacity" value={stats.remainingSeats !== null ? `${stats.remainingSeats} left` : '∞'} color="cyan" />
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.04] w-fit">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/20 shadow-lg shadow-violet-500/10'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.id === 'registrations' && <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">{registrations.length}</span>}
                {tab.id === 'bookings' && <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">{bookings.length}</span>}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'overview' && <OverviewTab stats={stats} event={event} />}
            {activeTab === 'registrations' && <RegistrationsTab registrations={registrations} onExport={handleExport} eventId={eventId} />}
            {activeTab === 'bookings' && <BookingsTab bookings={bookings} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
