import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { TIMELINE_STAGES } from '../../lib/constants';

export default function CaseTimeline({ timeline = [], currentStatus }) {
  const completedStages = new Set(timeline.map((t) => t.stage));
  const currentIndex = TIMELINE_STAGES.indexOf(currentStatus);

  return (
    <ol className="relative border-l border-charcoal-200 ml-3">
      {TIMELINE_STAGES.map((stage, i) => {
        const done = i <= currentIndex;
        const entry = [...timeline].reverse().find((t) => t.stage === stage);
        return (
          <motion.li
            key={stage}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="mb-8 ml-6 last:mb-0"
          >
            <span
              className={`absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-cream-100 ${
                done ? 'bg-sage-500' : 'bg-charcoal-200'
              }`}
            >
              {done && <Check size={9} className="text-white" strokeWidth={3.5} />}
            </span>
            <p className={`text-sm font-semibold capitalize ${done ? 'text-charcoal-900' : 'text-charcoal-400'}`}>
              {stage.replace(/_/g, ' ')}
            </p>
            {entry && (
              <>
                {entry.note && <p className="text-sm text-charcoal-500 mt-0.5">{entry.note}</p>}
                <p className="text-xs text-charcoal-400 mt-0.5">
                  {new Date(entry.at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </>
            )}
          </motion.li>
        );
      })}
    </ol>
  );
}
