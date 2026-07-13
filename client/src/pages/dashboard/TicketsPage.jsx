import { useState } from 'react';
import { useGetEventsQuery } from '../../features/events/eventsApi';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, CalendarDaysIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/formatDate';

export default function TicketsPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useGetEventsQuery({ organizer: 'me', limit: 50 });
  const events = Array.isArray(data) ? data : data?.events || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Tickets</h1>
          <p className="text-slate-400 text-sm mt-1">View all issued tickets across events</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface-input border border-surface-border rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500/50 w-48 lg:w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <Link
            key={event._id}
            to={`/events/${event._id}`}
            className="glass p-5 hover:border-primary-500/40 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-violet-600/20 flex items-center justify-center overflow-hidden">
                {event.bannerImage ? (
                  <img src={event.bannerImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <CalendarDaysIcon className="w-5 h-5 text-primary-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white truncate group-hover:text-primary-300 transition-colors">{event.title}</h3>
                <p className="text-xs text-slate-500">{event.soldCount || 0} / {event.totalCapacity || 0} tickets sold</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CalendarDaysIcon className="w-3 h-3" />
              <span>{formatDate(event.startDate)}</span>
              {event.venue?.city && (
                <>
                  <span>·</span>
                  <MapPinIcon className="w-3 h-3" />
                  <span>{event.venue.city}</span>
                </>
              )}
            </div>
          </Link>
        ))}
      </div>

      {!isLoading && events.length === 0 && (
        <div className="glass p-12 text-center">
          <h3 className="font-display font-semibold text-white text-lg mb-2">No events found</h3>
          <p className="text-slate-400 text-sm">Create an event to start selling tickets.</p>
        </div>
      )}
    </div>
  );
}
