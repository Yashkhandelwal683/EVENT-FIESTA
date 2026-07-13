import { useState } from 'react';
import { motion } from 'framer-motion';
import AuthModal from '../Auth/AuthModal';
import {
  TicketIcon, UsersIcon, ChartBarIcon, SparklesIcon, MegaphoneIcon,
  ArrowRightIcon, CheckCircleIcon,
} from '@heroicons/react/24/outline';

const BENEFITS = [
  { icon: TicketIcon, label: 'Sell Tickets' },
  { icon: UsersIcon, label: 'Manage Attendees' },
  { icon: ChartBarIcon, label: 'Revenue Dashboard' },
  { icon: SparklesIcon, label: 'Analytics' },
  { icon: MegaphoneIcon, label: 'Marketing Tools' },
];

export default function OrganizerCTA() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <section className="container-app mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass overflow-hidden border-surface-border/60"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative min-h-[300px] lg:min-h-full bg-gradient-to-br from-primary-900/40 via-violet-900/40 to-surface-card p-8 lg:p-12 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-[0.04]">
                <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99,102,241,0.5) 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
              </div>
              <div className="relative">
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br from-primary-500/30 to-violet-600/30 blur-3xl absolute -top-20 -left-20"
                />
                <div className="relative z-10 text-center">
                  <div className="text-8xl mb-6">🎤</div>
                  <h3 className="font-display font-bold text-3xl text-white mb-2">Host Your Event</h3>
                  <p className="text-slate-400 text-sm">Powerful tools for organizers</p>
                </div>
              </div>
            </div>

            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
                Ready to Host
                <br />
                <span className="gradient-text">Your Own Event?</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-lg">
                Create, promote, and manage your events with powerful tools built for organizers.
                From ticketing to analytics, we've got you covered.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {BENEFITS.map((benefit) => (
                  <div key={benefit.label} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-4 h-4 text-primary-400" />
                    </div>
                    <span className="text-sm text-slate-300">{benefit.label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setAuthOpen(true)}
                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm rounded-xl transition-all shadow-glow-sm hover:shadow-glow w-fit"
              >
                Get Started
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
                <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400" />
                No credit card required
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
