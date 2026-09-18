import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PawPrint, HeartHandshake, ShieldCheck, Users } from 'lucide-react';

const STATS = [
  { icon: HeartHandshake, label: 'Animals assisted', value: '842+' },
  { icon: Users, label: 'Active volunteers', value: '164' },
  { icon: ShieldCheck, label: 'Verified organizations', value: '32' },
];

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-charcoal-900 px-12 py-10">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=70"
            alt=""
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900 via-charcoal-900/95 to-sage-800/60" />
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_75%_15%,rgba(184,116,34,0.35)_0%,transparent_45%)]" />
        </div>

        <Link to="/" className="relative flex items-center gap-2 z-10">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50 text-charcoal-900">
            <PawPrint size={17} />
          </span>
          <span className="font-display font-extrabold text-cream-50 text-xl">PAWSYNC</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-md"
        >
          <p className="eyebrow !text-coral-300 mb-4">One Community. Every Life.</p>
          <h1 className="text-display-lg font-display font-extrabold text-cream-50 leading-tight">
            Every account here is part of a rescue.
          </h1>
          <p className="text-cream-200/80 mt-4 leading-relaxed">
            Sign in to report animals in need, track cases, fund treatment transparently, or join the volunteer network in your area.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 grid grid-cols-3 gap-4"
        >
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl bg-cream-50/10 border border-cream-50/10 backdrop-blur px-4 py-4">
              <s.icon size={16} className="text-coral-300 mb-2" />
              <p className="font-display font-bold text-cream-50 text-lg">{s.value}</p>
              <p className="text-xs text-cream-300/70 mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-16 bg-cream-100">
        <div className="w-full max-w-md">
          <Link to="/" className="flex lg:hidden items-center gap-2 justify-center mb-8">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal-900 text-cream-50">
              <PawPrint size={16} />
            </span>
            <span className="font-display font-extrabold text-charcoal-900 text-xl">PAWSYNC</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
