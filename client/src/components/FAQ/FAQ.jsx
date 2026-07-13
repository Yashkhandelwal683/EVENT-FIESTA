import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const FAQS = [
  {
    q: 'How do I create an event on Event Fiesta?',
    a: 'Simply sign up as an organizer, click "Create Event" from your dashboard, fill in the event details including date, venue, ticket types, and pricing. Once submitted, your event will be reviewed and published within 24 hours.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'We support all major payment methods including Credit/Debit Cards, UPI, Net Banking, and Wallets through our secure Razorpay integration. All payments are encrypted and PCI compliant.',
  },
  {
    q: 'Can I get a refund if I cannot attend?',
    a: 'Yes, refunds are available based on our tiered policy: 100% refund if cancelled 7+ days before, 75% for 3-6 days, 50% for 24-48 hours, and no refund within 24 hours of the event.',
  },
  {
    q: 'How do QR code tickets work?',
    a: 'After booking, you will receive a unique QR-coded ticket via email and in your dashboard. Organizers scan the QR code at the venue entrance for instant verification. Each QR code is JWT-signed and can only be used once.',
  },
  {
    q: 'Is there a mobile app available?',
    a: 'Event Fiesta is fully responsive and works seamlessly on all devices. While we do not have a dedicated mobile app yet, our web app provides a native-app-like experience on mobile browsers.',
  },
  {
    q: 'How do I become a verified organizer?',
    a: 'Register as an organizer, complete your profile with business details, and verify your identity. Verified organizers get a badge, priority listing, and access to advanced analytics.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

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
          Frequently Asked Questions
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Everything you need to know about Event Fiesta
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-3xl mx-auto space-y-3"
      >
        {FAQS.map((faq, i) => (
          <div
            key={i}
            className={`glass overflow-hidden border-surface-border/60 transition-all duration-300 ${
              openIndex === i ? 'border-primary-500/40' : ''
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/[0.02]"
            >
              <span className="font-display font-semibold text-white text-sm sm:text-base pr-4">
                {faq.q}
              </span>
              <motion.div
                animate={{ rotate: openIndex === i ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface-card border border-surface-border flex items-center justify-center"
              >
                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
              </motion.div>
            </button>

            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-surface-border pt-4">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
