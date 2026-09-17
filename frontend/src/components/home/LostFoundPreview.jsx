import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, PlusCircle, ArrowUpRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

export default function LostFoundPreview() {
  return (
    <section className="section-py bg-cream-100">
      <div className="container-px">
        <SectionHeading
          eyebrow="Lost & Found"
          title="Reunited, one match at a time."
          subtitle="Lost a pet, or found one wandering? Our matching suggestions help connect the dots — a human always confirms before any match is declared."
        />

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {[
            { icon: Search, title: 'Lost a pet?', desc: 'File a lost pet report with a photo and last-seen details.', to: '/lost-and-found', cta: 'Report Lost Pet' },
            { icon: PlusCircle, title: 'Found an animal?', desc: 'Help reunite a found pet with their worried family.', to: '/lost-and-found', cta: 'Report Found Pet' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="card p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-100 text-sage-700 shrink-0">
                <item.icon size={22} />
              </span>
              <div className="flex-1">
                <h3 className="font-display font-bold text-lg text-charcoal-900">{item.title}</h3>
                <p className="text-sm text-charcoal-500 mt-1.5">{item.desc}</p>
              </div>
              <Link to={item.to} className="btn-outline shrink-0 !py-2.5 text-sm">
                {item.cta} <ArrowUpRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
