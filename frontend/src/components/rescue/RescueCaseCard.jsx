import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

export default function RescueCaseCard({ rescueCase, index = 0 }) {
  const photo = rescueCase.photos?.[0] || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=70';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <Link to={`/rescue/${rescueCase.caseId}`} className="card overflow-hidden block group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={photo}
            alt={rescueCase.displayName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <StatusBadge status={rescueCase.status} />
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-charcoal-900">{rescueCase.displayName}</h3>
            <span className="text-xs text-charcoal-400 capitalize">{rescueCase.animalType}</span>
          </div>
          <p className="text-xs text-charcoal-400 mt-1 font-mono">{rescueCase.caseId}</p>
          <div className="flex items-center gap-1.5 mt-3 text-sm text-charcoal-500">
            <MapPin size={13} />
            <span>{rescueCase.location?.address || 'Approximate area shown'}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
