import { useState } from 'react';
import SectionHeading from '../components/ui/SectionHeading';
import RescueCaseCard from '../components/rescue/RescueCaseCard';
import { SkeletonRow, EmptyState, ErrorState } from '../components/ui/StateViews';
import useFetch from '../hooks/useFetch';

const ANIMAL_FILTERS = ['all', 'dog', 'cat', 'cow', 'bird', 'other'];

export default function RescueBrowse() {
  const [animalType, setAnimalType] = useState('all');
  const { data, loading, error } = useFetch('/rescue-cases', {
    params: { limit: 24, ...(animalType !== 'all' ? { animalType } : {}) },
    deps: [animalType],
  });

  return (
    <section className="section-py pt-32">
      <div className="container-px">
        <SectionHeading
          eyebrow="Rescue Network"
          title="Every case, tracked openly."
          subtitle="Browse verified rescue cases across the PAWSYNC community network."
        />

        <div className="flex flex-wrap gap-2 mt-10">
          {ANIMAL_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setAnimalType(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize border transition-colors ${
                animalType === f ? 'bg-charcoal-900 text-cream-50 border-charcoal-900' : 'border-charcoal-200 text-charcoal-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {loading && <SkeletonRow count={6} className="lg:grid-cols-3" />}
          {!loading && error && <ErrorState message={error} />}
          {!loading && !error && (!data?.cases || data.cases.length === 0) && (
            <EmptyState title="No cases match this filter" message="Try a different animal type, or check back soon." />
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
