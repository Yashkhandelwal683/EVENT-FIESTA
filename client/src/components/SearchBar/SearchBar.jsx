import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, MapPinIcon, CalendarDaysIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const CATEGORIES = [
  'All Categories', 'Music', 'Tech', 'Sports', 'Food', 'Art', 'Business', 'Education', 'Networking',
];

const LOCATIONS = [
  'All Locations', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Jaipur',
];

export default function SearchBar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category && category !== 'All Categories') params.set('category', category.toLowerCase());
    if (location && location !== 'All Locations') params.set('city', location);
    if (date) params.set('date', date);
    navigate(`/events?${params.toString()}`);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="relative z-20 -mt-16 mb-20"
    >
      <div className="container-app">
        <form
          onSubmit={handleSearch}
          className="glass p-2 sm:p-3 rounded-2xl shadow-2xl border border-surface-border/60 backdrop-blur-xl"
        >
          <div className="flex flex-col lg:flex-row gap-2">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface-input/50 border border-surface-border/50 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all"
              />
            </div>

            {/* Category */}
            <div className="flex-1 relative">
              <AdjustmentsHorizontalIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-surface-input/50 border border-surface-border/50 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-400 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all appearance-none cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-surface-card text-slate-300">{c}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="flex-1 relative">
              <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-surface-input/50 border border-surface-border/50 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-400 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all appearance-none cursor-pointer"
              >
                {LOCATIONS.map((l) => (
                  <option key={l} value={l} className="bg-surface-card text-slate-300">{l}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="flex-1 relative">
              <CalendarDaysIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-surface-input/50 border border-surface-border/50 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-300 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all [color-scheme:dark]"
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="px-8 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm rounded-xl transition-all shadow-glow-sm hover:shadow-glow flex items-center gap-2 lg:self-stretch"
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </form>
      </div>
    </motion.section>
  );
}
