import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, AlertTriangle, PawPrint } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', area: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (!res.success) return setError(res.message);
    navigate('/dashboard');
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
          <h1 className="text-display-sm font-display font-bold text-charcoal-900 text-center">Join the network</h1>
          <p className="text-sm text-charcoal-500 text-center mt-2">One community. Every life.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="field-label">Full name</label>
              <input required className="field-input" value={form.name} onChange={update('name')} placeholder="Jane Doe" />
            </div>
            <div>
              <label className="field-label">Email</label>
              <input type="email" required className="field-input" value={form.email} onChange={update('email')} placeholder="you@example.com" />
            </div>
            <div>
              <label className="field-label">Area</label>
              <input className="field-input" value={form.area} onChange={update('area')} placeholder="E.g. Andheri, Mumbai" />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input type="password" required className="field-input" value={form.password} onChange={update('password')} placeholder="At least 8 characters" />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-2xl bg-rescue-50 text-rescue-700 px-4 py-3 text-sm">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading && <Loader2 size={16} className="animate-spin" />}
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-charcoal-500 mt-6">
            Already have an account?{' '}
            <Link to="/sign-in" className="text-coral-600 font-medium hover:text-coral-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
