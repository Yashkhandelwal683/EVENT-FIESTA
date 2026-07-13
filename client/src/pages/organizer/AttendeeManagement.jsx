import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGetAttendeesQuery, useGetEventsQuery } from '../../features/organizer/organizerApi';
import {
  UsersIcon, MagnifyingGlassIcon, FunnelIcon,
  EnvelopeIcon, TicketIcon, ArrowDownTrayIcon,
  ChevronLeftIcon, ChevronRightIcon, FolderOpenIcon,
} from '@heroicons/react/24/outline';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function AttendeeManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showEventFolders, setShowEventFolders] = useState(true);

  const { data: eventsData } = useGetEventsQuery();
  const { data, isLoading } = useGetAttendeesQuery({
    search: search || undefined,
    status: statusFilter || undefined,
    event: eventFilter || undefined,
    page,
  });

  const events = eventsData?.data?.events || [];
  const attendees = data?.data?.attendees || [];
  const pagination = data?.data?.pagination || { page: 1, total: 0, pages: 1 };

  // Count per event
  const countPerEvent = {};

  attendees.forEach((t) => {
    const name = t.event?.title || 'Unknown Event';
    countPerEvent[name] = (countPerEvent[name] || 0) + 1;
  });

  const handleExport = () => {
    const params = new URLSearchParams({ export: 'true' });
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    if (eventFilter) params.set('event', eventFilter);
    window.open(`${import.meta.env.VITE_API_URL}/api/organizer/attendees?${params.toString()}`, '_blank');
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Attendees</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage and track all event attendees</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowEventFolders(!showEventFolders)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
              showEventFolders ? 'bg-violet-500/10 text-violet-300 border-violet-500/20' : 'bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:text-zinc-200'
            }`}>
            <FolderOpenIcon className="w-3.5 h-3.5" /> Group by Event
          </button>
          <button onClick={handleExport} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-200 text-sm font-medium hover:bg-white/[0.06] transition-all">
            <ArrowDownTrayIcon className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Event Folders */}
      {showEventFolders && events.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => { setEventFilter(''); setPage(1); }}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
              !eventFilter ? 'bg-violet-500/15 text-violet-300 border-violet-500/30' : 'bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:text-zinc-200'
            }`}>
            📁 All Events
          </button>
          {events.slice(0, 20).map((ev) => (
            <button key={ev._id} onClick={() => { setEventFilter(ev._id); setPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                eventFilter === ev._id ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' : 'bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:text-zinc-200'
              }`}>
              <span>📂</span> {ev.title?.length > 20 ? ev.title.slice(0, 20) + '…' : ev.title || 'Untitled'}
              <span className="text-[10px] text-zinc-600 ml-1">({ev.soldCount || 0})</span>
            </button>
          ))}
        </div>
      )}

      {/* Event filter dropdown (non-folder mode) */}
      {!showEventFolders && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input type="text" placeholder="Search by name, email, phone..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/40 transition-all"
            />
          </div>
          <select value={eventFilter} onChange={(e) => { setEventFilter(e.target.value); setPage(1); }}
            className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-violet-500/40 transition-all">
            <option value="">All Events</option>
            {events.map((ev) => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-zinc-500" />
            {['', 'unused', 'checked_in', 'checked_out'].map((s) => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === s ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'bg-white/[0.03] text-zinc-400 border border-white/[0.06] hover:text-zinc-200'
                }`}>
                {s === '' ? 'All' : s === 'unused' ? 'Not Checked In' : s === 'checked_in' ? 'Checked In' : 'Checked Out'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Event folder view */}
      {showEventFolders && eventFilter && (
        <div className="bg-violet-500/5 border border-violet-500/10 rounded-2xl p-3 flex items-center gap-3">
          <span className="text-lg">📂</span>
          <span className="text-sm font-medium text-white">
            {events.find((e) => e._id === eventFilter)?.title || 'Selected Event'}
          </span>
          <span className="text-xs text-zinc-500">— {countPerEvent[events.find((e) => e._id === eventFilter)?.title] || 0} attendees</span>
          <button onClick={() => setEventFilter('')} className="ml-auto text-xs text-zinc-500 hover:text-zinc-200 transition-colors">Clear filter</button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Phone</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Event</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Ticket</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Payment</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Check In</th>
                <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Check Out</th>
                <th className="text-right px-4 py-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={10} className="px-4 py-20 text-center text-zinc-500">Loading...</td></tr>
              )}
              {!isLoading && attendees.length === 0 && (
                <tr><td colSpan={10} className="px-4 py-20 text-center text-zinc-500">
                  <UsersIcon className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                  No attendees found
                </td></tr>
              )}
              {attendees.map((t) => (
                <motion.tr key={t._id} variants={item} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                        {(t.attendeeInfo?.name || t.user?.name || '?')[0]}
                      </div>
                      <span className="text-white text-sm">{t.attendeeInfo?.name || t.user?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-sm">{t.attendeeInfo?.email || t.user?.email || '—'}</td>
                  <td className="px-4 py-3 text-zinc-400 text-sm">{t.attendeeInfo?.phone || t.user?.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-zinc-400 truncate max-w-[120px] inline-block">{t.event?.title || '—'}</span>
                    {t.subEvent?.title && <span className="text-[10px] text-zinc-600 block">· {t.subEvent.title}</span>}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-sm">{t.tierName || 'Standard'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      t.entryStatus === 'checked_in' ? 'bg-emerald-500/20 text-emerald-300' :
                      t.entryStatus === 'checked_out' ? 'bg-orange-500/20 text-orange-300' :
                      'bg-zinc-500/20 text-zinc-400'
                    }`}>
                      {t.entryStatus === 'checked_in' ? 'Inside' : t.entryStatus === 'checked_out' ? 'Exited' : 'Not Arrived'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      t.paymentStatus === 'completed' ? 'bg-emerald-500/20 text-emerald-300' :
                      t.paymentStatus === 'pending' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>{t.paymentStatus}</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">{t.entryTime ? new Date(t.entryTime).toLocaleString() : '—'}</td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">{t.exitTime ? new Date(t.exitTime).toLocaleString() : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-white/[0.04] text-zinc-500 hover:text-zinc-200 transition-all" title="View Ticket"><TicketIcon className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-white/[0.04] text-zinc-500 hover:text-zinc-200 transition-all" title="Message"><EnvelopeIcon className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500">Showing page {pagination.page} of {pagination.pages} ({pagination.total} total)</p>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
              className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-zinc-400 disabled:opacity-30 hover:text-zinc-200 transition-all">
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <span className="text-xs text-zinc-500">{page} / {pagination.pages}</span>
            <button disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)}
              className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-zinc-400 disabled:opacity-30 hover:text-zinc-200 transition-all">
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
