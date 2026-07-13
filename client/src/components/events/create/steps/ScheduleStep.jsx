import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreateEvent } from '../CreateEventContext';
import FieldWrapper from '../FieldWrapper';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ScheduleStep() {
  const { formData, updateField, addScheduleItem, removeScheduleItem } = useCreateEvent();
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', time: '', endTime: '', description: '', speaker: '' });

  const handleAdd = () => {
    if (newItem.title?.trim()) {
      addScheduleItem(newItem);
      setNewItem({ title: '', time: '', endTime: '', description: '', speaker: '' });
      setShowForm(false);
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" className="space-y-6">
      {/* Event Dates */}
      <motion.div variants={fadeUp} custom={0}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldWrapper fieldKey="startDate" label="Start Date & Time" required>
            <input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700/40 text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 [color-scheme:dark]"
            />
          </FieldWrapper>
          <FieldWrapper fieldKey="endDate" label="End Date & Time">
            <input
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => updateField('endDate', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700/40 text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 [color-scheme:dark]"
            />
          </FieldWrapper>
        </div>
      </motion.div>

      {/* Registration Deadline */}
      <motion.div variants={fadeUp} custom={1}>
        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
          Registration Deadline
        </label>
        <input
          type="datetime-local"
          value={formData.registrationDeadline}
          onChange={(e) => updateField('registrationDeadline', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700/40 text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 [color-scheme:dark]"
        />
        <p className="text-[11px] text-slate-600 mt-1">After this date, registrations will be closed</p>
      </motion.div>

      {/* Schedule Timeline */}
      <motion.div variants={fadeUp} custom={2}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-white">Event Schedule</h3>
            <p className="text-xs text-slate-500 mt-0.5">Add sessions, talks, or activities</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold shadow-lg shadow-violet-500/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Item
          </motion.button>
        </div>

        {/* Add Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="rounded-2xl bg-slate-900/50 border border-slate-700/30 p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    placeholder="Session title"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/30 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                  <input
                    type="text"
                    value={newItem.speaker}
                    onChange={(e) => setNewItem({ ...newItem, speaker: e.target.value })}
                    placeholder="Speaker name"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/30 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Start Time</label>
                    <input
                      type="time"
                      value={newItem.time}
                      onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/30 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-all [color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">End Time</label>
                    <input
                      type="time"
                      value={newItem.endTime}
                      onChange={(e) => setNewItem({ ...newItem, endTime: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/30 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Session description (optional)"
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/30 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-500 transition-colors"
                  >
                    Add to Schedule
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Schedule Items */}
        {formData.schedule.length === 0 && !showForm && (
          <div className="rounded-2xl border-2 border-dashed border-slate-800/50 p-8 text-center">
            <div className="text-3xl mb-2">📅</div>
            <p className="text-sm text-slate-500">No schedule items yet</p>
            <p className="text-xs text-slate-600 mt-1">Add sessions, talks, or activities for your event</p>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {formData.schedule.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="relative flex items-start gap-4 p-4 rounded-xl bg-slate-900/30 border border-slate-800/30 mb-2 group hover:border-slate-700/40 transition-colors"
            >
              {/* Timeline dot */}
              <div className="flex flex-col items-center pt-1">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/30" />
                {index < formData.schedule.length - 1 && (
                  <div className="w-px h-8 bg-gradient-to-b from-violet-500/30 to-transparent mt-1" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  {item.speaker && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 font-medium">
                      {item.speaker}
                    </span>
                  )}
                </div>
                {(item.time || item.endTime) && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.time}{item.endTime ? ` — ${item.endTime}` : ''}
                  </p>
                )}
                {item.description && (
                  <p className="text-xs text-slate-500/70 mt-1">{item.description}</p>
                )}
              </div>

              <button
                onClick={() => removeScheduleItem(item.id)}
                className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
