import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Event Organizer',
    avatar: 'PS',
    rating: 5,
    review: 'Event Fiesta transformed how I manage events. The dashboard is intuitive, ticketing is seamless, and QR check-in saved us hours at the door. Absolutely love it!',
    color: 'from-primary-500/20',
  },
  {
    id: 2,
    name: 'Rahul Verma',
    role: 'Tech Enthusiast',
    avatar: 'RV',
    rating: 5,
    review: 'I attend 20+ events a year and Event Fiesta makes booking effortless. The AI recommendations actually work — discovered some amazing hackathons I would have missed.',
    color: 'from-violet-500/20',
  },
  {
    id: 3,
    name: 'Ananya Patel',
    role: 'Music Festival Organizer',
    avatar: 'AP',
    rating: 5,
    review: 'From selling 5,000+ tickets to managing attendee check-ins, Event Fiesta handled it flawlessly. The analytics helped us optimize pricing for maximum revenue.',
    color: 'from-accent-500/20',
  },
  {
    id: 4,
    name: 'Vikram Singh',
    role: 'Startup Founder',
    avatar: 'VS',
    rating: 4,
    review: 'Great platform for both attendees and organizers. The UI is beautiful and the booking process is smoother than anything else I have used.',
    color: 'from-emerald-500/20',
  },
  {
    id: 5,
    name: 'Neha Gupta',
    role: 'Marketing Manager',
    avatar: 'NG',
    rating: 5,
    review: 'We hosted a 2-day tech conference and Event Fiesta made every step easy. Promotion tools, ticket tiers, and real-time analytics — all in one place.',
    color: 'from-rose-500/20',
  },
];

const cardVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
};

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setCurrent((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

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
          What People Say
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Join thousands of satisfied event organizers and attendees
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div className="flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full max-w-2xl"
              >
                <div className={`glass p-8 sm:p-10 text-center border-surface-border/60 bg-gradient-to-br ${TESTIMONIALS[current].color} to-surface-card`}>
                  {/* Quote */}
                  <div className="text-4xl text-primary-400/30 mb-4 font-serif leading-none">"</div>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                    {TESTIMONIALS[current].review}
                  </p>

                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-lg font-bold text-white mx-auto mb-3">
                    {TESTIMONIALS[current].avatar}
                  </div>
                  <h4 className="font-display font-semibold text-white">{TESTIMONIALS[current].name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{TESTIMONIALS[current].role}</p>

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-0.5 mt-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < TESTIMONIALS[current].rating ? 'text-amber-400' : 'text-slate-600'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav Buttons */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="p-2.5 rounded-xl bg-surface-card border border-surface-border hover:border-primary-500/40 text-slate-400 hover:text-white transition-all"
            >
              <ChevronDownIcon className="w-4 h-4 rotate-90" />
            </button>

            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? 'bg-primary-400 w-6' : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-2.5 rounded-xl bg-surface-card border border-surface-border hover:border-primary-500/40 text-slate-400 hover:text-white transition-all"
            >
              <ChevronDownIcon className="w-4 h-4 -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
