import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { name: 'Music', icon: '🎵', color: 'from-primary-500/20 to-primary-800/20', border: 'hover:border-primary-500/40' },
  { name: 'Sports', icon: '🏆', color: 'from-emerald-500/20 to-emerald-800/20', border: 'hover:border-emerald-500/40' },
  { name: 'Tech', icon: '💻', color: 'from-violet-500/20 to-violet-800/20', border: 'hover:border-violet-500/40' },
  { name: 'Gaming', icon: '🎮', color: 'from-purple-500/20 to-purple-800/20', border: 'hover:border-purple-500/40' },
  { name: 'Food', icon: '🍽️', color: 'from-accent-500/20 to-accent-800/20', border: 'hover:border-accent-500/40' },
  { name: 'Startup', icon: '🚀', color: 'from-cyan-500/20 to-cyan-800/20', border: 'hover:border-cyan-500/40' },
  { name: 'Hackathons', icon: '⚡', color: 'from-yellow-500/20 to-yellow-800/20', border: 'hover:border-yellow-500/40' },
  { name: 'Workshop', icon: '🔧', color: 'from-rose-500/20 to-rose-800/20', border: 'hover:border-rose-500/40' },
  { name: 'Theatre', icon: '🎭', color: 'from-pink-500/20 to-pink-800/20', border: 'hover:border-pink-500/40' },
  { name: 'Comedy', icon: '😂', color: 'from-amber-500/20 to-amber-800/20', border: 'hover:border-amber-500/40' },
  { name: 'Photography', icon: '📷', color: 'from-indigo-500/20 to-indigo-800/20', border: 'hover:border-indigo-500/40' },
  { name: 'Business', icon: '💼', color: 'from-slate-500/20 to-slate-800/20', border: 'hover:border-slate-500/40' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Categories() {
  const navigate = useNavigate();

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
          Browse by Category
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Find exactly what you're looking for across our curated categories
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
      >
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat.name}
            variants={cardVariants}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/events?category=${cat.name.toLowerCase()}`)}
            className={`group relative overflow-hidden rounded-2xl border border-surface-border/60 bg-gradient-to-br ${cat.color} p-5 text-center transition-all ${cat.border} cursor-pointer`}
          >
            <div className="text-3xl mb-2">{cat.icon}</div>
            <h3 className="text-sm font-semibold text-white/90">{cat.name}</h3>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}
