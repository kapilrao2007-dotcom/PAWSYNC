import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion } from 'framer-motion';

const STAGES = [
  { label: 'YOU SEE.', detail: 'A community member notices an animal in distress.', image: 'photo-1601758228041-f3b2795255f1' },
  { label: 'YOU REPORT.', detail: 'A few details, a photo, an approximate location — that’s all it takes.', image: 'photo-1583511655857-d19b40a7a54e' },
  { label: 'WE CONNECT.', detail: 'PAWSYNC verifies the report and routes it to the nearest responders.', image: 'photo-1544568100-847a948585b9' },
  { label: 'COMMUNITY RESPONDS.', detail: 'Volunteers, vets and shelters coordinate the rescue in real time.', image: 'photo-1568572933382-74d440642117' },
  { label: 'LIFE RECOVERS.', detail: 'With care, treatment and a loving home, every life gets a second chance.', image: 'photo-1517849845537-4d257902861a' },
];

export default function ScrollStory() {
  const containerRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      const idx = Math.min(STAGES.length - 1, Math.floor(v * STAGES.length));
      setActiveStage(idx);
    });
    return unsub;
  }, [scrollYProgress]);

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

  return (
    <section ref={containerRef} className="relative bg-charcoal-900" style={{ height: `${STAGES.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <AnimatePresence mode="sync">
            <motion.img
              key={STAGES[activeStage].image}
              src={`https://images.unsplash.com/${STAGES[activeStage].image}?auto=format&fit=crop&w=1600&q=70`}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{ scale: reduceMotion ? 1 : imageScale }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/70 to-charcoal-900/50" />
        </div>

        <div className="container-px relative z-10 w-full">
          <p className="eyebrow !text-coral-300 mb-6">It starts with one moment.</p>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -30, filter: 'blur(6px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl"
            >
              <h2 className="text-display-lg md:text-hero font-display font-extrabold text-cream-50 tracking-tight">
                {STAGES[activeStage].label}
              </h2>
              <p className="mt-5 text-lg text-cream-200 max-w-lg">{STAGES[activeStage].detail}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2 mt-14">
            {STAGES.map((s, i) => (
              <div key={s.label} className="h-1 rounded-full bg-cream-50/20 overflow-hidden" style={{ width: 44 }}>
                <motion.div
                  className="h-full bg-coral-400"
                  animate={{ width: i <= activeStage ? '100%' : '0%' }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
