import { useState, useMemo, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  ArrowLeft, Calendar, MapPin, Users, DollarSign, TrendingUp,
  Search, CheckCircle2, XCircle, Clock, Ticket, Eye,
  ChevronDown, User, Mail, Phone, BarChart3, AlertCircle,
  ExternalLink, Star, Settings, Image, MessageSquare, Megaphone,
  Copy, Trash2, Share2, Edit3, Send, MoreVertical,
  PieChart, TrendingDown, Wallet, Receipt, UserCheck,
  CalendarDays, Clock3, Globe, Lock, Unlock, Flame,
  Sparkles, ArrowUpRight, Zap, Target, Shield, Layers,
  Navigation, Hash, AtSign
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { useGetEventDetailQuery } from '../../features/organizer/organizerApi';
import EventHeroCarousel from '../../components/events/workspace/EventHeroCarousel';
import EventStatsOverlay from '../../components/events/workspace/EventStatsOverlay';
import EventTimeline from '../../components/events/workspace/EventTimeline';
import EventQuickActions from '../../components/events/workspace/EventQuickActions';
import AttendeePreview from '../../components/events/workspace/AttendeePreview';

// ─── Constants ───────────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'overview', label: 'Overview', icon: Eye, group: 'analytics' },
  { id: 'registrations', label: 'Registrations', icon: Users, group: 'analytics' },
  { id: 'attendees', label: 'Attendees', icon: UserCheck, group: 'analytics' },
  { id: 'tickets', label: 'Tickets', icon: Ticket, group: 'manage' },
  { id: 'revenue', label: 'Revenue', icon: DollarSign, group: 'manage' },
  { id: 'schedule', label: 'Schedule', icon: CalendarDays, group: 'content' },
  { id: 'media', label: 'Media', icon: Image, group: 'content' },
  { id: 'reviews', label: 'Reviews', icon: MessageSquare, group: 'engage' },
  { id: 'announcements', label: 'Announcements', icon: Megaphone, group: 'engage' },
  { id: 'settings', label: 'Settings', icon: Settings, group: 'system' },
];

const NAV_GROUPS = [
  { id: 'analytics', label: 'Analytics' },
  { id: 'manage', label: 'Management' },
  { id: 'content', label: 'Content' },
  { id: 'engage', label: 'Engagement' },
  { id: 'system', label: 'System' },
];

const STATUS_MAP = {
  paid:       { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: CheckCircle2 },
  pending:    { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/20',   icon: Clock },
  failed:     { bg: 'bg-red-500/10',     text: 'text-red-400',     border: 'border-red-500/20',     icon: XCircle },
  refunded:   { bg: 'bg-purple-500/10',  text: 'text-purple-400',  border: 'border-purple-500/20',  icon: Receipt },
  confirmed:  { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: CheckCircle2 },
  cancelled:  { bg: 'bg-red-500/10',     text: 'text-red-400',     border: 'border-red-500/20',     icon: XCircle },
  approved:   { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: CheckCircle2 },
  pending_approval: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: Clock },
  rejected:   { bg: 'bg-red-500/10',     text: 'text-red-400',     border: 'border-red-500/20',     icon: XCircle },
  draft:      { bg: 'bg-zinc-500/10',    text: 'text-zinc-400',    border: 'border-zinc-500/20',    icon: Edit3 },
  published:  { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: CheckCircle2 },
};

// ─── Shared Components ───────────────────────────────────────────
function StatusBadge({ status, size = 'sm' }) {
  const s = STATUS_MAP[status] || STATUS_MAP.draft;
  const Icon = s.icon;
  const sizes = {
    xs: 'text-[10px] px-2 py-[1px] gap-1',
    sm: 'text-[11px] px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-1.5',
  };
  return (
    <span className={`inline-flex items-center rounded-full font-semibold border ${sizes[size]} ${s.bg} ${s.text} ${s.border}`}>
      <Icon className="w-3 h-3" />
      {status?.replace(/_/g, ' ')}
    </span>
  );
}

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-xl bg-white/[0.04] ${className}`} />;
}

function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div className={`rounded-2xl border border-white/[0.05] bg-gradient-to-b from-white/[0.03] to-white/[0.01] backdrop-blur-sm ${hover ? 'hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <Icon className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {subtitle && <p className="text-[11px] text-zinc-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-zinc-600" />
      </div>
      <p className="text-sm font-medium text-zinc-400 mb-1">{title}</p>
      <p className="text-xs text-zinc-600 text-center max-w-[240px]">{description}</p>
    </div>
  );
}

function CustomTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-xl bg-[#1a1a2e] border border-white/10 shadow-2xl backdrop-blur-sm">
      <p className="text-[10px] text-zinc-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
          {formatter ? formatter(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Loading Skeleton ────────────────────────────────────────────
function WorkspaceSkeleton() {
  return (
    <div className="min-h-screen bg-[#08080f] flex">
      <aside className="w-64 border-r border-white/[0.04] bg-[#0a0a12] p-4 hidden lg:block">
        <Skeleton className="h-12 w-full mb-6" />
        <div className="space-y-1">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </aside>
      <div className="flex-1 p-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72 mb-8" />
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────
function Sidebar({ activeSection, onNavigate, event, registrations, reviews, sidebarOpen, onClose }) {
  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-[260px] bg-[#0b0b14] border-r border-white/[0.04] z-50 flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header */}
        <div className="p-4 border-b border-white/[0.04]">
          <button onClick={() => { useNavigate()('/organizer/events'); onClose(); }}
            className="flex items-center gap-2 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors mb-4 group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Events</span>
          </button>
          <div className="flex items-center gap-3">
            {event.poster ? (
              <img src={event.poster} alt="" className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/[0.06] flex-shrink-0" />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600/40 to-fuchsia-600/40 flex items-center justify-center text-lg font-black text-white ring-2 ring-white/[0.06] flex-shrink-0">
                {event.title?.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-white truncate">{event.title}</p>
              <StatusBadge status={event.status} size="xs" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1 scrollbar-thin">
          {NAV_GROUPS.map((group) => {
            const items = NAV_SECTIONS.filter((s) => s.group === group.id);
            if (items.length === 0) return null;
            return (
              <div key={group.id} className="mb-3">
                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.15em] px-3 mb-1.5">{group.label}</p>
                <div className="space-y-0.5">
                  {items.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    const count = section.id === 'registrations' ? registrations.length : section.id === 'reviews' ? reviews.length : null;
                    return (
                      <button key={section.id} onClick={() => { onNavigate(section.id); onClose(); }}
                        className={`relative w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 group ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'}`}>
                        {isActive && (
                          <motion.div layoutId="sidebar-active" className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/15 to-violet-500/5 border border-violet-500/20" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />
                        )}
                        <Icon className={`w-4 h-100 relative z-10 flex-shrink-0 ${isActive ? 'text-violet-400' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                        <span className="relative z-10">{section.label}</span>
                        {count !== null && (
                          <span className={`relative z-10 ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${isActive ? 'bg-violet-500/20 text-violet-300' : 'bg-white/[0.05] text-zinc-500'}`}>
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/[0.04]">
          <button onClick={() => { useNavigate()(`/organizer/events/${event._id}/edit`); onClose(); }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 text-violet-300 text-[13px] font-medium hover:from-violet-600/30 hover:to-fuchsia-600/30 transition-all duration-200">
            <Edit3 className="w-3.5 h-3.5" /> Edit Event
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Overview ────────────────────────────────────────────────────
function OverviewSection({ event, stats, registrations, bookings, reviews }) {
  const navigate = useNavigate();
  const capacityPercent = event.maxParticipants
    ? Math.round(((stats.totalRegistrations || 0) / event.maxParticipants) * 100)
    : null;

  const registrationTrend = useMemo(() => {
    const daily = {};
    [...registrations, ...bookings].forEach((r) => {
      const d = new Date(r.createdAt || r.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      daily[d] = (daily[d] || 0) + 1;
    });
    return Object.entries(daily).slice(-7).map(([date, count]) => ({ date, count }));
  }, [registrations, bookings]);

  const revenueTrend = useMemo(() => {
    const daily = {};
    registrations.filter(r => r.paymentStatus === 'paid').forEach((r) => {
      const d = new Date(r.createdAt || r.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      daily[d] = (daily[d] || 0) + (r.grandTotal || r.amount || 0);
    });
    return Object.entries(daily).slice(-7).map(([date, amount]) => ({ date, amount }));
  }, [registrations]);

  const paymentPie = useMemo(() => [
    { name: 'Paid', value: stats.totalPaid || 0, color: '#10b981' },
    { name: 'Pending', value: stats.totalPending || 0, color: '#f59e0b' },
    { name: 'Refunded', value: stats.totalRefunded || 0, color: '#a855f7' },
  ].filter(v => v.value > 0), [stats]);

  return (
    <div className="space-y-6">
      {/* ─── Premium Hero Carousel ─── */}
      <EventHeroCarousel event={event} stats={stats} navigate={navigate} />

      {/* ─── Floating Stats Overlay ─── */}
      <EventStatsOverlay stats={stats} event={event} />

      {/* ─── Quick Actions Grid ─── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <SectionHeader icon={Zap} title="Quick Actions" subtitle="Manage your event" />
        <EventQuickActions eventId={event._id} navigate={navigate} />
      </motion.div>

      {/* ─── Premium KPI Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Users, label: 'Total Registrations', value: stats.totalRegistrations || 0, gradient: 'from-violet-600/20 to-violet-400/5', iconBg: 'bg-violet-500/15 text-violet-400' },
          { icon: DollarSign, label: 'Total Revenue', value: `₹${(stats.revenue || 0).toLocaleString('en-IN')}`, gradient: 'from-emerald-600/20 to-emerald-400/5', iconBg: 'bg-emerald-500/15 text-emerald-400' },
          { icon: Ticket, label: 'Total Bookings', value: stats.totalBookings || 0, gradient: 'from-blue-600/20 to-blue-400/5', iconBg: 'bg-blue-500/15 text-blue-400' },
          { icon: Star, label: 'Avg Rating', value: stats.avgRating || '—', gradient: 'from-amber-600/20 to-amber-400/5', iconBg: 'bg-amber-500/15 text-amber-400' },
          { icon: CheckCircle2, label: 'Approved', value: stats.approved || 0, sub: `${stats.pendingApproval || 0} pending`, gradient: 'from-emerald-600/20 to-teal-400/5', iconBg: 'bg-emerald-500/15 text-emerald-400' },
          { icon: Wallet, label: 'Your Earnings', value: `₹${(stats.organizerEarnings || 0).toLocaleString('en-IN')}`, gradient: 'from-cyan-600/20 to-cyan-400/5', iconBg: 'bg-cyan-500/15 text-cyan-400' },
          { icon: Layers, label: 'Seats Left', value: stats.remainingSeats != null ? stats.remainingSeats : '∞', sub: event.maxParticipants ? `${event.maxParticipants} total` : null, gradient: 'from-zinc-600/20 to-zinc-400/5', iconBg: 'bg-zinc-500/15 text-zinc-400' },
          { icon: Receipt, label: 'Commission', value: `₹${(stats.totalCommission || 0).toLocaleString('en-IN')}`, gradient: 'from-red-600/20 to-rose-400/5', iconBg: 'bg-rose-500/15 text-rose-400' },
        ].map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.04, duration: 0.3 }}>
            <Card hover className="p-4 group">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-xl ${kpi.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                  <kpi.icon className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors opacity-0 group-hover:opacity-100" />
              </div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium mb-0.5">{kpi.label}</p>
              <p className="text-xl font-black text-white tracking-tight">{kpi.value}</p>
              {kpi.sub && <p className="text-[10px] text-zinc-500 mt-1">{kpi.sub}</p>}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ─── Charts + Timeline Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Charts */}
        <div className="lg:col-span-2 space-y-4">
          {/* Registration Trend */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="p-5">
              <SectionHeader icon={TrendingUp} title="Registration Trend" subtitle="Last 7 days" />
              {registrationTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={registrationTrend}>
                    <defs>
                      <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#52525b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#52525b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="count" stroke="#8b5cf6" fillOpacity={1} fill="url(#regGrad)" strokeWidth={2.5} dot={{ r: 3, fill: '#8b5cf6', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#8b5cf6', stroke: '#08080f', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState icon={BarChart3} title="No data yet" description="Registration trend will appear here once you get your first registration" />
              )}
            </Card>
          </motion.div>

          {/* Revenue Trend */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
            <Card className="p-5">
              <SectionHeader icon={DollarSign} title="Revenue Trend" subtitle="Last 7 days" />
              {revenueTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={revenueTrend}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#52525b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#52525b' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />} />
                    <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="url(#revGrad)" strokeWidth={2.5} dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#10b981', stroke: '#08080f', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState icon={DollarSign} title="No revenue yet" description="Revenue trend will appear once payments are processed" />
              )}
            </Card>
          </motion.div>
        </div>

        {/* Right: Timeline */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="p-5 h-full">
            <SectionHeader icon={Clock} title="Event Timeline" subtitle="Milestones" />
            <EventTimeline event={event} />
          </Card>
        </motion.div>
      </div>

      {/* ─── Payment + Capacity + Attendees Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Payment Status */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
          <Card className="p-5 h-full">
            <SectionHeader icon={PieChart} title="Payment Status" />
            {paymentPie.length > 0 ? (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={120} height={120}>
                  <RePieChart>
                    <Pie data={paymentPie} innerRadius={35} outerRadius={50} dataKey="value" strokeWidth={0} paddingAngle={3}>
                      {paymentPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="space-y-3 flex-1">
                  {paymentPie.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                        <span className="text-xs text-zinc-400">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState icon={PieChart} title="No payments" description="Payment breakdown will show here" />
            )}
          </Card>
        </motion.div>

        {/* Capacity Gauge */}
        {capacityPercent !== null && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <Card className="p-5 h-full">
              <SectionHeader icon={Target} title="Capacity" subtitle={`${stats.totalRegistrations || 0} of ${event.maxParticipants}`} />
              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke="url(#capGrad2)" strokeWidth="10"
                      strokeDasharray={`${Math.min(100, capacityPercent) * 3.14} 314`} strokeLinecap="round"
                      className="transition-all duration-1000 ease-out" />
                    <defs>
                      <linearGradient id="capGrad2" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-white">{capacityPercent}%</span>
                    <span className="text-[8px] text-zinc-500 uppercase tracking-wider">Filled</span>
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  {[
                    { label: 'Filled', value: stats.totalRegistrations || 0, color: 'text-white' },
                    { label: 'Remaining', value: stats.remainingSeats, color: 'text-cyan-400' },
                    { label: 'Total', value: event.maxParticipants, color: 'text-zinc-300' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">{item.label}</span>
                      <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Recent Attendees */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
          <Card className="p-5 h-full">
            <SectionHeader icon={UserCheck} title="Recent Attendees" subtitle="Latest registrations" />
            <AttendeePreview registrations={registrations} bookings={bookings} />
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Registrations ───────────────────────────────────────────────
function RegistrationsSection({ registrations }) {
  const [search, setSearch] = useState('');
  const [payFilter, setPayFilter] = useState('all');
  const [ticketFilter, setTicketFilter] = useState('all');

  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      const d = r.attendeeDetails || {};
      const name = r.attendee?.name || d.fullName || '';
      const email = r.attendee?.email || d.email || '';
      const q = search.toLowerCase();
      const matchSearch = !search || name.toLowerCase().includes(q) || email.toLowerCase().includes(q) || (d.phone || '').includes(search) || (r.registrationId || '').toLowerCase().includes(q);
      const matchPay = payFilter === 'all' || r.paymentStatus === payFilter;
      const matchTicket = ticketFilter === 'all' || r.ticketStatus === ticketFilter;
      return matchSearch && matchPay && matchTicket;
    });
  }, [registrations, search, payFilter, ticketFilter]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input type="text" placeholder="Search by name, email, phone, or ID..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <FilterSelect value={payFilter} onChange={setPayFilter} options={[
              { value: 'all', label: 'All Payments' },
              { value: 'paid', label: 'Paid' },
              { value: 'pending', label: 'Pending' },
              { value: 'failed', label: 'Failed' },
              { value: 'refunded', label: 'Refunded' },
            ]} />
            <FilterSelect value={ticketFilter} onChange={setTicketFilter} options={[
              { value: 'all', label: 'All Tickets' },
              { value: 'approved', label: 'Approved' },
              { value: 'pending_approval', label: 'Pending' },
              { value: 'rejected', label: 'Rejected' },
            ]} />
            <span className="text-[11px] text-zinc-500 ml-1">{filtered.length} of {registrations.length}</span>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={Users} title="No registrations found" description={search || payFilter !== 'all' || ticketFilter !== 'all' ? 'Try adjusting your filters' : 'Registrations will appear here once attendees sign up'} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Attendee', 'Contact', 'Reg ID', 'Qty', 'Amount', 'Payment', 'Ticket', 'Date'].map((h) => (
                    <th key={h} className={`px-5 py-3.5 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-[0.1em] ${h === 'Contact' ? 'hidden md:table-cell' : h === 'Reg ID' ? 'hidden lg:table-cell' : h === 'Date' ? 'hidden xl:table-cell' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((reg, i) => {
                  const d = reg.attendeeDetails || {};
                  const name = reg.attendee?.name || d.fullName || '—';
                  const email = reg.attendee?.email || d.email || '—';
                  const phone = d.phone || '—';
                  return (
                    <motion.tr key={reg._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/25 to-fuchsia-500/25 flex items-center justify-center text-[11px] font-bold text-violet-300 ring-1 ring-white/[0.06] flex-shrink-0">
                            {name !== '—' ? name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium text-white truncate">{name}</p>
                            {d.college && <p className="text-[10px] text-zinc-500 truncate">{d.college}{d.year ? ` · ${d.year}` : ''}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <div className="space-y-0.5">
                          <p className="text-xs text-zinc-400 truncate max-w-[180px]">{email}</p>
                          {phone !== '—' && <p className="text-[10px] text-zinc-600">{phone}</p>}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <code className="text-[10px] text-zinc-500 bg-white/[0.04] px-2 py-1 rounded-md font-mono">{reg.registrationId || reg._id?.slice(-8)}</code>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-white font-semibold">{reg.quantity || 1}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-white font-semibold">₹{(reg.grandTotal || reg.amount || 0).toLocaleString('en-IN')}</span>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={reg.paymentStatus} /></td>
                      <td className="px-5 py-3.5"><StatusBadge status={reg.ticketStatus} /></td>
                      <td className="px-5 py-3.5 hidden xl:table-cell">
                        <span className="text-[11px] text-zinc-500">{new Date(reg.registeredAt || reg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function FilterSelect({ value, onChange, options }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[11px] text-zinc-300 font-medium focus:outline-none focus:border-violet-500/40 transition-all cursor-pointer">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
    </div>
  );
}

// ─── Attendees ───────────────────────────────────────────────────
function AttendeesSection({ bookings, registrations }) {
  const [search, setSearch] = useState('');

  const allAttendees = useMemo(() => {
    const fromRegs = registrations.map((r) => ({
      id: r._id, source: 'Registration',
      name: r.attendee?.name || r.attendeeDetails?.fullName || '—',
      email: r.attendee?.email || r.attendeeDetails?.email || '—',
      phone: r.attendeeDetails?.phone || '—',
      amount: r.grandTotal || r.amount || 0,
      paymentStatus: r.paymentStatus, date: r.createdAt,
    }));
    const fromBookings = bookings.map((b) => ({
      id: b._id, source: 'Booking',
      name: b.user?.name || b.attendeeInfo?.name || '—',
      email: b.user?.email || b.attendeeInfo?.email || '—',
      phone: b.attendeeInfo?.phone || '—',
      amount: b.totalAmount || 0,
      paymentStatus: b.status, date: b.createdAt,
    }));
    return [...fromRegs, ...fromBookings].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [registrations, bookings]);

  const filtered = allAttendees.filter((a) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return a.name.toLowerCase().includes(s) || a.email.toLowerCase().includes(s) || a.phone.includes(s);
  });

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input type="text" placeholder="Search attendees..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all" />
        </div>
      </Card>

      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={UserCheck} title="No attendees yet" description="Attendee data will appear here from registrations and bookings" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Attendee', 'Contact', 'Source', 'Amount', 'Status', 'Date'].map((h) => (
                    <th key={h} className={`px-5 py-3.5 text-left text-[10px] font-bold text-zinc-500 uppercase tracking-[0.1em] ${h === 'Contact' ? 'hidden md:table-cell' : h === 'Date' ? 'hidden xl:table-cell' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/25 to-blue-500/25 flex items-center justify-center text-[11px] font-bold text-cyan-300 ring-1 ring-white/[0.06] flex-shrink-0">
                          {a.name !== '—' ? a.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-white truncate">{a.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{a.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell"><span className="text-xs text-zinc-400">{a.phone}</span></td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${a.source === 'Booking' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-violet-500/10 text-violet-400 border-violet-500/20'}`}>
                        {a.source}
                      </span>
                    </td>
                    <td className="px-5 py-3.5"><span className="text-white font-semibold">₹{a.amount.toLocaleString('en-IN')}</span></td>
                    <td className="px-5 py-3.5"><StatusBadge status={a.paymentStatus} /></td>
                    <td className="px-5 py-3.5 hidden xl:table-cell">
                      <span className="text-[11px] text-zinc-500">{new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── Tickets ─────────────────────────────────────────────────────
function TicketsSection({ tickets, registrations }) {
  const totalSold = tickets.reduce((s, t) => s + (t.soldQuantity || 0), 0);
  const totalRevenue = tickets.reduce((s, t) => s + ((t.soldQuantity || 0) * (t.price || 0)), 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: Ticket, label: 'Ticket Types', value: tickets.length },
          { icon: Users, label: 'Total Sold', value: totalSold, color: 'text-violet-400' },
          { icon: DollarSign, label: 'Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: 'text-emerald-400' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/[0.04]"><s.icon className="w-4 h-4 text-zinc-400" /></div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">{s.label}</p>
                  <p className={`text-lg font-black ${s.color || 'text-white'}`}>{s.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {tickets.length === 0 ? (
        <Card>
          <EmptyState icon={Ticket} title="No ticket types" description="Configure ticket types when creating your event" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tickets.map((t, i) => {
            const sold = t.soldQuantity || 0;
            const remaining = (t.totalQuantity || 0) - sold;
            const percent = t.totalQuantity ? Math.min(100, (sold / t.totalQuantity) * 100) : 0;
            const ticketColors = { vip: { icon: Star, bg: 'bg-amber-500/15 text-amber-400 border-amber-500/20', bar: 'from-amber-500 to-orange-500' }, earlyBird: { icon: Flame, bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', bar: 'from-emerald-500 to-teal-500' } };
            const style = ticketColors[t.type] || { icon: Ticket, bg: 'bg-violet-500/15 text-violet-400 border-violet-500/20', bar: 'from-violet-500 to-fuchsia-500' };
            const TypeIcon = style.icon;
            return (
              <motion.div key={t._id || i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card hover className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${style.bg}`}>
                        <TypeIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-white">{t.name}</p>
                        <p className="text-[10px] text-zinc-500 capitalize">{t.type || 'General'}</p>
                      </div>
                    </div>
                    <p className="text-xl font-black text-white">₹{(t.price || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Sold / Total</span>
                      <span className="text-xs font-bold text-white">{sold} / {t.totalQuantity || 0}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full bg-gradient-to-r ${style.bar}`} />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-zinc-500">Remaining: <span className="text-cyan-400 font-semibold">{remaining}</span></span>
                      <span className="text-[10px] text-zinc-500">Revenue: <span className="text-emerald-400 font-semibold">₹{(sold * (t.price || 0)).toLocaleString('en-IN')}</span></span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Revenue ─────────────────────────────────────────────────────
function RevenueSection({ stats, payments }) {
  const dailyRevenue = useMemo(() => {
    const daily = {};
    payments.forEach((p) => {
      const d = new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      daily[d] = (daily[d] || 0) + (p.amount || 0);
    });
    return Object.entries(daily).slice(-14).map(([date, amount]) => ({ date, amount }));
  }, [payments]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: DollarSign, label: 'Total Revenue', value: `₹${(stats.totalPayments || stats.revenue || 0).toLocaleString('en-IN')}`, color: 'text-emerald-400', iconBg: 'bg-emerald-500/15 text-emerald-400' },
          { icon: Wallet, label: 'Your Earnings', value: `₹${(stats.organizerEarnings || 0).toLocaleString('en-IN')}`, color: 'text-cyan-400', iconBg: 'bg-cyan-500/15 text-cyan-400' },
          { icon: Receipt, label: 'Commission', value: `₹${(stats.totalCommission || 0).toLocaleString('en-IN')}`, color: 'text-amber-400', iconBg: 'bg-amber-500/15 text-amber-400' },
          { icon: TrendingDown, label: 'Refunded', value: `₹${stats.totalRefunded || 0}`, color: 'text-purple-400', iconBg: 'bg-purple-500/15 text-purple-400' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-4">
              <div className="p-2 rounded-xl w-fit mb-3 ${s.iconBg}"><s.icon className="w-4 h-4" /></div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">{s.label}</p>
              <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-5">
          <SectionHeader icon={BarChart3} title="Revenue Over Time" subtitle="Last 14 days" />
          {dailyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dailyRevenue} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#52525b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#52525b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />} />
                <defs>
                  <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <Bar dataKey="amount" fill="url(#barGrad2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon={BarChart3} title="No revenue data" description="Revenue chart will populate with payment data" />
          )}
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="p-5">
          <SectionHeader icon={Receipt} title="Recent Payments" />
          {payments.length === 0 ? (
            <EmptyState icon={Receipt} title="No payments yet" description="Payment records will appear here" />
          ) : (
            <div className="space-y-2">
              {payments.slice(0, 10).map((p, i) => (
                <motion.div key={p._id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.03 }}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10"><DollarSign className="w-3.5 h-3.5 text-emerald-400" /></div>
                    <div>
                      <p className="text-[13px] text-white font-medium">{p.method || p.paymentMethod || 'Online Payment'}</p>
                      <p className="text-[10px] text-zinc-500">{new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-emerald-400">₹{(p.amount || 0).toLocaleString('en-IN')}</span>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}

// ─── Schedule ────────────────────────────────────────────────────
function ScheduleSection({ event }) {
  const schedule = event.schedule || [];
  return (
    <div className="space-y-4">
      {schedule.length === 0 ? (
        <Card>
          <EmptyState icon={CalendarDays} title="No schedule yet" description="Add sessions when editing your event to build a timeline" />
        </Card>
      ) : (
        <div className="space-y-3">
          {schedule.map((s, i) => (
            <motion.div key={s.id || i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5 hover:border-violet-500/10 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 flex-shrink-0">
                    <Clock3 className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-white">{s.title || s.name || `Session ${i + 1}`}</p>
                    {s.description && <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2">{s.description}</p>}
                    <div className="flex flex-wrap items-center gap-3 mt-2.5">
                      {s.startTime && (
                        <span className="text-[10px] text-zinc-500 flex items-center gap-1 bg-white/[0.03] px-2 py-1 rounded-md">
                          <Clock3 className="w-3 h-3" /> {s.startTime}{s.endTime ? ` — ${s.endTime}` : ''}
                        </span>
                      )}
                      {s.speaker && (
                        <span className="text-[10px] text-zinc-500 flex items-center gap-1 bg-white/[0.03] px-2 py-1 rounded-md">
                          <User className="w-3 h-3" /> {s.speaker}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Media ───────────────────────────────────────────────────────
function MediaSection({ event }) {
  return (
    <div className="space-y-4">
      <Card className="p-5">
        <SectionHeader icon={Image} title="Event Poster" />
        {event.poster || event.bannerImage ? (
          <div className="relative rounded-xl overflow-hidden max-w-lg ring-1 ring-white/[0.06]">
            <img src={event.poster || event.bannerImage} alt="Event poster" className="w-full h-auto object-cover" />
            <div className="absolute top-3 right-3 flex gap-2">
              <a href={event.poster || event.bannerImage} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-all border border-white/10">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          <EmptyState icon={Image} title="No poster uploaded" description="Upload a poster when editing your event" />
        )}
      </Card>

      {event.gallery?.length > 0 && (
        <Card className="p-5">
          <SectionHeader icon={Image} title="Gallery" subtitle={`${event.gallery.length} images`} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {event.gallery.map((img, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                className="rounded-xl overflow-hidden aspect-video ring-1 ring-white/[0.06] hover:ring-violet-500/30 transition-all cursor-pointer group">
                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Reviews ─────────────────────────────────────────────────────
function ReviewsSection({ reviews, stats }) {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-4xl font-black text-amber-400">{stats.avgRating || '—'}</p>
            <div className="flex items-center gap-0.5 mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-4 h-4 ${s <= Math.round(stats.avgRating || 0) ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`} />
              ))}
            </div>
            <p className="text-[10px] text-zinc-500 mt-2">{stats.totalReviews || 0} reviews</p>
          </div>
          <div className="h-12 w-px bg-white/[0.06]" />
          <div className="space-y-1.5 flex-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => Math.round(r.rating) === star).length;
              const percent = reviews.length ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 w-3 text-right">{star}</span>
                  <Star className="w-3 h-3 text-amber-400/50" />
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                    <div className="h-full rounded-full bg-amber-400/60 transition-all duration-500" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="text-[10px] text-zinc-600 w-6">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {reviews.length === 0 ? (
        <Card>
          <EmptyState icon={MessageSquare} title="No reviews yet" description="Reviews from attendees will appear here" />
        </Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((r, i) => (
            <motion.div key={r._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/25 to-orange-500/25 flex items-center justify-center text-[11px] font-bold text-amber-300 ring-1 ring-white/[0.06] flex-shrink-0">
                    {r.user?.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[13px] font-medium text-white">{r.user?.name || 'Anonymous'}</p>
                      <span className="text-[10px] text-zinc-500">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= (r.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`} />
                      ))}
                    </div>
                    {r.comment && <p className="text-xs text-zinc-400 leading-relaxed">{r.comment}</p>}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Announcements ───────────────────────────────────────────────
function AnnouncementsSection() {
  return (
    <Card className="p-8">
      <div className="text-center max-w-sm mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
          <Megaphone className="w-7 h-7 text-violet-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Send Announcements</h3>
        <p className="text-xs text-zinc-500 mb-6">Keep your attendees informed with updates and notifications</p>
        <div className="flex items-center justify-center gap-3">
          <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-medium hover:from-violet-500 hover:to-violet-400 transition-all shadow-lg shadow-violet-500/20 flex items-center gap-2">
            <Mail className="w-4 h-4" /> Email All
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-300 text-sm font-medium hover:bg-white/[0.08] transition-all flex items-center gap-2">
            <Send className="w-4 h-4" /> Push Notification
          </button>
        </div>
      </div>
    </Card>
  );
}

// ─── Settings ────────────────────────────────────────────────────
function SettingsSection({ event, navigate, eventId }) {
  return (
    <div className="space-y-4 max-w-2xl">
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Globe className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-white">Event Visibility</p>
              <p className="text-[10px] text-zinc-500">Control who can see this event</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${event.visibility === 'public' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
            {event.visibility === 'public' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {event.visibility}
          </span>
        </div>
      </Card>

      <Card className="p-5">
        <SectionHeader icon={Zap} title="Quick Actions" />
        <div className="space-y-2">
          {[
            { icon: Edit3, label: 'Edit Event', desc: 'Update event details and settings', color: 'text-violet-400', action: () => navigate(`/organizer/events/${eventId}/edit`) },
            { icon: Copy, label: 'Duplicate Event', desc: 'Create a copy of this event', color: 'text-blue-400' },
            { icon: Share2, label: 'Share Event', desc: 'Get a shareable link', color: 'text-cyan-400' },
          ].map((item, i) => (
            <button key={i} onClick={item.action}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.08] transition-all text-left group">
              <div className={`p-2 rounded-lg bg-white/[0.04] group-hover:bg-white/[0.06] transition-colors`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div>
                <p className="text-[13px] font-medium text-white">{item.label}</p>
                <p className="text-[10px] text-zinc-500">{item.desc}</p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 ml-auto transition-colors" />
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-5 border-red-500/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
            <Trash2 className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-red-400">Danger Zone</p>
            <p className="text-[10px] text-zinc-500">Irreversible actions</p>
          </div>
        </div>
        <button className="px-4 py-2 rounded-xl border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-all">
          Delete Event
        </button>
      </Card>
    </div>
  );
}

// ─── MAIN WORKSPACE ──────────────────────────────────────────────
export default function EventWorkspace() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetEventDetailQuery(eventId);
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const event = data?.event;
  const registrations = data?.registrations || [];
  const bookings = data?.bookings || [];
  const tickets = data?.tickets || [];
  const reviews = data?.reviews || [];
  const payments = data?.payments || [];
  const stats = data?.stats || {};

  if (isLoading) return <WorkspaceSkeleton />;

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#08080f]">
        <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-5">
          <AlertCircle className="w-9 h-9 text-zinc-600" />
        </div>
        <p className="text-lg font-bold text-white mb-1">Event not found</p>
        <p className="text-sm text-zinc-500 mb-6">This event may have been deleted</p>
        <button onClick={() => navigate('/organizer/events')}
          className="px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-all shadow-lg shadow-violet-500/20">
          Go to My Events
        </button>
      </div>
    );
  }

  const sections = {
    overview: <OverviewSection event={event} stats={stats} registrations={registrations} bookings={bookings} reviews={reviews} />,
    registrations: <RegistrationsSection registrations={registrations} />,
    attendees: <AttendeesSection bookings={bookings} registrations={registrations} />,
    tickets: <TicketsSection tickets={tickets} registrations={registrations} />,
    revenue: <RevenueSection stats={stats} payments={payments} />,
    schedule: <ScheduleSection event={event} />,
    media: <MediaSection event={event} />,
    reviews: <ReviewsSection reviews={reviews} stats={stats} />,
    announcements: <AnnouncementsSection />,
    settings: <SettingsSection event={event} navigate={navigate} eventId={eventId} />,
  };

  return (
    <div className="min-h-screen bg-[#08080f] flex text-white">
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} event={event} registrations={registrations} reviews={reviews} sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0">
        {/* Breadcrumb */}
        <div className="sticky top-0 z-30 bg-[#08080f]/80 backdrop-blur-xl border-b border-white/[0.04]">
          <div className="px-4 sm:px-6 py-3 flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-white/[0.05] text-zinc-400 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
            <nav className="flex items-center gap-1.5 text-[11px]">
              <button onClick={() => navigate('/organizer/events')} className="text-zinc-500 hover:text-zinc-300 transition-colors">Events</button>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-300 font-medium truncate max-w-[180px]">{event.title}</span>
              <span className="text-zinc-700">/</span>
              <span className="text-violet-400 font-semibold capitalize">{activeSection}</span>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {sections[activeSection]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
