import { motion } from 'framer-motion';

export default function ProgressBar({ value = 0, goal = 100, className = '', color = 'coral' }) {
  const pct = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
  const colorMap = {
    coral: 'bg-coral-500',
    sage: 'bg-sage-500',
    charcoal: 'bg-charcoal-800',
  };

  return (
    <div className={`h-2.5 w-full rounded-full bg-charcoal-100 overflow-hidden ${className}`}>
      <motion.div
        className={`h-full rounded-full ${colorMap[color] || colorMap.coral}`}
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
