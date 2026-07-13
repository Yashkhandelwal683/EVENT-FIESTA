import { motion, AnimatePresence } from 'framer-motion';
import { useCreateEvent } from './CreateEventContext';
import { Check, Circle } from 'lucide-react';

export default function StepTimeline() {
  const {
    steps, currentStep, goToStep,
    getStepRemainingTasks, getStepCompletedCount, getStepTotalRequired,
    getStepFieldStatus,
  } = useCreateEvent();

  return (
    <div className="w-full space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-3 px-2">
        Steps
      </p>
      {steps.map((step, idx) => {
        const isActive = currentStep === idx;
        const isFuture = idx > currentStep;
        const isClickable = idx < currentStep || isActive;

        const status = getStepFieldStatus(idx);
        const completedCount = getStepCompletedCount(idx);
        const totalRequired = getStepTotalRequired(idx);
        const remaining = getStepRemainingTasks(idx);
        const isComplete = status === 'completed';
        const isInProgress = status === 'in_progress';

        return (
          <div key={step.id}>
            <motion.button
              onClick={() => isClickable && goToStep(idx)}
              disabled={!isClickable}
              whileHover={isClickable ? { x: 4 } : {}}
              whileTap={isClickable ? { scale: 0.98 } : {}}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-300 ${
                isFuture
                  ? 'opacity-40 cursor-not-allowed border border-transparent'
                  : isActive
                  ? isComplete
                    ? 'bg-emerald-500/5 border border-emerald-500/15 shadow-lg shadow-emerald-500/5'
                    : 'bg-gradient-to-r from-violet-600/15 to-fuchsia-600/15 border border-violet-500/25 shadow-lg shadow-violet-500/5'
                  : isComplete
                  ? 'bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 group cursor-pointer'
                  : 'hover:bg-white/[0.03] border border-transparent cursor-pointer group'
              }`}
            >
              {/* Step Icon */}
              <div
                className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isComplete
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : isActive
                    ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30'
                    : isFuture
                    ? 'bg-slate-800/20 text-slate-700 border border-slate-800/20'
                    : 'bg-slate-800/40 text-slate-500 border border-slate-700/30'
                }`}
              >
                {isComplete ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </motion.div>
                ) : isActive ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-2.5 h-2.5 rounded-full bg-white"
                  />
                ) : isFuture ? (
                  <Circle className="w-3.5 h-3.5" strokeWidth={1.5} />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Label + Status */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate transition-colors ${
                    isComplete
                      ? 'text-emerald-300'
                      : isActive
                      ? 'text-white'
                      : isFuture
                      ? 'text-slate-700'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {step.label}
                </p>

                {/* Status line */}
                {isComplete && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] text-emerald-500/60"
                  >
                    Completed
                  </motion.p>
                )}
                {isActive && isInProgress && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] text-violet-400/60"
                  >
                    {completedCount}/{totalRequired} Completed
                  </motion.p>
                )}
                {isActive && !isInProgress && !isComplete && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] text-slate-600"
                  >
                    Not started
                  </motion.p>
                )}
                {isFuture && (
                  <p className="text-[11px] text-slate-800">Upcoming</p>
                )}
                {!isActive && !isComplete && !isFuture && (
                  <p className="text-[11px] text-slate-600">
                    {completedCount > 0 ? `${completedCount}/${totalRequired}` : 'Not started'}
                  </p>
                )}
              </div>

              {/* Active step: progress count */}
              {isActive && isInProgress && totalRequired > 0 && (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[10px] text-violet-400/50 font-mono">
                    {completedCount}/{totalRequired}
                  </span>
                </div>
              )}
            </motion.button>

            {/* Remaining Tasks Checklist — only for active + in progress */}
            <AnimatePresence>
              {isActive && isInProgress && remaining.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="ml-6 mt-1 mb-2 pl-4 border-l border-violet-500/10 space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-1.5">
                      Remaining · {remaining.length} Task{remaining.length !== 1 ? 's' : ''}
                    </p>
                    {remaining.map((field, i) => (
                      <motion.div
                        key={field.key}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-2 py-0.5"
                      >
                        <Circle className="w-2 h-2 text-slate-700 flex-shrink-0" strokeWidth={2} />
                        <span className="text-[11px] text-slate-500">{field.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
