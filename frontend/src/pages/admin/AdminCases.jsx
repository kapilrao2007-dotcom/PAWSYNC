import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { SkeletonRow, EmptyState } from '../../components/ui/StateViews';
import StatusBadge from '../../components/ui/StatusBadge';
import api, { getErrorMessage } from '../../services/api';
import { TIMELINE_STAGES } from '../../lib/constants';

export default function AdminCases() {
  const { data, loading, refetch } = useFetch('/rescue-cases', { params: { limit: 50, includeHidden: 'true' } });
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  const advanceStatus = async (rescueCase, stage) => {
    setBusyId(rescueCase.caseId);
    setError('');
    try {
      await api.patch(`/rescue-cases/${rescueCase.caseId}/status`, { stage, note: `Marked as ${stage.replace(/_/g, ' ')} by admin` });
      refetch();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const approveCampaign = async (rescueCase) => {
    const goalAmount = window.prompt('Campaign goal amount (₹):', '5000');
    if (!goalAmount) return;
    const treatmentEstimate = window.prompt('Treatment estimate summary:', '');
    setBusyId(rescueCase.caseId);
    setError('');
    try {
      await api.patch(`/rescue-cases/${rescueCase.caseId}/campaign/approve`, {
        goalAmount: Number(goalAmount),
        treatmentEstimate,
      });
      refetch();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const addExpense = async (rescueCase) => {
    const label = window.prompt('Expense label (e.g. Veterinary treatment):', '');
    if (!label) return;
    const amount = window.prompt('Amount (₹):', '500');
    if (!amount) return;
    setBusyId(rescueCase.caseId);
    setError('');
    try {
      await api.post(`/rescue-cases/${rescueCase.caseId}/expenses`, { label, amount: Number(amount) });
      refetch();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <p className="eyebrow mb-2">Admin</p>
      <h1 className="text-display font-display font-extrabold text-charcoal-900">Rescue Cases</h1>

      {error && <p className="text-sm text-rescue-600 mt-4">{error}</p>}

      <div className="mt-8">
        {loading && <SkeletonRow count={3} className="lg:grid-cols-1" />}
        {!loading && (!data?.cases || data.cases.length === 0) && <EmptyState title="No cases yet" />}
        {!loading && data?.cases?.length > 0 && (
          <div className="space-y-4">
            {data.cases.map((c) => (
              <div key={c.caseId} className="card p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <img
                    src={c.photos?.[0] || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=200&q=60'}
                    alt=""
                    className="h-16 w-16 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={c.status} />
                      <span className="text-xs font-mono text-charcoal-400">{c.caseId}</span>
                      {c.isHidden && <span className="text-xs text-rescue-500 font-medium">Unlisted</span>}
                    </div>
                    <p className="font-semibold text-charcoal-900 mt-1">{c.displayName}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <select
                      className="field-input !py-2 !px-3 text-sm w-auto"
                      value={c.status}
                      disabled={busyId === c.caseId}
                      onChange={(e) => advanceStatus(c, e.target.value)}
                    >
                      {TIMELINE_STAGES.map((stage) => (
                        <option key={stage} value={stage}>
                          {stage.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                    {busyId === c.caseId && <Loader2 size={14} className="animate-spin text-charcoal-400" />}
                    {!c.campaign?.isApproved ? (
                      <button onClick={() => approveCampaign(c)} className="btn-outline !py-2 !px-3 text-sm">
                        Approve Campaign
                      </button>
                    ) : (
                      <button onClick={() => addExpense(c)} className="btn-outline !py-2 !px-3 text-sm">
                        Add Expense
                      </button>
                    )}
                  </div>
                </div>

                {c.campaign?.isApproved && (
                  <p className="text-xs text-charcoal-400 mt-3">
                    Campaign: ₹{c.campaign.raisedAmount.toLocaleString('en-IN')} raised of ₹{c.campaign.goalAmount.toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
