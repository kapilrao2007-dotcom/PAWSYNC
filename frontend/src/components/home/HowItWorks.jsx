import { motion } from 'framer-motion';
import { Eye, FileText, ShieldCheck, LifeBuoy, HeartPulse } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const STEPS = [
  { n: '01', label: 'Discover', icon: Eye, desc: 'Notice an animal in need in your neighborhood.' },
  { n: '02', label: 'Report', icon: FileText, desc: 'Submit a quick report with a photo and location.' },
  { n: '03', label: 'Verify', icon: ShieldCheck, desc: 'Our team verifies the case within minutes.' },
  { n: '04', label: 'Rescue', icon: LifeBuoy, desc: 'A nearby volunteer or professional responds.' },
  { n: '05', label: 'Recover', icon: HeartPulse, desc: 'Treatment, foster care and eventually, adoption.' },
];

const FLOW = ['Citizen', 'PAWSYNC', 'Volunteer / Vet / Shelter', 'Animal Care', 'Recovery', 'Adoption'];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-py bg-cream-100">
      <div className="container-px">
        <SectionHeading
          eyebrow="How PAWSYNC Works"
          title="From a single sighting to a second chance."
          subtitle="Every rescue moves through the same trusted, verified pipeline — designed for speed without sacrificing safety."
        />

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="card p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
            >
              <span className="text-4xl font-display font-extrabold text-charcoal-100 group-hover:text-coral-100 transition-colors">
                {step.n}
              </span>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-charcoal-900 text-cream-50 mt-4 mb-4">
                <step.icon size={18} />
              </div>
              <h3 className="font-display font-bold text-lg text-charcoal-900">{step.label}</h3>
              <p className="text-sm text-charcoal-500 mt-2 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 card p-8 md:p-10 overflow-x-auto"
        >
          <p className="eyebrow mb-8">The complete ecosystem</p>
          <div className="flex items-center min-w-[720px]">
            {FLOW.map((node, i) => (
              <div key={node} className="flex items-center flex-1 last:flex-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.12 }}
                  className={`shrink-0 px-4 py-3 rounded-2xl text-sm font-semibold text-center whitespace-nowrap ${
                    i === 1 ? 'bg-coral-500 text-cream-50' : 'bg-charcoal-100 text-charcoal-800'
                  }`}
                >
                  {node}
                </motion.div>
                {i < FLOW.length - 1 && (
                  <motion.div
                    className="h-px flex-1 bg-charcoal-200 mx-2 origin-left"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.12 + 0.15 }}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
