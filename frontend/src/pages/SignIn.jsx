import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle, Mail, Lock, Eye, EyeOff, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import SocialSignIn from '../components/auth/SocialSignIn';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@demo.pawsync.org' },
  { role: 'Organization', email: 'org@demo.pawsync.org' },
  { role: 'Volunteer', email: 'rehan@demo.pawsync.org' },
  { role: 'Citizen', email: 'citizen@demo.pawsync.org' },
];

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(form.email, form.password);
    setLoading(false);
    if (!res.success) return setError(res.message);
    navigate(location.state?.from || '/dashboard');
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="eyebrow mb-3">Welcome back</p>
        <h1 className="text-display font-display font-extrabold text-charcoal-900">Sign in to PAWSYNC</h1>
        <p className="text-sm text-charcoal-500 mt-2">Continue your impact — report, donate, rescue.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="field-label">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input
                type="email"
                required
                autoFocus
                className="field-input !pl-11"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="field-label">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="field-input !pl-11 !pr-11"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 rounded-2xl bg-rescue-50 text-rescue-700 px-4 py-3 text-sm"
            >
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              {error}
            </motion.div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading && <Loader2 size={16} className="animate-spin" />}
            Sign In
            {!loading && <ArrowUpRight size={16} />}
          </button>
        </form>

        <SocialSignIn mode="signin" />

        <p className="text-center text-sm text-charcoal-500 mt-6">
          New to PAWSYNC?{' '}
          <Link to="/sign-up" className="text-coral-600 font-medium hover:text-coral-700">
            Create an account
          </Link>
        </p>

        <div className="rounded-2xl mt-8 bg-sage-50 border border-sage-100 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-sage-700 mb-3">Demo accounts</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => setForm({ email: acc.email, password: 'Password123!' })}
                className="text-left rounded-xl bg-white border border-sage-100 px-3 py-2 hover:border-sage-300 transition-colors"
              >
                <p className="text-xs font-semibold text-charcoal-800">{acc.role}</p>
                <p className="text-[11px] text-charcoal-400 truncate">{acc.email}</p>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-charcoal-400 mt-3">Password for all: Password123! — click a card to autofill.</p>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
