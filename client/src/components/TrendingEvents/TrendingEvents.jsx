import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { CalendarDaysIcon, MapPinIcon, FireIcon } from '@heroicons/react/24/outline';
import { useGetEventsQuery } from '../../features/events/eventsApi';
import { formatDate } from '../../utils/formatDate';
import { getEventPriceDisplay } from '../../utils/cancellationPolicy';
import Badge from '../ui/Badge';

const categoryColors = {
  music: 'primary', tech: 'success', sports: 'accent', food: 'warning',
  art: 'neutral', business: 'primary', education: 'success',
  default: 'neutral',
};

const trendingColors = ['from-primary-500/20', 'from-violet-500/20', 'from-accent-500/20', 'from-emerald-500/20', 'from-rose-500/20'];

export default function TrendingEvents() {
  const { data } = useGetEventsQuery({ limit: 10 });
  const events = Array.isArray(data) ? data : (data?.events ?? []);
  const trending = events.slice(0, 8);
  const duplicated = [...trending, ...trending, ...trending, ...trending];
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isPaused, setIsPaused] = useState(false);

  if (!trending.length) return null;

  return (
    <section ref={ref} className="mb-24 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="container-app mb-10"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white flex items-center gap-3">
              <FireIcon className="w-7 h-7 text-accent-400" />
              Trending Events
            </h2>
            <p className="text-slate-400 mt-1 text-sm">Most popular events right now</p>
          </div>
          <Link to="/events" className="hidden sm:flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors">
            View all →
          </Link>
        </div>
      </motion.div>

      <div className="relative group">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-5 px-8"
          style={{
            animation: isInView && !isPaused ? 'scroll 60s linear infinite' : 'none',
          }}
        >
          {duplicated.map((event, i) => {
            const priceDisplay = getEventPriceDisplay(event);
            const color = categoryColors[event.category?.toLowerCase()] ?? categoryColors.default;
            const tc = trendingColors[i % trendingColors.length];

            return (
              <Link
                key={`${event._id}-${i}`}
                to={`/events/${event._id}`}
                className="group/card flex-shrink-0 w-[280px] sm:w-[320px] glass overflow-hidden hover:border-primary-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-glow"
              >
                <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${tc} to-surface-card`}>
                  {event.bannerImage ? (
                    <img
                      src={event.bannerImage}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CalendarDaysIcon className="w-10 h-10 text-primary-400/30" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant="success">🔥 Trending</Badge>
                  </div>
                  {event.category && (
                    <div className="absolute top-2 right-2">
                      <Badge variant={color}>{event.category}</Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-white text-sm line-clamp-1 group-hover/card:text-primary-300 transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
                    <CalendarDaysIcon className="w-3 h-3 text-primary-400" />
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                  {(event.venue?.city || event.venue?.name) && (
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                      <MapPinIcon className="w-3 h-3 text-accent-400" />
                      <span className="truncate">{event.venue?.city || event.venue?.name}</span>
                    </div>
                  )}
                  <div className="mt-3 pt-2 border-t border-surface-border flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {event.totalCapacity > 0
                        ? `${Math.max(0, event.totalCapacity - (event.soldCount ?? 0))} left`
                        : 'Open'}
                    </span>
                    <span className="font-display font-bold text-primary-300 text-sm">
                      {priceDisplay}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </motion.div>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-320px * ${trending.length * 2} - 5px * ${trending.length * 2})); }
        }
      `}</style>
    </section>
  );
}
