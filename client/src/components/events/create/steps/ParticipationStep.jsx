import { motion } from 'framer-motion';
import { useCreateEvent } from '../CreateEventContext';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ParticipationStep() {
  const { formData, updateField } = useCreateEvent();
  const isTeam = formData.eventType === 'team';

  return (
    <motion.div initial="hidden" animate="visible" className="space-y-6">
      {/* Event Type */}
      <motion.div variants={fadeUp} custom={0}>
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Participation Type <span className="text-violet-400">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              value: 'solo',
              label: 'Solo',
              desc: 'Individual participation',
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              ),
            },
            {
              value: 'team',
              label: 'Team',
              desc: 'Group participation',
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              ),
            },
          ].map((opt) => {
            const isSelected = formData.eventType === opt.value;
            return (
              <motion.button
                key={opt.value}
                type="button"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateField('eventType', opt.value)}
                className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? 'bg-violet-600/15 border-violet-500/40 text-violet-300 shadow-xl shadow-violet-500/10'
                    : 'bg-slate-900/40 border-slate-700/30 text-slate-400 hover:border-slate-600/50 hover:text-slate-300'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="event-type-glow"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="relative z-10">{opt.icon}</div>
                <div className="relative z-10 text-center">
                  <p className="text-sm font-bold">{opt.label}</p>
                  <p className="text-[11px] opacity-60 mt-0.5">{opt.desc}</p>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Team Size (conditional) */}
      <motion.div variants={fadeUp} custom={1}>
        <AnimateSection show={isTeam}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
                Team Size <span className="text-violet-400">*</span>
              </label>
              <input
                type="number"
                min={2}
                max={50}
                value={formData.teamSize}
                onChange={(e) => updateField('teamSize', e.target.value)}
                placeholder="e.g. 4"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-900/60 border border-slate-700/40 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
                Min Team Size
              </label>
              <input
                type="number"
                min={1}
                max={formData.teamSize || 50}
                value={formData.minTeamSize}
                onChange={(e) => updateField('minTeamSize', e.target.value)}
                placeholder="e.g. 2"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-900/60 border border-slate-700/40 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
              />
            </div>
          </div>
        </AnimateSection>
      </motion.div>

      {/* Max Participants */}
      <motion.div variants={fadeUp} custom={2}>
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
          Max Participants
        </label>
        <div className="relative group">
          <input
            type="number"
            min={1}
            value={formData.maxParticipants}
            onChange={(e) => updateField('maxParticipants', e.target.value)}
            placeholder="Leave empty for unlimited"
            className="w-full px-4 py-3.5 rounded-xl bg-slate-900/60 border border-slate-700/40 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600/5 to-fuchsia-600/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </motion.div>

      {/* Price */}
      <motion.div variants={fadeUp} custom={3}>
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
          Base Ticket Price (₹)
        </label>
        <div className="relative group">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-semibold">₹</div>
          <input
            type="number"
            min={0}
            step={10}
            value={formData.price}
            onChange={(e) => updateField('price', Number(e.target.value))}
            placeholder="0 for free events"
            className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-900/60 border border-slate-700/40 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600/5 to-fuchsia-600/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
        </div>
        <div className="mt-2 flex gap-2">
          {[0, 99, 199, 499, 999].map((price) => (
            <button
              key={price}
              type="button"
              onClick={() => updateField('price', price)}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                formData.price === price
                  ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                  : 'bg-slate-900/30 border-slate-700/20 text-slate-500 hover:text-slate-400'
              }`}
            >
              {price === 0 ? 'Free' : `₹${price}`}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function AnimateSection({ show, children }) {
  return (
    <motion.div
      initial={false}
      animate={{ height: show ? 'auto' : 0, opacity: show ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  );
}
