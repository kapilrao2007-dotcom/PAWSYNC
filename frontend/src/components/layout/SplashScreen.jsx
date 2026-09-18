import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { PawPrint } from 'lucide-react';

const WORDMARK = 'PAWSYNC';

// Timeline (from mount):
//   0.00s - 1.42s   entrance: ring draws, paw badge pops, wordmark letters stagger in
//   1.42s - ~2.9s   hold: the finished logo just sits there for a beat
//   ~2.9s           zoom: the whole logo group rockets toward the viewer and fades
//   ~2.9s + 0.6s     the dark overlay itself is gone and the site underneath is revealed
const ZOOM_START_MS = 2900;
const ZOOM_DURATION_MS = 600;
const HIDE_MS = ZOOM_START_MS + ZOOM_DURATION_MS;

/**
 * A one-time, full-screen brand intro shown before the app renders.
 * Purely decorative - it never blocks routing or data loading, it just
 * overlays the (already-mounting) app for a couple of seconds. Click
 * anywhere, or prefers-reduced-motion, skips it instantly.
 *
 * Sequence: logo entrance -> hold -> dramatic zoom-in -> site revealed.
 */
export default function SplashScreen() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(!reduceMotion);
  const [zooming, setZooming] = useState(false);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const zoomTimer = setTimeout(() => setZooming(true), ZOOM_START_MS);
    const hideTimer = setTimeout(() => setVisible(false), HIDE_MS);
    return () => {
      clearTimeout(zoomTimer);
      clearTimeout(hideTimer);
    };
  }, [reduceMotion]);

  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  const skip = () => {
    setZooming(true);
    setTimeout(() => setVisible(false), 250);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          onClick={skip}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-900 cursor-pointer overflow-hidden"
          role="presentation"
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                'radial-gradient(circle at 50% 40%, rgba(184,116,34,0.35) 0%, transparent 55%)',
            }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={
              zooming
                ? { scale: 2.6, opacity: 0, transition: { duration: ZOOM_DURATION_MS / 1000, ease: [0.76, 0, 0.24, 1] } }
                : { scale: 1, opacity: 0.3, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }
            }
          />

          <motion.div
            initial={{ y: 12, opacity: 0, scale: 1 }}
            animate={
              zooming
                ? { scale: 9, opacity: 0, transition: { duration: ZOOM_DURATION_MS / 1000, ease: [0.76, 0, 0.24, 1] } }
                : { y: 0, opacity: 1, scale: 1, transition: { duration: 0.5 } }
            }
            className="relative flex flex-col items-center"
          >
            <div className="relative flex h-20 w-20 items-center justify-center mb-7">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                <motion.circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="rgba(245,241,232,0.18)"
                  strokeWidth="1.5"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="#B87422"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  pathLength="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                />
              </svg>
              <motion.span
                initial={{ scale: 0, rotate: -35, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.25 }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-50 text-charcoal-900"
              >
                <PawPrint size={22} strokeWidth={2.2} />
              </motion.span>
            </div>

            <div className="flex overflow-hidden" aria-hidden="true">
              {WORDMARK.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.55 + i * 0.045,
                  }}
                  className="font-display font-extrabold text-2xl md:text-3xl tracking-[0.08em] text-cream-50"
                >
                  {char}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.05 }}
              className="mt-3 text-xs md:text-sm font-medium uppercase tracking-[0.22em] text-coral-300"
            >
              One Community. Every Life.
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
