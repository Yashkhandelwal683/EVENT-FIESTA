import { motion } from 'framer-motion';
import Hero from '../components/Hero/Hero';
import Categories from '../components/Categories/Categories';
import TrendingEvents from '../components/TrendingEvents/TrendingEvents';
import WhyChoose from '../components/WhyChoose/WhyChoose';
import OrganizerCTA from '../components/OrganizerCTA/OrganizerCTA';
import DashboardPreview from '../components/DashboardPreview/DashboardPreview';
import Testimonials from '../components/Testimonials/Testimonials';
import FAQ from '../components/FAQ/FAQ';

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

function SectionWrapper({ children, className = '' }) {
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden">
      <Hero />

      <SectionWrapper>
        <Categories />
      </SectionWrapper>

      <SectionWrapper>
        <TrendingEvents />
      </SectionWrapper>

      <SectionWrapper>
        <WhyChoose />
      </SectionWrapper>

      <SectionWrapper>
        <OrganizerCTA />
      </SectionWrapper>

      <SectionWrapper>
        <DashboardPreview />
      </SectionWrapper>

      <SectionWrapper>
        <Testimonials />
      </SectionWrapper>

      <SectionWrapper>
        <FAQ />
      </SectionWrapper>
    </div>
  );
}
