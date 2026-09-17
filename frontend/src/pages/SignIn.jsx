import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, AlertTriangle, PawPrint } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
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
    <section className="min-h-screen flex items-center justify-center pt-24 pb-16">
      <div className="container-px w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal-900 text-cream-50">
            <PawPrint size={16} />
          </span>
          <span className="font-display font-extrabold text-charcoal-900 text-xl">PAWSYNC</span>
        </Link>

        <div className="card p-8">
          <h1 className="text-display-sm font-display font-bold text-charcoal-900 text-center">Welcome back</h1>
          <p className="text-sm text-charcoal-500 text-center mt-2">Sign in to continue your impact.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="field-label">Email</label>
              <input
                type="email"
                required
                className="field-input"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input
                type="password"
                required
                className="field-input"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-2xl bg-rescue-50 text-rescue-700 px-4 py-3 text-sm">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading && <Loader2 size={16} className="animate-spin" />}
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-charcoal-500 mt-6">
            New to PAWSYNC?{' '}
            <Link to="/sign-up" className="text-coral-600 font-medium hover:text-coral-700">
              Create an account
            </Link>
          </p>
        </div>

        <div className="card p-5 mt-4 bg-sage-50 border-sage-100">
          <p className="text-xs text-charcoal-500 leading-relaxed">
            <strong className="text-charcoal-700">Demo accounts</strong> (password: Password123!):<br />
            admin@demo.pawsync.org · org@demo.pawsync.org · rehan@demo.pawsync.org · citizen@demo.pawsync.org
          </p>
        </div>
      </div>
    </section>
  );
}
