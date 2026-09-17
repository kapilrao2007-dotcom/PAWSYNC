import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import { ErrorState } from '../components/ui/StateViews';

export default function DonationReceipt() {
  const { donationId } = useParams();
  const { data, loading, error } = useFetch(`/donations/${donationId}/receipt`);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-24">
        <Loader2 className="animate-spin text-charcoal-300" size={28} />
      </div>
    );
  }
  if (error || !data?.receipt) {
    return (
      <div className="pt-32">
        <ErrorState message={error || 'Receipt not found.'} />
      </div>
    );
  }

  const r = data.receipt;

  return (
    <section className="section-py min-h-[70vh] flex items-center">
      <div className="container-px max-w-md mx-auto text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 text-sage-600 mb-6">
          <CheckCircle2 size={28} />
        </span>
        <h1 className="text-display font-display font-bold text-charcoal-900">Thank you for your support</h1>
        <p className="text-charcoal-500 mt-3">Your donation has been confirmed and added to {r.caseName}'s campaign.</p>

        <div className="card p-6 mt-8 text-left space-y-4">
          <Row label="Donation ID" value={r.donationId} mono />
          <Row label="Case ID" value={r.caseId} mono />
          <Row label="Amount" value={`₹${r.amount.toLocaleString('en-IN')}`} />
          <Row label="Payment Status" value={r.status} capitalize />
          <Row label="Donor" value={r.donorName} />
          <Row label="Timestamp" value={new Date(r.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
          <Link to={`/rescue/${r.caseId}`} className="btn-primary">
            View Rescue Case
          </Link>
          <Link to="/" className="btn-outline">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, mono, capitalize }) {
  return (
    <div className="flex items-center justify-between pb-3 border-b border-charcoal-100 last:border-0 last:pb-0">
      <span className="text-xs text-charcoal-400">{label}</span>
      <span className={`text-sm font-semibold text-charcoal-900 ${mono ? 'font-mono' : ''} ${capitalize ? 'capitalize' : ''}`}>
        {value}
      </span>
    </div>
  );
}
