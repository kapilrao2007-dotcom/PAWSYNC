import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { MapPin, HeartHandshake, ArrowUpRight, PawPrint } from 'lucide-react';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

// A trail of paw prints that "walks" diagonally across the hero, one step
// at a time, forever - a small on-brand nod to an actual animated dog
// without needing a video asset. Left/right paws alternate a little offset
// like a real walking gait.
const PAW_TRAIL = [
  { top: '93%', left: '2%', rotate: -20, delay: 0 },
  { top: '87%', left: '8%', rotate: 12, delay: 0.32 },
  { top: '80%', left: '14%', rotate: -22, delay: 0.64 },
  { top: '73%', left: '20%', rotate: 10, delay: 0.96 },
  { top: '66%', left: '26%', rotate: -18, delay: 1.28 },
  { top: '59%', left: '32%', rotate: 8, delay: 1.6 },
  { top: '52%', left: '38%', rotate: -20, delay: 1.92 },
  { top: '45%', left: '44%', rotate: 9, delay: 2.24 },
  { top: '38%', left: '50%', rotate: -16, delay: 2.56 },
  { top: '31%', left: '56%', rotate: 11, delay: 2.88 },
  { top: '24%', left: '62%', rotate: -14, delay: 3.2 },
  { top: '17%', left: '68%', rotate: 7, delay: 3.52 },
];
const PAW_LOOP_DURATION = 6.5;

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const imgWrapRef = useRef(null);

  // Subtle tilt-on-hover for the hero photo - premium micro-interaction,
  // skipped entirely under prefers-reduced-motion.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 150, damping: 18 });

  const handleMouseMove = (e) => {
    if (reduceMotion || !imgWrapRef.current) return;
    const rect = imgWrapRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section className="relative overflow-hidden pt-36 md:pt-44 pb-20 md:pb-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sage-50 via-cream-100 to-cream-100" />

      {/* Slow-drifting background glows - pure decoration, adds life without noise */}
      {!reduceMotion && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute -z-10 -top-24 -left-20 h-[26rem] w-[26rem] rounded-full bg-coral-200/40 blur-3xl"
            animate={{ x: [0, 40, -20, 0], y: [0, 30, -10, 0], scale: [1, 1.08, 0.97, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute -z-10 top-1/3 -right-24 h-[22rem] w-[22rem] rounded-full bg-sage-300/30 blur-3xl"
            animate={{ x: [0, -30, 20, 0], y: [0, -20, 15, 0], scale: [1, 0.95, 1.06, 1] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </>
      )}

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
            <Link to="/report" className="relative">
              {!reduceMotion && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-rescue-500"
                  animate={{ scale: [1, 1.35, 1], opacity: [0.55, 0, 0.55] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              <motion.span
                whileHover={reduceMotion ? {} : { scale: 1.04 }}
                whileTap={reduceMotion ? {} : { scale: 0.97 }}
                className="btn-emergency text-base relative"
              >
                Report an Animal
                <ArrowUpRight size={18} />
              </motion.span>
            </Link>
            <motion.div whileHover={reduceMotion ? {} : { scale: 1.04 }} whileTap={reduceMotion ? {} : { scale: 0.97 }}>
              <Link to="/donate" className="btn-outline text-base">
                Help a Rescue
              </Link>
            </motion.div>
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
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative"
          style={{ perspective: 1200 }}
        >
          {/* Pulsing glow ring behind the photo */}
          {!reduceMotion && (
            <motion.div
              aria-hidden="true"
              className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-coral-300/50 via-coral-100/20 to-sage-300/40 blur-2xl"
              animate={{ opacity: [0.5, 0.85, 0.5], scale: [0.98, 1.03, 0.98] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          <motion.div
            ref={imgWrapRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
            animate={reduceMotion ? {} : { y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative rounded-4xl overflow-hidden shadow-card aspect-[4/5] max-w-md mx-auto"
          >
            <motion.img
              src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1000&q=80"
              alt="A rescued dog looking hopefully at the camera"
              className="h-full w-full object-cover"
              initial={{ scale: 1.25, filter: 'blur(6px)' }}
              animate={{ scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
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
          </motion.div>

          <motion.div
            animate={reduceMotion ? {} : { y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
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
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="absolute -right-2 md:-right-8 top-1/3 card px-4 py-3 max-w-[190px]"
          >
            <p className="text-xs text-charcoal-400 mb-1">Case ARN-2026-004821</p>
            <p className="text-sm font-semibold text-charcoal-900">Rescue In Progress</p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-charcoal-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-coral-500"
                initial={{ width: '0%' }}
                whileInView={{ width: '66%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              />
            </div>
          </motion.div>

          <motion.div
            animate={reduceMotion ? {} : { y: [0, -8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
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

      {/* Walking paw-print trail - a little animated dog "presence" that
          loops across the bottom of the hero forever. */}
      {!reduceMotion && (
        <div className="pointer-events-none absolute inset-0 -z-10 hidden md:block" aria-hidden="true">
          {PAW_TRAIL.map((paw, i) => (
            <motion.span
              key={i}
              className="absolute text-coral-700/85 drop-shadow-sm"
              style={{ top: paw.top, left: paw.left, rotate: `${paw.rotate}deg` }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 0.8] }}
              transition={{
                duration: PAW_LOOP_DURATION,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: paw.delay,
                times: [0, 0.14, 0.7, 1],
              }}
            >
              <PawPrint size={21} strokeWidth={2.4} />
            </motion.span>
          ))}
        </div>
      )}
    </section>
  );
}
