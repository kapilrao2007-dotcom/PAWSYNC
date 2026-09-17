import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="section-py bg-charcoal-900">
      <div className="container-px">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-5xl bg-gradient-to-br from-sage-700 to-charcoal-800 px-8 py-16 md:px-16 md:py-20 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white_0%,transparent_35%)]" />
          <p className="eyebrow !text-coral-300 mb-5 relative">One Community. Every Life.</p>
          <h2 className="text-display-lg font-display font-extrabold text-cream-50 max-w-2xl mx-auto relative">
            Every rescue starts with someone who chose to act.
          </h2>
          <p className="text-cream-200/80 mt-5 max-w-lg mx-auto relative">
            Whether you report, donate, foster or volunteer — you're part of the network that gives every life a chance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 relative">
            <Link to="/report" className="btn-accent">
              Report an Animal <ArrowUpRight size={16} />
            </Link>
            <Link to="/volunteer" className="btn-outline !border-cream-50/30 !text-cream-50 hover:!bg-cream-50 hover:!text-charcoal-900">
              Join as a Volunteer
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
