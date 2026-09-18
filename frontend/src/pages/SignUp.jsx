import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle, Mail, Lock, User, MapPin, Eye, EyeOff, ArrowUpRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import SocialSignIn from '../components/auth/SocialSignIn';

const PASSWORD_MIN = 8;

export default function SignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', area: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const passwordOk = form.password.length >= PASSWORD_MIN;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!passwordOk) return setError(`Password must be at least ${PASSWORD_MIN} characters.`);
    setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (!res.success) return setError(res.message);
    navigate('/dashboard');
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="eyebrow mb-3">Join the network</p>
        <h1 className="text-display font-display font-extrabold text-charcoal-900">Create your account</h1>
        <p className="text-sm text-charcoal-500 mt-2">One community. Every life.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="field-label">Full name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input required autoFocus className="field-input !pl-11" value={form.name} onChange={update('name')} placeholder="Jane Doe" />
            </div>
          </div>

          <div>
            <label className="field-label">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input
                type="email"
                required
                className="field-input !pl-11"
                value={form.email}
                onChange={update('email')}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Area</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input className="field-input !pl-11" value={form.area} onChange={update('area')} placeholder="E.g. Andheri, Mumbai" />
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
                onChange={update('password')}
                placeholder="At least 8 characters"
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
            {form.password.length > 0 && (
              <p className={`flex items-center gap-1.5 mt-2 text-xs ${passwordOk ? 'text-sage-600' : 'text-charcoal-400'}`}>
                {passwordOk && <Check size={12} />}
                At least {PASSWORD_MIN} characters
              </p>
            )}
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
            Create Account
            {!loading && <ArrowUpRight size={16} />}
          </button>
        </form>

        <SocialSignIn mode="signup" />

        <p className="text-center text-sm text-charcoal-500 mt-6">
          Already have an account?{' '}
          <Link to="/sign-in" className="text-coral-600 font-medium hover:text-coral-700">
            Sign in
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
