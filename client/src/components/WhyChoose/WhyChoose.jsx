import { motion } from 'framer-motion';
import {
  ShieldCheckIcon, BoltIcon, LockClosedIcon, TicketIcon,
  QrCodeIcon, SparklesIcon, ChartBarIcon, LifebuoyIcon,
} from '@heroicons/react/24/outline';

const FEATURES = [
  {
    icon: ShieldCheckIcon,
    title: 'Verified Organizers',
    description: 'Every organizer is verified to ensure authentic events and secure transactions.',
    color: 'from-primary-500/20 to-primary-800/20',
    border: 'hover:border-primary-500/40',
    iconColor: 'text-primary-400',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    icon: BoltIcon,
    title: 'Instant Booking',
    description: 'Book your tickets in seconds with our streamlined checkout process.',
    color: 'from-violet-500/20 to-violet-800/20',
    border: 'hover:border-violet-500/40',
    iconColor: 'text-violet-400',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    icon: LockClosedIcon,
    title: 'Secure Payment',
    description: 'End-to-end encrypted payments powered by Razorpay for peace of mind.',
    color: 'from-emerald-500/20 to-emerald-800/20',
    border: 'hover:border-emerald-500/40',
    iconColor: 'text-emerald-400',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    icon: TicketIcon,
    title: 'Digital Tickets',
    description: 'Get QR-coded digital tickets instantly — no printing, no hassle.',
    color: 'from-accent-500/20 to-accent-800/20',
    border: 'hover:border-accent-500/40',
    iconColor: 'text-accent-400',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    icon: QrCodeIcon,
    title: 'QR Check-In',
    description: 'Organizers scan QR codes at entry for fast and fraud-proof check-ins.',
    color: 'from-cyan-500/20 to-cyan-800/20',
    border: 'hover:border-cyan-500/40',
    iconColor: 'text-cyan-400',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    icon: SparklesIcon,
    title: 'AI Recommendations',
    description: 'Smart suggestions based on your interests and past bookings.',
    color: 'from-rose-500/20 to-rose-800/20',
    border: 'hover:border-rose-500/40',
    iconColor: 'text-rose-400',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    icon: ChartBarIcon,
    title: 'Analytics',
    description: 'Track sales, attendance, and revenue with real-time dashboards.',
    color: 'from-indigo-500/20 to-indigo-800/20',
    border: 'hover:border-indigo-500/40',
    iconColor: 'text-indigo-400',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    icon: LifebuoyIcon,
    title: '24×7 Support',
    description: 'Our team is always available to help with any questions or issues.',
    color: 'from-amber-500/20 to-amber-800/20',
    border: 'hover:border-amber-500/40',
    iconColor: 'text-amber-400',
    span: 'md:col-span-2 md:row-span-1',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function WhyChoose() {
  return (
    <section className="container-app mb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">
          Why Choose Event Fiesta?
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Everything you need for amazing event experiences
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {FEATURES.map((feature) => (
          <motion.div
            key={feature.title}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className={`group relative overflow-hidden rounded-2xl border border-surface-border/60 bg-gradient-to-br ${feature.color} p-6 transition-all ${feature.border} ${feature.span}`}
          >
            <div className={`w-11 h-11 rounded-xl bg-surface-card/60 flex items-center justify-center mb-4 ${feature.iconColor} group-hover:scale-110 transition-transform`}>
              <feature.icon className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-white text-lg mb-2">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
