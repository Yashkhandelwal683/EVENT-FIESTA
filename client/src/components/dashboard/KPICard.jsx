import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const colorMap = {
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', glow: 'shadow-violet-500/10', chart: '#7c3aed' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', glow: 'shadow-emerald-500/10', chart: '#10b981' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', glow: 'shadow-rose-500/10', chart: '#f43f5e' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', glow: 'shadow-cyan-500/10', chart: '#06b6d4' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', glow: 'shadow-amber-500/10', chart: '#f59e0b' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', glow: 'shadow-blue-500/10', chart: '#3b82f6' },
  fuchsia: { bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20', text: 'text-fuchsia-400', glow: 'shadow-fuchsia-500/10', chart: '#d946ef' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', glow: 'shadow-orange-500/10', chart: '#f97316' },
};

function MiniSparkline({ color = '#7c3aed' }) {
  const points = [8, 14, 6, 18, 12, 22, 16, 26, 20, 24, 18, 28, 22, 18, 24, 16, 20, 12, 16, 10];
  const max = Math.max(...points, 1);
  const h = 32;
  const w = 72;
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${(i / (points.length - 1)) * w},${h - (p / max) * h}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-40">
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${w},${h} L0,${h} Z`} fill={`url(#spark-${color.replace('#', '')})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const num = typeof value === 'number' ? value : 0;
    const duration = 1200;
    const start = performance.now();
    const from = display;

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (num - from) * eased;
      setDisplay(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.round(current));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };

    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [value, decimals]);

  return <span>{prefix}{decimals > 0 ? display.toFixed(decimals) : display.toLocaleString('en-IN')}{suffix}</span>;
}

export default function KPICard({ label, value, icon: Icon, color = 'violet', prefix = '', suffix = '', trend, loading, delay = 0, decimals = 0 }) {
  const c = colorMap[color] || colorMap.violet;
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <div className={`relative h-full rounded-2xl border ${c.border} bg-white/[0.02] p-5 overflow-hidden transition-all duration-300 hover:shadow-xl ${c.glow} backdrop-blur-sm`}>
        {/* Glow */}
        <div className={`absolute -top-12 -right-12 w-32 h-32 ${c.bg} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        {/* Content */}
        <div className="relative z-10">
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-3 w-20 rounded-lg bg-white/5" />
              <div className="h-8 w-24 rounded-lg bg-white/5" />
              <div className="h-3 w-16 rounded-lg bg-white/5" />
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${c.bg} border ${c.border} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 ${c.text}`} />
                </div>
                {trend !== undefined && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
                  </span>
                )}
              </div>
              <div>
                <p className="text-2xl font-black text-white tabular-nums">
                  <AnimatedNumber value={numericValue} prefix={prefix} suffix={suffix} decimals={decimals} />
                </p>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mt-1">{label}</p>
              </div>
              <div className="flex items-center justify-end mt-2">
                <MiniSparkline color={c.chart} />
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
