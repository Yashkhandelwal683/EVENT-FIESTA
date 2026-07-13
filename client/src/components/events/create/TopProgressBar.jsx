import { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useCreateEvent } from './CreateEventContext';

function AnimatedNumber({ value }) {
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));
  const ref = useRef(null);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = display.on('change', (v) => {
      if (ref.current) ref.current.textContent = v;
    });
    return unsubscribe;
  }, [display]);

  return <span ref={ref}>0</span>;
}

export default function TopProgressBar() {
  const { progress, allStepsCompleted } = useCreateEvent();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-400">
          {allStepsCompleted ? (
            <span className="text-emerald-400 font-semibold">✓ All sections complete</span>
          ) : (
            `${progress < 100 ? 'Complete all sections to publish' : 'Ready to publish'}`
          )}
        </span>
        <span className={`text-xs font-bold tabular-nums ${allStepsCompleted ? 'text-emerald-400' : 'text-violet-400'}`}>
          <AnimatedNumber value={progress} />%
        </span>
      </div>
      <div className="relative h-2 bg-slate-800/80 rounded-full overflow-hidden backdrop-blur-sm border border-slate-700/20">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: allStepsCompleted
              ? 'linear-gradient(90deg, #10b981, #34d399, #6ee7b7)'
              : 'linear-gradient(90deg, #7c3aed, #a855f7, #d946ef)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full blur-sm"
          style={{
            background: allStepsCompleted
              ? 'linear-gradient(90deg, #10b981, #34d399)'
              : 'linear-gradient(90deg, #7c3aed, #d946ef)',
            opacity: 0.4,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        />
        {progress > 0 && (
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{
              background: allStepsCompleted ? '#34d399' : '#a855f7',
              boxShadow: allStepsCompleted
                ? '0 0 12px #10b981, 0 0 24px #10b98140'
                : '0 0 12px #7c3aed, 0 0 24px #7c3aed40',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          />
        )}
      </div>
    </div>
  );
}
