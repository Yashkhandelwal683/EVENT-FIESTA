import { useGetOrganizerSubEventsQuery, useDeleteSubEventMutation } from '../../features/subEvents/subEventsApi';
import { Link } from 'react-router-dom';
import { PlusCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function SubEventsPage() {
  const { data, isLoading } = useGetOrganizerSubEventsQuery();
  const [deleteSubEvent] = useDeleteSubEventMutation();
  const subEvents = data?.data?.subEvents || [];

  const grouped = {};
  subEvents.forEach((se) => {
    const key = se.event?.title || 'Uncategorized';
    if (!grouped[key]) grouped[key] = { event: se.event, items: [] };
    grouped[key].items.push(se);
  });

  const handleDelete = async (id) => {
    if (!confirm('Delete this sub-event?')) return;
    try {
      await deleteSubEvent(id).unwrap();
      toast.success('Sub-event deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Sub Events</h1>
          <p className="text-slate-400 text-sm mt-1">Manage sub-events within your events</p>
        </div>
        <Link to="/dashboard/events" className="btn-sm btn-primary gap-1.5">
          <PlusCircleIcon className="w-4 h-4" /> Create from Event
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="skeleton h-40 rounded-2xl" />)}
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="glass p-12 text-center">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="font-display font-semibold text-white text-lg mb-2">No sub-events yet</h3>
          <p className="text-slate-400 text-sm mb-6">Create an event first, then add sub-events to it.</p>
          <Link to="/dashboard/events/new" className="btn-md btn-primary">Create Event</Link>
        </div>
      ) : (
        Object.entries(grouped).map(([eventTitle, group]) => (
          <div key={eventTitle} className="glass p-5 border-surface-border/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-violet-600/20 flex items-center justify-center">
                <span className="text-lg">📂</span>
              </div>
              <div>
                <h2 className="font-display font-semibold text-white">{eventTitle}</h2>
                <p className="text-xs text-slate-500">{group.items.length} sub-event{group.items.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.items.map((se) => (
                <div key={se._id} className="bg-surface-card/40 rounded-xl p-4 border border-surface-border/40 hover:border-primary-500/40 transition-all group">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      se.status === 'published' ? 'bg-emerald-500/20 text-emerald-300' :
                      se.status === 'draft' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-500/20 text-slate-300'
                    }`}>{se.status}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-primary-300">
                        <PencilIcon className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(se._id)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-red-400">
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-medium text-white text-sm mb-1 truncate">{se.title}</h3>
                  {se.price != null && <p className="text-xs text-primary-300">₹{se.price}</p>}
                  {se.totalCapacity && <p className="text-xs text-slate-500">Capacity: {se.totalCapacity}</p>}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
