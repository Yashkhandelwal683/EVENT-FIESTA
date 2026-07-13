import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGetEventsQuery } from '../../features/events/eventsApi';
import { useDeleteEventMutation } from '../../features/events/eventsApi';
import {
  CalendarDaysIcon, MapPinIcon, PencilIcon, TrashIcon,
  PlusCircleIcon, FunnelIcon, MagnifyingGlassIcon,
  ChartBarIcon, TicketIcon, UsersIcon, EyeIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function MyEvents() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();
  const { data, isLoading } = useGetEventsQuery({ organizer: 'me', status: statusFilter || undefined });
  const [deleteEvent] = useDeleteEventMutation();
  const events = data?.events || [];

  const filtered = search
    ? events.filter((e) => e.title?.toLowerCase().includes(search.toLowerCase()))
    : events;

  const handleDelete = async (event) => {
    if (!confirm(`Delete "${event.title}"? This action cannot be undone.`)) return;
    try {
      await deleteEvent(event._id).unwrap();
      toast.success('Event deleted');
    } catch {
      toast.error('Failed to delete event');
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">My Events</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage all your events from one place</p>
        </div>
        <Link to="/organizer/create-event" className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-600/20">
          <span>➕</span> Create Event
        </Link>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input type="text" placeholder="Search events..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/40 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-4 h-4 text-zinc-500" />
          {['', 'draft', 'published', 'completed', 'cancelled'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === s ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'bg-white/[0.03] text-zinc-400 border border-white/[0.06] hover:text-zinc-200'
              }`}
            >{s || 'All'}</button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-white/[0.02] border border-white/[0.04] overflow-hidden">
              <div className="h-40 bg-white/5" />
              <div className="p-4 space-y-3"><div className="h-5 w-3/4 bg-white/5 rounded" /><div className="h-4 w-1/2 bg-white/5 rounded" /><div className="h-4 w-full bg-white/5 rounded" /></div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">🎟</span>
          <p className="text-zinc-400">No events found</p>
          <Link to="/organizer/create-event" className="inline-flex items-center gap-1.5 mt-4 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all">
            <span>➕</span> Create your first event
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((event) => {
          const start = new Date(event.startDate);
          const end = event.endDate ? new Date(event.endDate) : start;
          const now = new Date();
          const isLive = event.status === 'published' && start <= now && end >= now;
          const isUpcoming = event.status === 'published' && start > now;
          const statusBadge = event.status === 'draft' ? 'Draft' :
            isLive ? 'Live' : isUpcoming ? 'Upcoming' :
            event.status === 'completed' || end < now ? 'Completed' :
            event.status === 'cancelled' ? 'Cancelled' : event.status;
          const badgeColor = event.status === 'draft' ? 'bg-amber-500/20 text-amber-300' :
            isLive ? 'bg-emerald-500/20 text-emerald-300' :
            isUpcoming ? 'bg-blue-500/20 text-blue-300' :
            event.status === 'completed' || end < now ? 'bg-zinc-500/20 text-zinc-400' :
            event.status === 'cancelled' ? 'bg-red-500/20 text-red-300' : 'bg-zinc-500/20 text-zinc-400';
          const eventType = event.eventType || 'solo';
          const price = event.price || 0;
          const seatsFilled = event.registrations || event.soldCount || 0;
          const totalRevenue = event.totalRevenue || event.revenue || 0;
          const remaining = event.maxParticipants ? event.maxParticipants - seatsFilled : null;

          return (
            <motion.div key={event._id} variants={item} className="group rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] hover:border-violet-500/25 overflow-hidden transition-all duration-200">
              <div className="h-44 relative overflow-hidden">
                {event.poster || event.bannerImage ? (
                  <img src={event.poster || event.bannerImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-900/40 to-zinc-900 flex items-center justify-center">
                    <CalendarDaysIcon className="w-10 h-10 text-zinc-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>{statusBadge}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${eventType === 'team' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-violet-500/20 text-violet-300'}`}>
                    {eventType === 'team' ? '👥 Team' : '👤 Solo'}
                  </span>
                </div>
                {event.category && (
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-lg bg-black/50 backdrop-blur-sm text-[10px] text-zinc-300">{event.category}</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-sm font-semibold text-white truncate group-hover:text-violet-300 transition-colors">{event.title}</h3>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-zinc-500">
                  <MapPinIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{event.location || event.venue?.name || event.venue?.city || 'Online'}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                  <CalendarDaysIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{start.toLocaleDateString()} {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-semibold text-emerald-400">
                    {price === 0 ? 'Free' : `₹${price.toLocaleString('en-IN')}`}
                  </span>
                  {remaining !== null && (
                    <span className="text-xs text-zinc-500">{remaining} seats left</span>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-white/[0.04]">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-white">{seatsFilled}</p>
                    <p className="text-[10px] text-zinc-500">Sold</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-emerald-400">₹{totalRevenue.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-zinc-500">Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-violet-300">{remaining !== null ? remaining : '∞'}</p>
                    <p className="text-[10px] text-zinc-500">Left</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-amber-400">{event.maxParticipants || '∞'}</p>
                    <p className="text-[10px] text-zinc-500">Capacity</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-white/[0.04]">
                  <button onClick={() => navigate(`/organizer/events/${event._id}/manage`)} className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-violet-500/10 text-violet-300 text-xs font-medium hover:bg-violet-500/20 transition-all flex-1 justify-center min-w-0">
                    <EyeIcon className="w-3.5 h-3.5 flex-shrink-0" /> <span className="hidden sm:inline">Manage</span>
                  </button>
                  <button onClick={() => navigate(`/organizer/events/${event._id}/edit`)} className="p-1.5 rounded-lg bg-white/[0.04] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-all" title="Edit">
                    <PencilIcon className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => navigate(`/organizer/attendees?event=${event._id}`)} className="p-1.5 rounded-lg bg-white/[0.04] text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all" title="Attendees">
                    <UsersIcon className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => navigate(`/organizer/analytics?event=${event._id}`)} className="p-1.5 rounded-lg bg-white/[0.04] text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all" title="Analytics">
                    <ChartBarIcon className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(event)} className="p-1.5 rounded-lg bg-white/[0.04] text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete">
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
