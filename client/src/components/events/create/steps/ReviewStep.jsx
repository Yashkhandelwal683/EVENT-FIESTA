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

function formatDate(dateStr) {
  if (!dateStr) return 'Not set';
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function ReviewStep() {
  const { formData } = useCreateEvent();

  const sections = [
    {
      title: 'Event Details',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      items: [
        { label: 'Title', value: formData.title || 'Not provided', status: !!formData.title?.trim() },
        { label: 'Description', value: formData.description ? `${formData.description.length} characters` : 'Not provided', status: !!formData.description?.trim() },
        { label: 'Category', value: formData.category || 'Not selected', status: !!formData.category },
        { label: 'Location', value: formData.location || 'Not provided', status: !!formData.location?.trim() },
        { label: 'Visibility', value: formData.visibility === 'public' ? '🌍 Public' : '🔒 Private', status: true },
        { label: 'Tags', value: formData.tags?.length ? formData.tags.join(', ') : 'None', status: true },
      ],
    },
    {
      title: 'Participation',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      items: [
        { label: 'Type', value: formData.eventType === 'team' ? '👥 Team Event' : '👤 Solo Event', status: true },
        { label: 'Team Size', value: formData.eventType === 'team' ? `${formData.minTeamSize || 1} — ${formData.teamSize || '—'} members` : 'N/A', status: formData.eventType !== 'team' || !!formData.teamSize },
        { label: 'Max Participants', value: formData.maxParticipants || 'Unlimited', status: true },
        { label: 'Base Price', value: formData.price > 0 ? `₹${formData.price}` : 'Free', status: true },
      ],
    },
    {
      title: 'Tickets',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
        </svg>
      ),
      items: [
        ...formData.tickets.filter(t => t.name?.trim()).map((t, i) => ({
          label: t.name,
          value: `${t.price > 0 ? `₹${t.price}` : 'Free'} · ${t.quantity} tickets · Revenue: ₹${((t.price || 0) * (t.quantity || 0)).toLocaleString()}`,
          status: true,
        })),
        { label: 'Total Tickets', value: formData.tickets.filter(t => t.name?.trim()).length.toString(), status: true },
        { label: 'Total Revenue Potential', value: `₹${formData.tickets.reduce((sum, t) => sum + (t.price || 0) * (t.quantity || 0), 0).toLocaleString()}`, status: true },
      ],
    },
    {
      title: 'Schedule',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      items: [
        { label: 'Start', value: formatDate(formData.startDate), status: !!formData.startDate },
        { label: 'End', value: formatDate(formData.endDate), status: !!formData.endDate },
        { label: 'Registration Deadline', value: formData.registrationDeadline ? formatDate(formData.registrationDeadline) : 'Not set', status: !!formData.registrationDeadline },
        { label: 'Schedule Items', value: `${formData.schedule.length} sessions`, status: true },
        ...formData.schedule.map(s => ({
          label: s.time || '',
          value: s.title,
          status: true,
        })),
      ],
    },
    {
      title: 'Media',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
        </svg>
      ),
      items: [
        { label: 'Poster', value: formData.poster ? '✅ Uploaded' : '❌ Not uploaded', status: !!formData.poster },
        { label: 'Gallery Images', value: `${(formData.gallery || []).length} images`, status: true },
      ],
    },
  ];

  return (
    <motion.div initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={fadeUp} custom={0}>
        <h3 className="text-sm font-bold text-white">Review Your Event</h3>
        <p className="text-xs text-slate-500 mt-0.5">Make sure everything looks good before publishing</p>
      </motion.div>

      {sections.map((section, sIdx) => (
        <motion.div
          key={section.title}
          variants={fadeUp}
          custom={sIdx + 1}
          className="rounded-2xl bg-slate-900/40 border border-slate-800/30 overflow-hidden"
        >
          <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-800/30">
            <div className="text-violet-400">{section.icon}</div>
            <h4 className="text-sm font-semibold text-white">{section.title}</h4>
            {section.items.every(i => i.status) ? (
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">Complete</span>
            ) : (
              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-medium">Incomplete</span>
            )}
          </div>
          <div className="divide-y divide-slate-800/20">
            {section.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-2.5 hover:bg-white/[0.01] transition-colors">
                <span className="text-xs text-slate-500">{item.label || '—'}</span>
                <span className={`text-xs font-medium ${item.status ? 'text-slate-300' : 'text-amber-400'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
