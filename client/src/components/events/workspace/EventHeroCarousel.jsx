import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Play, Calendar, MapPin, Users,
  DollarSign, Star, Edit3, Share2, Eye, Copy, Trash2, BarChart3,
  Clock, Ticket, TrendingUp, Pause, ExternalLink, QrCode, Send,
  Megaphone, Zap, Sparkles, ArrowUpRight, Navigation
} from 'lucide-react';
import EventStatsOverlay from './EventStatsOverlay';

function CountdownTimer({ startDate }) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const target = new Date(startDate).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startDate]);

  return (
    <div className="flex items-center gap-1.5">
      {[
        { val: time.days, label: 'D' },
        { val: time.hours, label: 'H' },
        { val: time.mins, label: 'M' },
        { val: time.secs, label: 'S' },
      ].map((t, i) => (
        <div key={t.label} className="flex items-center gap-1">
          <div className="text-center">
            <div className="w-8 h-8 rounded-lg bg-white/[0.08] backdrop-blur-sm border border-white/[0.1] flex items-center justify-center">
              <span className="text-sm font-black text-white tabular-nums">{String(t.val).padStart(2, '0')}</span>
            </div>
            <span className="text-[8px] text-zinc-500 uppercase tracking-wider mt-0.5 block">{t.label}</span>
          </div>
          {i < 3 && <span className="text-zinc-600 text-xs font-bold mb-3">:</span>}
        </div>
      ))}
    </div>
  );
}

function SeatProgressRing({ sold, total }) {
  const percent = total ? Math.min(100, (sold / total) * 100) : 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle cx="40" cy="40" r={radius} fill="none" stroke="url(#seatGrad)" strokeWidth="6"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out" />
        <defs>
          <linearGradient id="seatGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-black text-white">{Math.round(percent)}%</span>
        <span className="text-[7px] text-zinc-500 uppercase tracking-wider">Sold</span>
      </div>
    </div>
  );
}

export default function EventHeroCarousel({ event, stats, navigate }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  const images = [event.poster, event.bannerImage, ...(event.gallery || [])].filter(Boolean);
  const hasImages = images.length > 0;

  const nextSlide = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (isPaused || images.length <= 1) return;
    intervalRef.current = setInterval(nextSlide, 4000);
    return () => clearInterval(intervalRef.current);
  }, [isPaused, nextSlide, images.length]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  };

  const handleMouseLeave = () => setMousePos({ x: 0, y: 0 });

  const capacitySold = (stats.totalPaid || 0) + (stats.totalPending || 0);
  const capacityTotal = event.maxParticipants || 100;

  const quickActions = [
    { icon: Edit3, label: 'Edit', color: 'from-violet-500 to-purple-600', action: () => navigate(`/organizer/events/${event._id}/edit`) },
    { icon: Share2, label: 'Share', color: 'from-blue-500 to-cyan-600', action: () => navigator.clipboard?.writeText(window.location.href) },
    { icon: Eye, label: 'Preview', color: 'from-emerald-500 to-teal-600', action: () => window.open(`/events/${event._id}`, '_blank') },
    { icon: Copy, label: 'Duplicate', color: 'from-amber-500 to-orange-600' },
    { icon: BarChart3, label: 'Analytics', color: 'from-rose-500 to-pink-600' },
    { icon: Trash2, label: 'Delete', color: 'from-red-500 to-red-700' },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-3xl overflow-hidden group"
      style={{ height: 'clamp(320px, 40vw, 420px)' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeaveCapture={() => setIsPaused(false)}
    >
      {/* Background Images / Ken Burns */}
      {hasImages ? (
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
            style={{
              transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px) scale(1.08)`,
              transition: 'transform 0.3s ease-out',
            }}
          >
            <img
              src={images[currentSlide]}
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-fuchsia-900/40" />
      )}

      {/* Multi-layer Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#08080f] via-[#08080f]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#08080f]/80 via-transparent to-[#08080f]/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#08080f]/90" />

      {/* Animated Aurora Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 10, 0], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -30, 20, 0], y: [0, 20, -10, 0], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-1/2 -right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 15, -15, 0], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[80px]"
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -40 - i * 10, 0],
              x: [0, (i % 2 === 0 ? 15 : -15), 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.8,
            }}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              left: `${15 + i * 14}%`,
              bottom: `${20 + (i % 3) * 15}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 sm:p-7 lg:p-8">
        {/* Top: Floating Stats + Controls */}
        <div className="absolute top-5 left-5 right-5 sm:top-7 sm:left-7 sm:right-7 lg:top-8 lg:left-8 lg:right-8 flex items-start justify-between">
          {/* Status + Countdown */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 flex-wrap"
          >
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border backdrop-blur-sm ${
              event.status === 'published' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
              event.status === 'completed' ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' :
              event.status === 'cancelled' ? 'bg-red-500/15 text-red-300 border-red-500/30' :
              'bg-zinc-500/15 text-zinc-300 border-zinc-500/30'
            }`}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
              </span>
              {event.status}
            </span>
            {event.category && (
              <span className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/30 backdrop-blur-sm">
                {event.category}
              </span>
            )}
            {event.eventType && (
              <span className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border backdrop-blur-sm ${
                event.eventType === 'team' ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              }`}>
                {event.eventType === 'team' ? '👥 Team' : '👤 Solo'}
              </span>
            )}
          </motion.div>

          {/* Carousel Controls */}
          {images.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2"
            >
              <button onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }}
                className="p-2 rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.15] transition-all">
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="p-2 rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.15] transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="p-2 rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.15] transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Bottom: Glassmorphism Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Glassmorphism card */}
          <div className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              {/* Left: Event Info */}
              <div className="flex-1 min-w-0">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-3 line-clamp-2"
                >
                  {event.title}
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4"
                >
                  {event.startDate && (
                    <span className="flex items-center gap-1.5 text-xs text-zinc-300 bg-white/[0.06] px-3 py-1.5 rounded-lg border border-white/[0.06]">
                      <Calendar className="w-3.5 h-3.5 text-violet-400" />
                      {new Date(event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {event.endDate && event.endDate !== event.startDate && (
                        <span className="text-zinc-500">— {new Date(event.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      )}
                    </span>
                  )}
                  {event.venue?.name && (
                    <span className="flex items-center gap-1.5 text-xs text-zinc-300 bg-white/[0.06] px-3 py-1.5 rounded-lg border border-white/[0.06]">
                      <MapPin className="w-3.5 h-3.5 text-fuchsia-400" />
                      {event.venue.name}{event.venue.city ? `, ${event.venue.city}` : ''}
                    </span>
                  )}
                  {event.organizer?.name && (
                    <span className="flex items-center gap-1.5 text-xs text-zinc-300 bg-white/[0.06] px-3 py-1.5 rounded-lg border border-white/[0.06]">
                      <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                      {event.organizer.name}
                    </span>
                  )}
                </motion.div>

                {/* Quick Meta Row */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap items-center gap-4 text-xs text-zinc-400"
                >
                  {event.ticketPrice != null && (
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300 font-bold">₹{Number(event.ticketPrice).toLocaleString('en-IN')}</span>
                      <span className="text-zinc-500">starting</span>
                    </span>
                  )}
                  {capacityTotal > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-violet-400" />
                      <span className="font-semibold">{capacityTotal - capacitySold}</span>
                      <span className="text-zinc-500">seats left</span>
                    </span>
                  )}
                  {stats.totalRegistrations > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-semibold">{stats.totalRegistrations}</span>
                      <span className="text-zinc-500">registered</span>
                    </span>
                  )}
                  {stats.revenue > 0 && (
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300 font-bold">₹{Number(stats.revenue).toLocaleString('en-IN')}</span>
                    </span>
                  )}
                </motion.div>
              </div>

              {/* Right: Countdown + Seat Ring + Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 flex-shrink-0"
              >
                {/* Countdown */}
                {event.startDate && new Date(event.startDate) > new Date() && (
                  <div className="hidden sm:block">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1.5 text-center">Starts In</p>
                    <CountdownTimer startDate={event.startDate} />
                  </div>
                )}

                {/* Seat Progress Ring */}
                {capacityTotal > 0 && (
                  <div className="hidden sm:block">
                    <SeatProgressRing sold={capacitySold} total={capacityTotal} />
                  </div>
                )}

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-1.5">
                  {quickActions.slice(0, 4).map((action, i) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                      onClick={(e) => { e.stopPropagation(); action.action?.(); }}
                      className={`relative p-2.5 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200`}
                      title={action.label}
                    >
                      <action.icon className="w-4 h-4" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Carousel Dots */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentSlide(i); }}
                className={`transition-all duration-300 rounded-full ${
                  i === currentSlide
                    ? 'w-6 h-1.5 bg-violet-400'
                    : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-2 pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/[0.08]">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentSlide(i); }}
                className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                  i === currentSlide ? 'border-violet-400 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
