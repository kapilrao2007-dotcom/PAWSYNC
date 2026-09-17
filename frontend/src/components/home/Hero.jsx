import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, HeartHandshake, ArrowUpRight } from 'lucide-react';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-36 md:pt-44 pb-20 md:pb-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sage-50 via-cream-100 to-cream-100" />

      <div className="container-px grid lg:grid-cols-[1.05fr,0.95fr] gap-14 items-center">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p variants={item} className="eyebrow mb-6">
            One Community. Every Life.
          </motion.p>
          <motion.h1 variants={item} className="text-hero font-display font-extrabold text-charcoal-900">
            Every Life Deserves
            <br />
            a Chance.
          </motion.h1>
          <motion.p variants={item} className="mt-6 text-lg md:text-xl text-charcoal-500 max-w-xl leading-relaxed">
            One community-powered network connecting animals in need with people ready to help.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link to="/report" className="btn-emergency text-base">
              Report an Animal
              <ArrowUpRight size={18} />
            </Link>
            <Link to="/donate" className="btn-outline text-base">
              Help a Rescue
            </Link>
          </motion.div>

          <motion.div variants={item} className="mt-14 flex items-center gap-8">
            <div>
              <p className="text-2xl font-display font-bold text-charcoal-900">1,284+</p>
              <p className="text-sm text-charcoal-500">Community reports</p>
            </div>
            <div className="h-10 w-px bg-charcoal-200" />
            <div>
              <p className="text-2xl font-display font-bold text-charcoal-900">164</p>
              <p className="text-sm text-charcoal-500">Active volunteers</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative"
        >
          <div className="relative rounded-4xl overflow-hidden shadow-card aspect-[4/5] max-w-md mx-auto">
            <motion.img
              src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1000&q=80"
              alt="A rescued dog looking hopefully at the camera"
              className="h-full w-full object-cover"
              initial={{ scale: 1.12 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/40 via-transparent to-transparent" />

            {!reduceMotion && (
              <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 400 500" fill="none">
                <motion.path
                  d="M40 460 C 120 380, 180 320, 260 250 S 360 120, 380 40"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeDasharray="6 8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 2.5, ease: 'easeInOut', delay: 0.6 }}
                />
              </svg>
            )}
          </div>

          <motion.div
            animate={reduceMotion ? {} : { y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-4 md:-left-10 top-10 card px-4 py-3 flex items-center gap-3 max-w-[210px]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-coral-100 text-coral-600 shrink-0">
              <MapPin size={16} />
            </span>
            <div>
              <p className="text-xs text-charcoal-400">Reported near you</p>
              <p className="text-sm font-semibold text-charcoal-900">Andheri West</p>
            </div>
          </motion.div>

          <motion.div
            animate={reduceMotion ? {} : { y: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -right-2 md:-right-8 top-1/3 card px-4 py-3 max-w-[190px]"
          >
            <p className="text-xs text-charcoal-400 mb-1">Case ARN-2026-004821</p>
            <p className="text-sm font-semibold text-charcoal-900">Rescue In Progress</p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-charcoal-100 overflow-hidden">
              <div className="h-full w-2/3 rounded-full bg-coral-500" />
            </div>
          </motion.div>

          <motion.div
            animate={reduceMotion ? {} : { y: [0, -8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-6 left-1/4 card px-4 py-3 flex items-center gap-3 max-w-[220px]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-100 text-sage-700 shrink-0">
              <HeartHandshake size={16} />
            </span>
            <div>
              <p className="text-xs text-charcoal-400">Rocky's Recovery</p>
              <p className="text-sm font-semibold text-charcoal-900">₹5,250 raised</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
