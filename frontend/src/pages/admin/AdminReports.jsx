import { useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { SkeletonRow, EmptyState } from '../../components/ui/StateViews';
import StatusBadge from '../../components/ui/StatusBadge';
import api, { getErrorMessage } from '../../services/api';

const STATUS_FILTERS = ['submitted', 'under_review', 'verified', 'rejected', 'duplicate'];

export default function AdminReports() {
  const [status, setStatus] = useState('submitted');
  const { data, loading, refetch } = useFetch('/rescue-reports', { params: { status, limit: 30 }, deps: [status] });
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  const handleVerify = async (report) => {
    const displayName = window.prompt("Name this animal for the public case page (e.g. 'Rocky'):", 'Unnamed');
    if (displayName === null) return;
    setBusyId(report._id);
    setError('');
    try {
      await api.patch(`/rescue-reports/${report._id}/status`, { status: 'verified', displayName });
      refetch();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (report) => {
    const rejectionReason = window.prompt('Reason for rejection:', '');
    if (rejectionReason === null) return;
    setBusyId(report._id);
    setError('');
    try {
      await api.patch(`/rescue-reports/${report._id}/status`, { status: 'rejected', rejectionReason });
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
      <h1 className="text-display font-display font-extrabold text-charcoal-900">Rescue Reports</h1>

      <div className="flex flex-wrap gap-2 mt-6">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize border transition-colors ${
              status === s ? 'bg-charcoal-900 text-cream-50 border-charcoal-900' : 'border-charcoal-200 text-charcoal-600'
            }`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-rescue-600 mt-4">{error}</p>}

      <div className="mt-8">
        {loading && <SkeletonRow count={3} className="lg:grid-cols-1" />}
        {!loading && (!data?.reports || data.reports.length === 0) && (
          <EmptyState title="No reports in this queue" message="New submissions will appear here as they come in." />
        )}
        {!loading && data?.reports?.length > 0 && (
          <div className="space-y-4">
            {data.reports.map((report) => (
              <div key={report._id} className="card p-5 flex flex-col md:flex-row md:items-center gap-4">
                <img
                  src={report.photos?.[0] || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=200&q=60'}
                  alt=""
                  className="h-20 w-20 rounded-2xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={report.status} />
                    <span className="text-xs text-charcoal-400 capitalize">{report.animalType} · {report.condition}</span>
                  </div>
                  <p className="text-sm text-charcoal-700 mt-2 line-clamp-2">{report.description}</p>
                  <p className="text-xs text-charcoal-400 mt-1">
                    {report.location?.address || 'No address'} {report.landmark && `· ${report.landmark}`}
                  </p>
                </div>
                {report.status === 'submitted' || report.status === 'under_review' ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleVerify(report)}
                      disabled={busyId === report._id}
                      className="btn-primary !py-2.5 !px-4 text-sm disabled:opacity-60"
                    >
                      {busyId === report._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                      Verify
                    </button>
                    <button
                      onClick={() => handleReject(report)}
                      disabled={busyId === report._id}
                      className="btn-outline !py-2.5 !px-4 text-sm disabled:opacity-60"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
