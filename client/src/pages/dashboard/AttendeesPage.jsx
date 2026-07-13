import { useState } from 'react';
import { useGetAttendeesByOrganizerQuery, useLazyExportAttendeesQuery } from '../../features/qr/qrApi';
import { MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function AttendeesPage() {
  const { data, isLoading } = useGetAttendeesByOrganizerQuery();
  const [triggerExport] = useLazyExportAttendeesQuery();
  const [search, setSearch] = useState('');
  const [expandedEvents, setExpandedEvents] = useState({});

  const grouped = data?.data?.grouped || {};

  const toggleEvent = (title) => {
    setExpandedEvents((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const filterAttendees = (tickets) => {
    if (!search) return tickets;
    const q = search.toLowerCase();
    return tickets.filter((t) =>
      (t.attendeeInfo?.name || t.user?.name || '').toLowerCase().includes(q) ||
      (t.attendeeInfo?.email || t.user?.email || '').toLowerCase().includes(q) ||
      (t.attendeeInfo?.phone || '').includes(q) ||
      t.ticketCode?.toLowerCase().includes(q)
    );
  };

  const handleExport = async (eventId) => {
    try {
      const result = await triggerExport({ eventId, format: 'csv' });
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'attendees.csv';
      a.click();
    } catch {
      console.warn('Export failed');
    }
  };

  const totalAttendees = Object.values(grouped).reduce((sum, g) => {
    return sum + Object.values(g.subEvents || {}).reduce((s, t) => s + t.length, 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Attendees</h1>
          <p className="text-slate-400 text-sm mt-1">{totalAttendees} total attendees across all events</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search attendees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface-input border border-surface-border rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500/50 w-48 lg:w-64"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="glass p-12 text-center">
          <div className="text-4xl mb-4">🎫</div>
          <h3 className="font-display font-semibold text-white text-lg mb-2">No attendees yet</h3>
          <p className="text-slate-400 text-sm">Attendees will appear here after tickets are booked.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([eventTitle, group]) => {
            const subEntries = Object.entries(group.subEvents || {});
            const isExpanded = expandedEvents[eventTitle] !== false;
            return (
              <div key={eventTitle} className="glass overflow-hidden border-surface-border/60">
                <button
                  onClick={() => toggleEvent(eventTitle)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.02] transition-colors text-left"
                >
                  {isExpanded ? <ChevronDownIcon className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronRightIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-white text-sm">{eventTitle}</h3>
                    <p className="text-xs text-slate-500">
                      {subEntries.reduce((s, [, t]) => s + t.length, 0)} attendees · {subEntries.length} sub-events
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleExport(group.event?._id); }}
                    className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-primary-300 transition-colors"
                    title="Export CSV"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                  </button>
                </button>

                {isExpanded && (
                  <div className="border-t border-surface-border/60">
                    {subEntries.length === 0 ? (
                      <div className="p-4 text-center text-sm text-slate-500">Main event attendees (no sub-event)</div>
                    ) : (
                      subEntries.map(([subTitle, attendees]) => {
                        const filtered = filterAttendees(attendees);
                        if (filtered.length === 0 && search) return null;
                        return (
                          <div key={subTitle} className="border-t border-surface-border/40 first:border-t-0">
                            <div className="px-4 py-2 bg-surface-card/30">
                              <span className="text-xs font-medium text-slate-400">{subTitle === '__main__' ? 'Main Event' : subTitle}</span>
                              <span className="text-xs text-slate-600 ml-2">({attendees.length})</span>
                            </div>
                            <div className="divide-y divide-surface-border/40">
                              {filtered.map((ticket) => (
                                <div key={ticket._id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                    {(ticket.attendeeInfo?.name || ticket.user?.name || '?')[0]}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white truncate">{ticket.attendeeInfo?.name || ticket.user?.name || 'Unknown'}</p>
                                    <p className="text-xs text-slate-500">{ticket.attendeeInfo?.email || ticket.user?.email || ''}</p>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <p className="text-xs text-slate-500">{ticket.attendeeInfo?.phone || ticket.user?.phone || ''}</p>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                      ticket.entryStatus === 'checked_in' ? 'bg-emerald-500/20 text-emerald-300' :
                                      ticket.entryStatus === 'checked_out' ? 'bg-violet-500/20 text-violet-300' :
                                      ticket.entryStatus === 'unused' ? 'bg-amber-500/20 text-amber-300' :
                                      'bg-red-500/20 text-red-300'
                                    }`}>{ticket.entryStatus}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
