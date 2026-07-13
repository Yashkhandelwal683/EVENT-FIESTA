import { motion, AnimatePresence } from 'framer-motion';
import { useCreateEvent } from './CreateEventContext';
import { MapPin, Calendar, Users, Tag, Ticket, Image } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const CATEGORY_COLORS = {
  conference: 'from-blue-600 to-indigo-600',
  concert: 'from-pink-600 to-rose-600',
  festival: 'from-orange-600 to-amber-600',
  sports: 'from-emerald-600 to-teal-600',
  workshop: 'from-violet-600 to-purple-600',
  networking: 'from-cyan-600 to-blue-600',
  exhibition: 'from-fuchsia-600 to-pink-600',
  other: 'from-slate-600 to-zinc-600',
};

export default function LivePreview() {
  const { formData, progress, allStepsCompleted } = useCreateEvent();

  const hasTitle = !!formData.title?.trim();
  const hasCategory = !!formData.category;
  const hasLocation = !!formData.location?.trim();
  const hasDates = !!formData.startDate || !!formData.endDate;
  const hasPrice = formData.price > 0;
  const hasPoster = !!formData.posterPreview;
  const hasTickets = formData.tickets?.some(t => t.name?.trim());
  const hasTags = formData.tags?.length > 0;
  const hasCapacity = !!formData.maxParticipants;
  const ticketCount = formData.tickets?.filter(t => t.name?.trim()).length || 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          Live Preview
        </p>
        {allStepsCompleted && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          >
            ✓ Complete
          </motion.span>
        )}
      </div>

      {/* Event Card */}
      <motion.div
        layout
        className="rounded-2xl overflow-hidden bg-[#111119] border border-white/[0.06] backdrop-blur-md shadow-2xl shadow-black/30"
      >
        {/* Poster / Placeholder */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <AnimatePresence mode="wait">
            {hasPoster ? (
              <motion.img
                key="poster"
                src={formData.posterPreview}
                alt="Event poster"
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${
                  hasCategory ? CATEGORY_COLORS[formData.category] || 'from-violet-900/60 to-fuchsia-900/40' : 'from-slate-800/80 via-slate-900 to-slate-800/60'
                }`}
                style={{ opacity: 0.6 }}
              >
                <div className="text-center space-y-3">
                  <div className="text-5xl">🎪</div>
                  <p className="text-xs text-slate-400 font-medium">No poster uploaded</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111119] via-[#111119]/20 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            {hasCategory && (
              <motion.span
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wide border border-white/10"
              >
                {formData.category}
              </motion.span>
            )}
            {formData.visibility === 'private' && (
              <motion.span
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-2.5 py-1 rounded-full bg-amber-500/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wide ml-auto"
              >
                🔒 Private
              </motion.span>
            )}
          </div>

          {hasPrice && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-emerald-500/90 backdrop-blur-sm text-white text-sm font-black shadow-lg shadow-emerald-500/30"
            >
              ₹{formData.price}
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className={`text-base font-bold leading-tight ${hasTitle ? 'text-white' : 'text-slate-600 italic'}`}>
            {hasTitle ? formData.title : 'No event title yet'}
          </h3>

          {/* Meta info */}
          <div className="space-y-2">
            {hasLocation && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span className="truncate">{formData.location}</span>
              </div>
            )}

            {hasDates && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span>
                  {formatDate(formData.startDate) || 'TBD'}
                  {formData.endDate && ` — ${formatDate(formData.endDate)}`}
                </span>
              </div>
            )}

            {formData.eventType === 'team' && formData.teamSize && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Users className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span>Team · {formData.teamSize} members</span>
              </div>
            )}

            {hasCapacity && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Users className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span>{formData.maxParticipants} spots</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Users className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span>Organized by You</span>
            </div>
          </div>

          {/* Description */}
          {formData.description?.trim() && (
            <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
              {formData.description}
            </p>
          )}

          {/* Tags */}
          {hasTags && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {formData.tags.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="px-2 py-0.5 rounded-full bg-white/[0.04] text-[10px] text-slate-400 border border-white/[0.06]"
                >
                  #{tag}
                </motion.span>
              ))}
            </div>
          )}

          {/* Tickets */}
          {hasTickets && (
            <div className="pt-2 border-t border-white/[0.04] space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Ticket className="w-3 h-3 text-violet-400" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  {ticketCount} Ticket Type{ticketCount !== 1 ? 's' : ''}
                </p>
              </div>
              {formData.tickets.filter(t => t.name?.trim()).slice(0, 3).map((ticket, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{ticket.name}</span>
                  <span className="text-slate-300 font-semibold tabular-nums">
                    {ticket.price > 0 ? `₹${ticket.price}` : 'Free'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <div className="pt-2">
            <div className={`w-full py-2.5 rounded-xl text-center text-xs font-bold text-white shadow-lg transition-all ${
              allStepsCompleted
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/20'
                : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-violet-500/20'
            }`}>
              {hasPrice ? `Register · ₹${formData.price}` : 'Register Now'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Summary */}
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">Completion</span>
          <span className={`text-xs font-bold tabular-nums ${allStepsCompleted ? 'text-emerald-400' : 'text-violet-400'}`}>
            {progress}%
          </span>
        </div>
        <div className="h-1 rounded-full bg-slate-800/50 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: allStepsCompleted
                ? 'linear-gradient(90deg, #10b981, #34d399)'
                : 'linear-gradient(90deg, #7c3aed, #d946ef)',
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { label: 'Details', done: hasTitle && hasCategory && hasLocation && !!formData.description?.trim() },
            { label: 'Schedule', done: !!formData.startDate && !!formData.endDate },
            { label: 'Media', done: hasPoster },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${s.done ? 'bg-emerald-400' : 'bg-slate-700'}`} />
              <span className={`text-[10px] ${s.done ? 'text-emerald-400' : 'text-slate-600'}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
