import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import ProgressBar from '../ui/ProgressBar';
import { SkeletonRow, EmptyState, ErrorState } from '../ui/StateViews';
import useFetch from '../../hooks/useFetch';

export default function DonationCampaigns() {
  const { data, loading, error } = useFetch('/rescue-cases', { params: { limit: 20 } });
  const campaigns = (data?.cases || []).filter((c) => c.campaign?.isApproved && !c.campaign?.isClosed).slice(0, 3);

  return (
    <section className="section-py bg-cream-100">
      <div className="container-px">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Donation Campaigns"
            title="Fund a recovery, transparently."
            subtitle="Every campaign shows exactly where funds go — from the treatment estimate to each approved expense."
          />
          <Link to="/donate" className="btn-outline shrink-0 self-start md:self-auto">
            View all campaigns <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="mt-12">
          {loading && <SkeletonRow count={3} />}
          {!loading && error && <ErrorState message={error} />}
          {!loading && !error && campaigns.length === 0 && (
            <EmptyState
              title="No active campaigns"
              message="Donation campaigns open once a rescue case's treatment estimate is verified and approved."
            />
          )}
          {!loading && !error && campaigns.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((c) => (
                <Link key={c.caseId} to={`/donate/${c.caseId}`} className="card overflow-hidden block group">
                  <div className="relative h-40 overflow-hidden">
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
                        <span className="font-semibold text-charcoal-900">₹{c.campaign.raisedAmount.toLocaleString('en-IN')} raised</span>
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
