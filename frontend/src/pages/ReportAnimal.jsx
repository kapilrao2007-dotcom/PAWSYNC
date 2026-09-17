import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, MapPin, Loader2, CheckCircle2, Copy, ArrowUpRight, AlertTriangle } from 'lucide-react';
import api, { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ANIMAL_TYPES = ['Dog', 'Cat', 'Cow', 'Bird', 'Other'];
const CONDITIONS = ['Injured', 'Sick', 'Trapped', 'Abandoned', 'Lost', 'Found', 'Other'];
const URGENCY_OPTIONS = [
  { value: 'bleeding', label: 'Visible bleeding' },
  { value: 'not_moving', label: 'Not moving' },
  { value: 'traffic_risk', label: 'Near traffic / road' },
  { value: 'aggressive_area', label: 'Unsafe surroundings' },
  { value: 'weather_exposure', label: 'Exposed to weather' },
  { value: 'young_animal', label: 'Very young animal' },
];

export default function ReportAnimal() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    animalType: '',
    condition: '',
    description: '',
    landmark: '',
    address: '',
    guestName: '',
    guestPhone: '',
  });
  const [urgency, setUrgency] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [coords, setCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const toggleUrgency = (value) => {
    setUrgency((u) => (u.includes(value) ? u.filter((v) => v !== value) : [...u, value]));
  };

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 6);
    setPhotos(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.animalType || !form.condition || !form.description) {
      setError('Please fill in the animal type, condition and description.');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('animalType', form.animalType.toLowerCase());
      data.append('condition', form.condition.toLowerCase());
      data.append('description', form.description);
      data.append('landmark', form.landmark);
      data.append('address', form.address);
      if (coords) {
        data.append('lat', coords.lat);
        data.append('lng', coords.lng);
      }
      urgency.forEach((u) => data.append('urgencyIndicators', u));
      if (!user) {
        data.append('guestName', form.guestName);
        data.append('guestPhone', form.guestPhone);
      }
      photos.forEach((file) => data.append('photos', file));

      const { data: res } = await api.post('/rescue-reports', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <section className="section-py min-h-[70vh] flex items-center">
        <div className="container-px max-w-lg mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 text-sage-600 mb-6">
              <CheckCircle2 size={28} />
            </span>
            <h1 className="text-display font-display font-bold text-charcoal-900">Report submitted</h1>
            <p className="text-charcoal-500 mt-3">
              Thank you for looking out for an animal in need. Our verification team will review your report shortly.
            </p>

            <div className="card p-6 mt-8 text-left">
              <p className="text-xs text-charcoal-400 mb-1">Case ID</p>
              <div className="flex items-center justify-between">
                <p className="font-mono text-lg font-bold text-charcoal-900">{result.caseId}</p>
                <button
                  onClick={() => navigator.clipboard?.writeText(result.caseId)}
                  className="text-charcoal-400 hover:text-charcoal-800 transition-colors"
                  aria-label="Copy case ID"
                >
                  <Copy size={16} />
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-charcoal-100 flex items-center justify-between">
                <p className="text-xs text-charcoal-400">Status</p>
                <span className="text-sm font-semibold text-coral-600">Submitted</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
              <Link to={`/rescue/${result.caseId}`} className="btn-primary">
                Track this case <ArrowUpRight size={16} />
              </Link>
              <Link to="/" className="btn-outline">
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-py pt-32">
      <div className="container-px max-w-2xl mx-auto">
        <p className="eyebrow mb-4">Report an Animal</p>
        <h1 className="text-display-lg font-display font-extrabold text-charcoal-900">
          Tell us what you saw. We'll take it from there.
        </h1>
        <p className="text-charcoal-500 mt-3">
          Describe only what you observe — our verification team and volunteers will assess the animal's condition. No diagnosis needed.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 card p-6 md:p-8 space-y-7">
          {!user && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Your name (optional)</label>
                <input className="field-input" value={form.guestName} onChange={update('guestName')} placeholder="So we can follow up" />
              </div>
              <div>
                <label className="field-label">Phone (optional)</label>
                <input className="field-input" value={form.guestPhone} onChange={update('guestPhone')} placeholder="For urgent coordination only" />
              </div>
            </div>
          )}

          <div>
            <label className="field-label">Animal type</label>
            <div className="flex flex-wrap gap-2">
              {ANIMAL_TYPES.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setForm((f) => ({ ...f, animalType: type }))}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    form.animalType === type
                      ? 'bg-charcoal-900 text-cream-50 border-charcoal-900'
                      : 'border-charcoal-200 text-charcoal-600 hover:border-charcoal-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">Condition observed</label>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setForm((f) => ({ ...f, condition: c }))}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    form.condition === c
                      ? 'bg-rescue-500 text-cream-50 border-rescue-500'
                      : 'border-charcoal-200 text-charcoal-600 hover:border-charcoal-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">What did you observe? (do not attempt a diagnosis)</label>
            <textarea
              className="field-textarea"
              rows={4}
              value={form.description}
              onChange={update('description')}
              placeholder="E.g. Found limping near the highway service road, seems scared but not aggressive..."
            />
          </div>

          <div>
            <label className="field-label">Urgency indicators (select any that apply)</label>
            <div className="grid sm:grid-cols-2 gap-2">
              {URGENCY_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm cursor-pointer transition-colors ${
                    urgency.includes(opt.value) ? 'border-rescue-400 bg-rescue-50 text-rescue-700' : 'border-charcoal-200 text-charcoal-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="accent-rescue-500"
                    checked={urgency.includes(opt.value)}
                    onChange={() => toggleUrgency(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">Photo (helps our team assess faster)</label>
            <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-charcoal-200 py-8 cursor-pointer hover:border-coral-300 transition-colors">
              <Camera size={22} className="text-charcoal-400" />
              <span className="text-sm text-charcoal-500">Click to upload up to 6 photos</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
            </label>
            {previews.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {previews.map((src, i) => (
                  <img key={i} src={src} alt="" className="h-16 w-16 rounded-xl object-cover" />
                ))}
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="field-label">Landmark</label>
              <input className="field-input" value={form.landmark} onChange={update('landmark')} placeholder="E.g. Near the flyover" />
            </div>
            <div>
              <label className="field-label">Approximate area / address</label>
              <input className="field-input" value={form.address} onChange={update('address')} placeholder="E.g. Andheri East, Mumbai" />
            </div>
          </div>

          <button
            type="button"
            onClick={detectLocation}
            className="flex items-center gap-2 text-sm font-medium text-coral-600 hover:text-coral-700"
          >
            <MapPin size={15} />
            {locating ? 'Detecting location...' : coords ? 'Location captured ✓' : 'Use my current location'}
          </button>

          {error && (
            <div className="flex items-start gap-2 rounded-2xl bg-rescue-50 text-rescue-700 px-4 py-3 text-sm">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting} className="btn-emergency w-full text-base disabled:opacity-60">
            {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
            {submitting ? 'Submitting report...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </section>
  );
}
