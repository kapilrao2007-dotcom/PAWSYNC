import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, ArrowUpRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const PINS = [
  { top: '28%', left: '22%', label: 'Andheri' },
  { top: '48%', left: '58%', label: 'Powai' },
  { top: '68%', left: '35%', label: 'Bandra' },
  { top: '38%', left: '75%', label: 'Kurla' },
  { top: '58%', left: '15%', label: 'Juhu' },
];

export default function RescueMapPreview() {
  return (
    <section className="section-py bg-sage-50">
      <div className="container-px grid lg:grid-cols-2 gap-14 items-center">
        <SectionHeading
          eyebrow="Rescue Network"
          title="A live map of animals in need, near you."
          subtitle="For everyone's safety, exact locations stay private — the network shows approximate areas so volunteers can respond quickly without exposing sensitive details."
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative aspect-[4/3] rounded-4xl overflow-hidden card"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#E1EAE0_0%,#F2F6F1_45%,#EFE7D6_100%)]" />
          <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 400 300">
            <path d="M0 80 Q 100 40 200 90 T 400 70" stroke="#527A4E" strokeWidth="1" fill="none" />
            <path d="M0 180 Q 120 220 220 170 T 400 200" stroke="#527A4E" strokeWidth="1" fill="none" />
            <path d="M40 0 Q 90 150 60 300" stroke="#527A4E" strokeWidth="1" fill="none" />
            <path d="M300 0 Q 260 150 320 300" stroke="#527A4E" strokeWidth="1" fill="none" />
          </svg>

          {PINS.map((pin, i) => (
            <motion.div
              key={pin.label}
              className="absolute"
              style={{ top: pin.top, left: pin.left }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1, type: 'spring', stiffness: 200 }}
            >
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-coral-400 opacity-60 animate-ping" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-coral-500 border-2 border-white" />
              </span>
            </motion.div>
          ))}

          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
            <div className="glass-surface rounded-2xl px-4 py-2.5 flex items-center gap-2 text-sm font-medium text-charcoal-800">
              <MapPin size={14} className="text-coral-500" />
              5 approximate rescue zones active
            </div>
            <Link to="/rescue" className="glass-surface rounded-2xl px-4 py-2.5 text-sm font-medium text-charcoal-800 flex items-center gap-1.5 hover:bg-white/80 transition-colors">
              Explore <ArrowUpRight size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
