import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDaysIcon, MapPinIcon, UsersIcon, HeartIcon, ClockIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useGetFeaturedEventsQuery } from '../../features/events/eventsApi';
import { formatDate } from '../../utils/formatDate';
import { getEventPriceDisplay } from '../../utils/cancellationPolicy';
import Badge from '../ui/Badge';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const categoryColors = {
  music: 'primary', tech: 'success', sports: 'accent', food: 'warning',
  art: 'neutral', business: 'primary', education: 'success',
  default: 'neutral',
};

export default function FeaturedEvents() {
  const { data, isLoading, error } = useGetFeaturedEventsQuery();
  const featured = Array.isArray(data) ? data : (data?.events ?? []);
  const [wishlist, setWishlist] = useState(new Set());

  const toggleWishlist = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isLoading) {
    return (
      <section className="container-app mb-24">
        <div className="mb-8">
          <div className="skeleton h-8 w-64 mb-2" />
          <div className="skeleton h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass overflow-hidden">
              <div className="skeleton h-56 rounded-none" />
              <div className="p-5 space-y-3">
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-4 w-1/2" />
                <div className="skeleton h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container-app mb-24">
        <div className="text-center py-12">
          <p className="text-red-400">Failed to load featured events.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container-app mb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-10"
      >
        <div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">Featured Events</h2>
          <p className="text-slate-400 mt-1 text-sm">Hand-picked experiences you'll love</p>
        </div>
        <Link to="/events" className="group hidden sm:flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors">
          View all
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {featured.map((event) => {
          const priceDisplay = getEventPriceDisplay(event);
          const color = categoryColors[event.category?.toLowerCase()] ?? categoryColors.default;
          const totalRemaining = event.ticketTypes?.length > 0
            ? event.ticketTypes.reduce((s, t) => s + (t.totalQuantity - (t.soldQuantity ?? 0)), 0)
            : Math.max(0, (event.totalCapacity ?? 0) - (event.soldCount ?? 0));
          const soldOut = event.totalCapacity > 0 && totalRemaining <= 0;
          const isWishlisted = wishlist.has(event._id);

          return (
            <motion.div
              key={event._id}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Link
                to={`/events/${event._id}`}
                className="group block glass hover:border-primary-500/40 transition-all duration-300 overflow-hidden h-full"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden rounded-t-2xl bg-surface-border">
                  {event.bannerImage ? (
                    <img
                      src={event.bannerImage}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-900/60 to-violet-900/60 flex items-center justify-center">
                      <CalendarDaysIcon className="w-16 h-16 text-primary-400/40" />
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {event.isFeatured && (
                      <Badge variant="primary">
                        <span className="flex items-center gap-1">⭐ Live</span>
                      </Badge>
                    )}
                    {soldOut && <Badge variant="danger">Sold Out</Badge>}
                  </div>

                  {/* Wishlist */}
                  <button
                    onClick={(e) => toggleWishlist(e, event._id)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all"
                  >
                    {isWishlisted ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-400" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-white/70 hover:text-red-400 transition-colors" />
                    )}
                  </button>

                  {/* Category Badge */}
                  {event.category && (
                    <div className="absolute bottom-3 left-3">
                      <Badge variant={color}>{event.category}</Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-3">
                  <h3 className="font-display font-semibold text-lg text-white line-clamp-2 group-hover:text-primary-300 transition-colors">
                    {event.title}
                  </h3>

                  <div className="flex flex-col gap-2 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <CalendarDaysIcon className="w-4 h-4 text-primary-400 flex-shrink-0" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    {(event.venue?.city || event.venue?.name) && (
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-accent-400 flex-shrink-0" />
                        <span className="truncate">
                          {event.venue?.name ? `${event.venue.name}, ` : ''}
                          {event.venue?.city || ''}
                        </span>
                      </div>
                    )}
                    {event.organizer?.name && (
                      <div className="flex items-center gap-2">
                        <UsersIcon className="w-4 h-4 text-violet-400 flex-shrink-0" />
                        <span className="truncate">by {event.organizer.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-3 border-t border-surface-border flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <ClockIcon className="w-3.5 h-3.5" />
                      <span>
                        {event.totalCapacity > 0
                          ? `${totalRemaining} tickets left`
                          : 'Open'}
                      </span>
                    </div>
                    <span className="font-display font-bold text-primary-300 text-base">
                      {priceDisplay}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}

        {featured.length === 0 && (
          <div className="col-span-full">
            <div className="group glass border-2 border-dashed border-surface-border hover:border-primary-500/40 flex flex-col items-center justify-center text-center p-10 rounded-2xl transition-all duration-300 hover:bg-white/5">
              <div className="w-16 h-16 rounded-full bg-surface-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CalendarDaysIcon className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="font-display font-semibold text-lg text-white mb-2">No featured events yet</h3>
              <p className="text-slate-400 text-sm mb-6 max-w-xs">
                Want to host an experience? Create and manage it easily here.
              </p>
              <Link to="/dashboard/events/new" className="btn-md btn-primary">
                Create Event
              </Link>
            </div>
          </div>
        )}
      </motion.div>

      <div className="text-center mt-8 sm:hidden">
        <Link to="/events" className="btn-md btn-secondary">
          View all events →
        </Link>
      </div>
    </section>
  );
}
