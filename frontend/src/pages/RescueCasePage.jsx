import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, HeartHandshake, ShieldAlert, Loader2 } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage } from '../services/api';
import StatusBadge from '../components/ui/StatusBadge';
import CaseTimeline from '../components/rescue/CaseTimeline';
import ProgressBar from '../components/ui/ProgressBar';
import { ErrorState } from '../components/ui/StateViews';

export default function RescueCasePage() {
  const { caseId } = useParams();
  const { user } = useAuth();
  const { data, loading, error, refetch } = useFetch(`/rescue-cases/${caseId}`);
  const [activePhoto, setActivePhoto] = useState(0);
  const [actionMsg, setActionMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-24">
        <Loader2 className="animate-spin text-charcoal-300" size={28} />
      </div>
    );
  }
  if (error || !data?.case) {
    return (
      <div className="pt-32">
        <ErrorState message={error || 'This case could not be found.'} />
      </div>
    );
  }

  const rescueCase = data.case;
  const photos = rescueCase.photos?.length
    ? rescueCase.photos
    : ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80'];

  const canAssist = user && ['volunteer', 'admin', 'organization'].includes(user.role);

  const handleIcanHelp = async () => {
    setActionLoading(true);
    setActionMsg('');
    try {
      await api.patch(`/rescue-cases/${caseId}/assign`, {});
      setActionMsg("You're now assigned to this case. Thank you for stepping up.");
      refetch();
    } catch (err) {
      setActionMsg(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestProfessional = async () => {
    setActionLoading(true);
    setActionMsg('');
    try {
      await api.patch(`/rescue-cases/${caseId}/assign`, { requestProfessionalAssistance: true });
      setActionMsg('Professional assistance requested for this case.');
      refetch();
    } catch (err) {
      setActionMsg(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <section className="pt-32 pb-24">
      <div className="container-px grid lg:grid-cols-[1.2fr,0.8fr] gap-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <StatusBadge status={rescueCase.status} />
            <span className="text-xs font-mono text-charcoal-400">{rescueCase.caseId}</span>
          </div>
          <h1 className="text-display-lg font-display font-extrabold text-charcoal-900">
            {rescueCase.displayName || 'Unnamed'}
          </h1>
          <p className="text-charcoal-500 capitalize mt-1">{rescueCase.condition} {rescueCase.animalType}</p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-4xl overflow-hidden aspect-[16/10]"
          >
            <img src={photos[activePhoto]} alt={rescueCase.displayName} className="h-full w-full object-cover" />
          </motion.div>
          {photos.length > 1 && (
            <div className="flex gap-2 mt-3">
              {photos.map((p, i) => (
                <button
                  key={p}
                  onClick={() => setActivePhoto(i)}
                  className={`h-16 w-16 rounded-xl overflow-hidden border-2 ${activePhoto === i ? 'border-coral-500' : 'border-transparent'}`}
                >
                  <img src={p} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 mt-6 text-sm text-charcoal-500">
            <MapPin size={15} />
            <span>{rescueCase.location?.address || 'Approximate area'} {rescueCase.location?.approximate && '(approximate)'}</span>
          </div>

          <div className="mt-12">
            <h2 className="font-display font-bold text-xl text-charcoal-900 mb-6">Case Timeline</h2>
            <CaseTimeline timeline={rescueCase.timeline} currentStatus={rescueCase.status} />
          </div>
        </div>

        <div className="space-y-6">
          {rescueCase.campaign?.isApproved && (
            <div className="card p-6">
              <p className="eyebrow mb-2">{rescueCase.campaign.title}</p>
              <ProgressBar value={rescueCase.campaign.raisedAmount} goal={rescueCase.campaign.goalAmount} />
              <div className="flex items-center justify-between mt-3 text-sm">
                <span className="font-semibold text-charcoal-900">
                  ₹{rescueCase.campaign.raisedAmount.toLocaleString('en-IN')} raised
                </span>
                <span className="text-charcoal-400">of ₹{rescueCase.campaign.goalAmount.toLocaleString('en-IN')}</span>
              </div>
              <Link to={`/donate/${rescueCase.caseId}`} className="btn-accent w-full mt-5">
                <HeartHandshake size={16} /> Support This Rescue
              </Link>
            </div>
          )}

          {rescueCase.assignedVolunteer && (
            <div className="card p-6">
              <p className="eyebrow mb-3">Assigned Volunteer</p>
              <p className="font-semibold text-charcoal-900">{rescueCase.assignedVolunteer.name}</p>
            </div>
          )}

          {canAssist && !rescueCase.assignedVolunteer && (
            <div className="card p-6">
              <p className="eyebrow mb-3">Respond to this case</p>
              <div className="flex flex-col gap-3">
                <button onClick={handleIcanHelp} disabled={actionLoading} className="btn-primary w-full disabled:opacity-60">
                  I Can Help
                </button>
                <button onClick={handleRequestProfessional} disabled={actionLoading} className="btn-outline w-full disabled:opacity-60">
                  <ShieldAlert size={15} /> Request Professional Assistance
                </button>
              </div>
              {actionMsg && <p className="text-sm text-charcoal-500 mt-3">{actionMsg}</p>}
            </div>
          )}

          <div className="card p-6 bg-sage-50 border-sage-100">
            <p className="text-sm text-charcoal-600 leading-relaxed">
              For everyone's safety, exact rescue locations are only shared with verified volunteers and organizations once assigned.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
