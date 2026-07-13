import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../utils/formatDate';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useDeleteEventMutation } from '../../features/events/eventsApi';
import toast from 'react-hot-toast';

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteEvent] = useDeleteEventMutation();

  useEffect(() => {
    axiosClient.get('/api/admin/events')
      .then(({ data }) => setEvents(data?.data?.events || []))
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete event "${title}"? This cannot be undone.`)) return;
    try {
      await deleteEvent(id).unwrap();
      toast.success('Event deleted');
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch {
      toast.error('Failed to delete event');
    }
  };

  if (loading) return <div className="flex justify-center py-10"><Spinner /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Manage Events</h1>
        <p className="page-subtitle">Platform-wide event moderation and oversight</p>
      </div>

      {events.length === 0 ? (
        <div className="glass p-12 text-center">
          <p className="text-zinc-400">No events found</p>
        </div>
      ) : (
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-surface-border text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium">Event</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Organizer</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Registrations</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Revenue</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Commission</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Earnings</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev._id} className="border-b border-surface-border/50 hover:bg-white/3">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {(ev.poster || ev.bannerImage) ? (
                          <img src={ev.poster || ev.bannerImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-900/40 to-zinc-900 flex items-center justify-center text-xs text-zinc-600">🎟</div>
                        )}
                        <div>
                          <p className="font-medium text-white truncate max-w-[180px]">{ev.title}</p>
                          <p className="text-[10px] text-slate-500">{formatDate(ev.startDate)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-xs hidden sm:table-cell">{ev.organizer?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-xs hidden md:table-cell">
                      <span className="text-white font-medium">{ev.registrations || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-xs hidden md:table-cell">
                      <span className="text-emerald-400 font-medium">₹{((ev.totalRevenue || 0)).toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-4 py-3 text-xs hidden lg:table-cell">
                      <span className="text-amber-400 font-medium">₹{((ev.commission || 0)).toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-4 py-3 text-xs hidden lg:table-cell">
                      <span className="text-violet-400 font-medium">₹{((ev.organizerEarnings || 0)).toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={ev.status === 'published' ? 'success' : 'warning'}>
                        {ev.status || 'draft'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(ev._id, ev.title)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/20">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
