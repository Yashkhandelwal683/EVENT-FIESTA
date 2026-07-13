import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Users, DollarSign, Eye, Layers, Star, CheckCircle2,
  TrendingUp, Heart, Share2
} from 'lucide-react';

function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const num = typeof value === 'number' ? value : parseFloat(value) || 0;
    const start = performance.now();
    const from = 0;

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (num - from) * eased));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };

    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [value, duration]);

  return <span>{prefix}{display.toLocaleString('en-IN')}{suffix}</span>;
}

export default function EventStatsOverlay({ stats, event }) {
  const capacityTotal = event?.maxParticipants || 100;
  const capacitySold = (stats.totalPaid || 0) + (stats.totalPending || 0);
  const seatsLeft = Math.max(0, capacityTotal - capacitySold);

  const statCards = [
    {
      icon: Users, label: 'Registrations', value: stats.totalRegistrations || 0,
      color: 'from-violet-500/20 to-purple-500/10', iconColor: 'text-violet-400',
      borderColor: 'border-violet-500/20',
    },
    {
      icon: DollarSign, label: 'Revenue', value: stats.revenue || 0, prefix: '₹',
      color: 'from-emerald-500/20 to-green-500/10', iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
    },
    {
      icon: Eye, label: 'Capacity', value: `${capacitySold}/${capacityTotal}`,
      numericValue: Math.round((capacitySold / (capacityTotal || 1)) * 100), suffix: '%',
      color: 'from-blue-500/20 to-cyan-500/10', iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/20',
    },
    {
      icon: Star, label: 'Rating', value: stats.avgRating || 0, decimals: 1,
      color: 'from-amber-500/20 to-orange-500/10', iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/20',
    },
    {
      icon: CheckCircle2, label: 'Check-ins', value: stats.approved || 0,
      color: 'from-cyan-500/20 to-teal-500/10', iconColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
      {statCards.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -4, scale: 1.02 }}
          className={`relative rounded-xl bg-gradient-to-br ${stat.color} backdrop-blur-xl border ${stat.borderColor} p-3 text-center overflow-hidden group cursor-default`}
        >
          {/* Glow on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-50`} />
          </div>

          <div className="relative z-10">
            <div className={`inline-flex p-1.5 rounded-lg bg-white/[0.06] ${stat.iconColor} mb-2`}>
              <stat.icon className="w-3.5 h-3.5" />
            </div>
            <p className="text-lg font-black text-white tabular-nums leading-none">
              {stat.decimals ? (
                <AnimatedCounter value={parseFloat(stat.value) || 0} decimals={stat.decimals} />
              ) : stat.prefix ? (
                <AnimatedCounter value={typeof stat.value === 'number' ? stat.value : 0} prefix={stat.prefix} />
              ) : stat.numericValue != null ? (
                <AnimatedCounter value={stat.numericValue} suffix={stat.suffix || ''} />
              ) : (
                stat.value
              )}
            </p>
            <p className="text-[9px] text-zinc-400 uppercase tracking-wider font-medium mt-1">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
