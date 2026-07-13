import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CalendarDaysIcon, TicketIcon, UsersIcon, StarIcon, ArrowRightIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

function Counter({ value, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0);
  const num = parseInt(String(value).replace(/[^0-9]/g, '')) || 0;

  useEffect(() => {
    let start = 0;
    const increment = Math.ceil(num / (60 * duration));
    const timer = setInterval(() => {
      start += increment;
      if (start >= num) {
        setCount(num);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [num, duration]);

  return (
    <span>{count.toLocaleString()}{suffix}</span>
  );
}

const floatingCards = [
  { emoji: '🎵', label: 'Music Fest', color: 'from-primary-500/20 to-primary-800/20', x: '15%', y: '20%', delay: 0 },
  { emoji: '💻', label: 'Tech Conf', color: 'from-violet-500/20 to-violet-800/20', x: '75%', y: '15%', delay: 0.5 },
  { emoji: '🎪', label: 'Food Fair', color: 'from-accent-500/20 to-accent-800/20', x: '10%', y: '55%', delay: 1 },
  { emoji: '🏆', label: 'Sports', color: 'from-emerald-500/20 to-emerald-800/20', x: '80%', y: '60%', delay: 1.5 },
];

export default function Hero() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);
  const heroY = useTransform(scrollY, [0, 400], [0, 50]);

  const [stats, setStats] = useState({ totalEvents: 0, totalRegistrations: 0, totalUsers: 0, avgRating: '0' });

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => {
        const s = d?.data || d;
        setStats({
          totalEvents: s?.totalEvents || 0,
          totalRegistrations: s?.totalRegistrations || 0,
          totalUsers: s?.totalUsers || 0,
          avgRating: '4.9',
        });
      })
      .catch(() => {});
  }, []);

  const STATS = [
    { icon: CalendarDaysIcon, label: 'Events Hosted', value: stats.totalEvents, suffix: '+' },
    { icon: TicketIcon, label: 'Tickets Sold', value: stats.totalRegistrations, suffix: '+' },
    { icon: UsersIcon, label: 'Happy Attendees', value: stats.totalUsers, suffix: '+' },
    { icon: StarIcon, label: 'Avg Rating', value: 4.9, suffix: '' },
  ];

  return (
    <motion.section
      style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface"
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Animated Glowing Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-48 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute top-1/3 -right-48 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[150px]" />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-primary-500/30 to-violet-600/30 rounded-full blur-3xl animate-spin-slow origin-center" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-accent-500/20 to-orange-600/20 rounded-full blur-3xl animate-spin-slow origin-center" style={{ animationDirection: 'reverse' }} />

      {/* Floating Event Cards */}
      {floatingCards.map((card, i) => (
        <motion.div
          key={card.label}
          className="absolute hidden lg:block"
          style={{ left: card.x, top: card.y }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: card.delay + 0.5, duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
            className={`bg-gradient-to-br ${card.color} backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl`}
          >
            <div className="text-2xl mb-1">{card.emoji}</div>
            <p className="text-xs text-white/70 font-medium">{card.label}</p>
          </motion.div>
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 container-app text-center px-4">
        {/* Live Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-sm text-xs font-medium text-primary-300 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          Live events happening near you
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[1.1] mb-6"
        >
          Discover &{' '}
          <span className="bg-gradient-to-r from-primary-400 via-violet-400 to-accent-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-pulse-slow">
            Experience
          </span>
          <br />
          Unforgettable Events
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          From concerts and tech conferences to food festivals — find, book, and manage
          events all in one place. Join millions of event enthusiasts worldwide.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <Link
            to="/events"
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-semibold text-lg rounded-2xl transition-all shadow-glow-sm hover:shadow-glow hover:-translate-y-0.5"
          >
            Browse Events
            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login?role=organizer"
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-surface-card/80 backdrop-blur-xl border border-surface-border hover:border-primary-500/40 text-slate-200 hover:text-white font-semibold text-lg rounded-2xl transition-all hover:-translate-y-0.5"
          >
            Become an Organizer
            <ArrowRightIcon className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </Link>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-6 mb-12"
        >
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
            <span>Secure Booking</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-600" />
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <StarIcon className="w-4 h-4 text-amber-400" />
            <span>{stats.avgRating} Avg Rating</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-600" />
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <UsersIcon className="w-4 h-4 text-primary-400" />
            <span>{stats.totalUsers.toLocaleString()}+ Users</span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {STATS.map(({ icon: Icon, label, value, suffix }) => (
            <div key={label} className="glass p-5 text-center hover:border-primary-500/40 transition-all hover:-translate-y-1">
              <Icon className="w-6 h-6 text-primary-400 mx-auto mb-2" />
              <p className="font-display font-bold text-2xl text-white">
                <Counter value={value} />
                {suffix}
              </p>
              <p className="text-slate-400 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
    </motion.section>
  );
}
