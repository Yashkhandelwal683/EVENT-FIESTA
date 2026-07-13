import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../../features/wishlist/wishlistApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import {
  HeartIcon, CalendarDaysIcon, MapPinIcon, CurrencyRupeeIcon,
  MagnifyingGlassIcon, TrashIcon, ArrowUpRightIcon, TicketIcon,
} from '@heroicons/react/24/outline';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function Wishlist() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useGetWishlistQuery({ page, limit: 20 });
  const [removeFromWishlist, { isLoading: removing }] = useRemoveFromWishlistMutation();

  const items = data?.items || [];
  const pagination = data?.pagination;

  const filtered = items.filter((w) =>
    w.event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.event?.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRemove = async (eventId) => {
    try {
      await removeFromWishlist(eventId).unwrap();
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error(err?.data?.message ?? 'Failed to remove');
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">My Wishlist</h1>
          <p className="text-zinc-400 text-sm mt-1">Events you're interested in</p>
        </div>
        <div className="relative max-w-xs">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search wishlist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/40 transition-all"
          />
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <motion.div variants={item} className="glass rounded-2xl p-12 text-center">
          <HeartIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 font-medium">
            {searchTerm ? 'No matching events' : 'Your wishlist is empty'}
          </p>
          <p className="text-xs text-zinc-600 mt-1 mb-4">
            {searchTerm ? 'Try a different search' : 'Browse events and save the ones you love'}
          </p>
          {!searchTerm && (
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600/80 text-white text-xs font-medium hover:bg-violet-500 transition-all"
            >
              Browse Events <ArrowUpRightIcon className="w-3.5 h-3.5" />
            </Link>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((w) => {
            const ev = w.event || {};
            const spotsLeft = (ev.totalCapacity || 0) - (ev.soldCount || 0);
            const isSoldOut = ev.totalCapacity && spotsLeft <= 0;

            return (
              <motion.div
                key={w._id}
                variants={item}
                layout
                className="glass rounded-2xl overflow-hidden group hover:ring-1 hover:ring-violet-500/20 transition-all"
              >
                {/* Event Banner */}
                <div className="relative h-36 bg-gradient-to-br from-violet-900/60 to-indigo-900/60">
                  {ev.poster ? (
                    <img src={ev.poster} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CalendarDaysIcon className="w-10 h-10 text-violet-400/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />

                  {/* Category badge */}
                  {ev.category && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-medium bg-violet-500/20 text-violet-300 border border-violet-500/30 capitalize">
                      {ev.category}
                    </span>
                  )}

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(ev._id)}
                    disabled={removing}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-all opacity-0 group-hover:opacity-100"
                    title="Remove from wishlist"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <Link to={`/events/${ev._id}`} className="text-sm font-semibold text-white hover:text-violet-300 transition-colors line-clamp-2">
                      {ev.title || 'Untitled Event'}
                    </Link>
                    {ev.description && (
                      <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2">{ev.description}</p>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <CalendarDaysIcon className="w-3 h-3 text-zinc-500" />
                      {ev.startDate ? formatDate(ev.startDate, 'dd MMM yyyy') : 'TBD'}
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <MapPinIcon className="w-3 h-3 text-zinc-500" />
                      <span className="truncate">{ev.location || 'Online'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <CurrencyRupeeIcon className="w-3 h-3 text-zinc-500" />
                        <span className="font-medium text-violet-300">{ev.price === 0 ? 'Free' : formatCurrency(ev.price)}</span>
                      </div>
                      {ev.totalCapacity > 0 && (
                        <span className={`text-[9px] font-medium ${isSoldOut ? 'text-red-400' : 'text-zinc-500'}`}>
                          {isSoldOut ? 'Sold Out' : `${spotsLeft} spots left`}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      to={`/events/${ev._id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-violet-600/80 to-fuchsia-600/80 text-xs text-white font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all"
                    >
                      View Event <ArrowUpRightIcon className="w-3 h-3" />
                    </Link>
                    <button
                      onClick={() => handleRemove(ev._id)}
                      disabled={removing}
                      className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <HeartIcon className="w-4 h-4 fill-red-500 text-red-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-400 hover:text-white disabled:opacity-30 transition-all"
          >
            Previous
          </button>
          <span className="text-xs text-zinc-500">Page {page} of {pagination.totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={page >= pagination.totalPages}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-400 hover:text-white disabled:opacity-30 transition-all"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
}
