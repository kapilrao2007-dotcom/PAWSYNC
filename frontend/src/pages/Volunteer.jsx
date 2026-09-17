import { useState } from 'react';
import { Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage } from '../services/api';
import { Link } from 'react-router-dom';

const SKILLS = ['First Aid', 'Transport', 'Handling', 'Fostering', 'Awareness'];
const ACTIVITIES = ['rescue', 'transport', 'foster', 'awareness', 'fundraising', 'medical_support'];

export default function Volunteer() {
  const { user } = useAuth();
  const [area, setArea] = useState(user?.area || '');
  const [skills, setSkills] = useState([]);
  const [availability, setAvailability] = useState('flexible');
  const [activities, setActivities] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const toggle = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/volunteers', { area, skills, availability, preferredActivities: activities });
      setDone(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <section className="section-py pt-32 min-h-[60vh] flex items-center">
        <div className="container-px max-w-md mx-auto text-center">
          <h1 className="text-display font-display font-bold text-charcoal-900">Become a Volunteer</h1>
          <p className="text-charcoal-500 mt-3">Sign in first so we can build your volunteer profile and track your impact.</p>
          <Link to="/sign-in" state={{ from: '/volunteer' }} className="btn-primary mt-8 inline-flex">
            Sign In to Continue
          </Link>
        </div>
      </section>
    );
  }

  if (done) {
    return (
      <section className="section-py pt-32 min-h-[60vh] flex items-center">
        <div className="container-px max-w-md mx-auto text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 text-sage-600 mb-6">
            <CheckCircle2 size={28} />
          </span>
          <h1 className="text-display font-display font-bold text-charcoal-900">Application submitted</h1>
          <p className="text-charcoal-500 mt-3">
            Thank you for stepping up. Our team will review and verify your volunteer profile shortly.
          </p>
          <Link to="/dashboard" className="btn-primary mt-8 inline-flex">
            Go to Dashboard
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section-py pt-32">
      <div className="container-px max-w-2xl mx-auto">
        <p className="eyebrow mb-4">Become a Volunteer</p>
        <h1 className="text-display-lg font-display font-extrabold text-charcoal-900">Show up for animals in your community.</h1>
        <p className="text-charcoal-500 mt-3">
          Volunteers are never sent into dangerous situations alone — every case gives you the option to request professional assistance instead.
        </p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="mt-10 card p-6 md:p-8 space-y-7"
        >
          <div>
            <label className="field-label">Your area</label>
            <input className="field-input" value={area} onChange={(e) => setArea(e.target.value)} placeholder="E.g. Andheri, Mumbai" required />
          </div>

          <div>
            <label className="field-label">Skills</label>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggle(skills, setSkills, s)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    skills.includes(s) ? 'bg-charcoal-900 text-cream-50 border-charcoal-900' : 'border-charcoal-200 text-charcoal-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">Availability</label>
            <select className="field-input" value={availability} onChange={(e) => setAvailability(e.target.value)}>
              {['weekdays', 'weekends', 'evenings', 'on_call', 'flexible'].map((a) => (
                <option key={a} value={a}>
                  {a.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label">Preferred activities</label>
            <div className="flex flex-wrap gap-2">
              {ACTIVITIES.map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => toggle(activities, setActivities, a)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize border transition-colors ${
                    activities.includes(a) ? 'bg-sage-500 text-cream-50 border-sage-500' : 'border-charcoal-200 text-charcoal-600'
                  }`}
                >
                  {a.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-2xl bg-sage-50 border border-sage-100 px-4 py-3 text-sm text-charcoal-600">
            <ShieldAlert size={16} className="mt-0.5 text-sage-600 shrink-0" />
            You'll always have the option to request professional assistance instead of responding directly.
          </div>

          {error && <p className="text-sm text-rescue-600">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Submit Application
          </button>
        </motion.form>
      </div>
    </section>
  );
}
