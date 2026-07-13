import { motion, AnimatePresence } from 'framer-motion';
import { useCreateEvent } from '../CreateEventContext';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function TicketStep() {
  const { formData, updateTicket, addTicket, removeTicket } = useCreateEvent();

  return (
    <motion.div initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeUp} custom={0} className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Ticket Types</h3>
          <p className="text-xs text-slate-500 mt-0.5">Create different ticket tiers for your event</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addTicket}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-shadow"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Ticket
        </motion.button>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {formData.tickets.map((ticket, index) => (
          <motion.div
            key={index}
            variants={fadeUp}
            custom={index + 1}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative rounded-2xl bg-slate-900/50 border border-slate-700/30 p-5 space-y-4 backdrop-blur-sm"
          >
            {/* Ticket header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">Ticket {index + 1}</p>
                  {ticket.name?.trim() && (
                    <p className="text-xs text-slate-400">{ticket.name}</p>
                  )}
                </div>
              </div>
              {formData.tickets.length > 1 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeTicket(index)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </motion.button>
              )}
            </div>

            {/* Ticket fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Name</label>
                <input
                  type="text"
                  value={ticket.name}
                  onChange={(e) => updateTicket(index, 'name', e.target.value)}
                  placeholder="e.g. Early Bird, VIP"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/30 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Price (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={ticket.price}
                  onChange={(e) => updateTicket(index, 'price', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/30 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={ticket.quantity}
                  onChange={(e) => updateTicket(index, 'quantity', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/30 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Description</label>
                <input
                  type="text"
                  value={ticket.description}
                  onChange={(e) => updateTicket(index, 'description', e.target.value)}
                  placeholder="What's included"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/30 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>
            </div>

            {/* Ticket preview */}
            <div className="flex items-center gap-4 pt-2 border-t border-slate-800/50">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                </svg>
                <span>{ticket.quantity || 0} available</span>
              </div>
              <div className="text-xs text-slate-500">
                Revenue: <span className="text-emerald-400 font-semibold">₹{((ticket.price || 0) * (ticket.quantity || 0)).toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
