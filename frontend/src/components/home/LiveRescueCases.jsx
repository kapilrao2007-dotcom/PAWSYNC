import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import RescueCaseCard from '../rescue/RescueCaseCard';
import { SkeletonRow, EmptyState, ErrorState } from '../ui/StateViews';
import useFetch from '../../hooks/useFetch';

export default function LiveRescueCases() {
  const { data, loading, error } = useFetch('/rescue-cases', { params: { limit: 3 } });

  return (
    <section className="section-py bg-cream-100">
      <div className="container-px">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Live Rescue Cases"
            title="Rescues happening right now."
            subtitle="Every case here has been verified by our team and is being actively coordinated by the community."
          />
          <Link to="/rescue" className="btn-outline shrink-0 self-start md:self-auto">
            View all cases <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="mt-12">
          {loading && <SkeletonRow count={3} />}
          {!loading && error && <ErrorState message={error} />}
          {!loading && !error && (!data?.cases || data.cases.length === 0) && (
            <EmptyState title="No active cases right now" message="Verified rescue cases will appear here as they're reported and confirmed." />
          )}
          {!loading && !error && data?.cases?.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.cases.map((c, i) => (
                <RescueCaseCard key={c.caseId} rescueCase={c} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
