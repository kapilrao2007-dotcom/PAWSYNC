import { Link } from 'react-router-dom';
import SectionHeading from '../components/ui/SectionHeading';
import ProgressBar from '../components/ui/ProgressBar';
import { SkeletonRow, EmptyState, ErrorState } from '../components/ui/StateViews';
import useFetch from '../hooks/useFetch';

export default function DonationBrowse() {
  const { data, loading, error } = useFetch('/rescue-cases', { params: { limit: 30 } });
  const campaigns = (data?.cases || []).filter((c) => c.campaign?.isApproved);

  return (
    <section className="section-py pt-32">
      <div className="container-px">
        <SectionHeading
          eyebrow="Donation Campaigns"
          title="Fund a recovery, transparently."
          subtitle="Every campaign here has been reviewed and approved, with treatment estimates and a full expense ledger."
        />

        <div className="mt-12">
          {loading && <SkeletonRow count={6} className="lg:grid-cols-3" />}
          {!loading && error && <ErrorState message={error} />}
          {!loading && !error && campaigns.length === 0 && (
            <EmptyState title="No active campaigns" message="Check back soon — campaigns open once treatment estimates are approved." />
          )}
          {!loading && !error && campaigns.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((c) => (
                <Link key={c.caseId} to={`/donate/${c.caseId}`} className="card overflow-hidden block group">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={c.photos?.[0] || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=70'}
                      alt={c.displayName}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-lg text-charcoal-900">{c.campaign.title}</h3>
                    <div className="mt-4">
                      <ProgressBar value={c.campaign.raisedAmount} goal={c.campaign.goalAmount} />
                      <div className="flex items-center justify-between mt-2 text-sm">
                        <span className="font-semibold text-charcoal-900">₹{c.campaign.raisedAmount.toLocaleString('en-IN')}</span>
                        <span className="text-charcoal-400">of ₹{c.campaign.goalAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
