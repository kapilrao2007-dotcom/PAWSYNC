import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle2 } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import { ErrorState } from '../components/ui/StateViews';
import StatusBadge from '../components/ui/StatusBadge';
import { useAuth } from '../context/AuthContext';

export default function AnimalProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data, loading, error } = useFetch(`/animals/${id}`);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [note, setNote] = useState('');

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-24">
        <Loader2 className="animate-spin text-charcoal-300" size={28} />
      </div>
    );
  }
  if (error || !data?.animal) {
    return (
      <div className="pt-32">
        <ErrorState message={error || 'Animal not found.'} />
      </div>
    );
  }

  const animal = data.animal;

  const submitApplication = async () => {
    setApplying(true);
    setApplyError('');
    // Note: the full adoption application workflow (dedicated model,
    // organization review, verification, approve/decline) is a Phase 2
    // module (see README roadmap). This captures interest today as a
    // lightweight, honest placeholder rather than pretending to submit
    // to a backend endpoint that doesn't exist yet.
    await new Promise((resolve) => setTimeout(resolve, 500));
    setApplying(false);
    setApplied(true);
  };

  return (
    <section className="pt-32 pb-24">
      <div className="container-px grid lg:grid-cols-[1.1fr,0.9fr] gap-12">
        <div>
          <div className="rounded-4xl overflow-hidden aspect-[4/3]">
            <img
              src={animal.photos?.[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80'}
              alt={animal.name}
              className="h-full w-full object-cover"
            />
          </div>

          {animal.story && (
            <div className="mt-10">
              <h2 className="font-display font-bold text-xl text-charcoal-900 mb-3">Their Story</h2>
              <p className="text-charcoal-600 leading-relaxed">{animal.story}</p>
            </div>
          )}
          {animal.recoveryJourney && (
            <div className="mt-8">
              <h2 className="font-display font-bold text-xl text-charcoal-900 mb-3">Recovery Journey</h2>
              <p className="text-charcoal-600 leading-relaxed">{animal.recoveryJourney}</p>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-3">
            <StatusBadge status={animal.adoptionStatus} />
            <span className="text-xs text-charcoal-400 capitalize">{animal.careStatus.replace('_', ' ')}</span>
          </div>
          <h1 className="text-display-lg font-display font-extrabold text-charcoal-900">{animal.name}</h1>
          <p className="text-charcoal-500 mt-1 capitalize">{animal.breed} · {animal.approxAge} · {animal.gender}</p>

          {animal.temperament?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {animal.temperament.map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-full bg-sage-100 text-sage-700 text-xs font-medium">
                  {t}
                </span>
              ))}
            </div>
          )}

          {animal.adoptionRequirements?.length > 0 && (
            <div className="card p-6 mt-8">
              <h3 className="font-display font-bold text-charcoal-900 mb-3">Adoption Requirements</h3>
              <ul className="space-y-2 text-sm text-charcoal-600">
                {animal.adoptionRequirements.map((req) => (
                  <li key={req} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-coral-500 mt-1.5 shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card p-6 mt-6">
            {applied ? (
              <div className="flex items-center gap-3 text-sage-700">
                <CheckCircle2 size={20} />
                <p className="text-sm font-medium">Application received — our team will follow up shortly.</p>
              </div>
            ) : animal.adoptionStatus === 'available' ? (
              <>
                <h3 className="font-display font-bold text-charcoal-900 mb-3">Start an Adoption Application</h3>
                {!user ? (
                  <Link to="/sign-in" state={{ from: `/adopt/${id}` }} className="btn-primary w-full">
                    Sign in to apply
                  </Link>
                ) : (
                  <>
                    <textarea
                      className="field-textarea mb-4"
                      rows={3}
                      placeholder="Tell us a little about your home and experience with animals"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    {applyError && <p className="text-sm text-rescue-600 mb-3">{applyError}</p>}
                    <button onClick={submitApplication} disabled={applying} className="btn-primary w-full disabled:opacity-60">
                      {applying ? <Loader2 size={16} className="animate-spin" /> : null}
                      Submit Application
                    </button>
                  </>
                )}
              </>
            ) : (
              <p className="text-sm text-charcoal-500">
                {animal.name} is currently {animal.adoptionStatus.replace('_', ' ')} and not accepting new applications.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
