import { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../components/ui/SectionHeading';
import StatusBadge from '../components/ui/StatusBadge';
import { SkeletonRow, EmptyState, ErrorState } from '../components/ui/StateViews';
import useFetch from '../hooks/useFetch';

const SPECIES_FILTERS = ['all', 'dog', 'cat', 'cow', 'bird', 'other'];

export default function Adopt() {
  const [species, setSpecies] = useState('all');
  const { data, loading, error } = useFetch('/animals', {
    params: { adoptionStatus: 'all', limit: 24, ...(species !== 'all' ? { species } : {}) },
    deps: [species],
  });

  const animals = (data?.animals || []).filter((a) => a.adoptionStatus !== 'not_listed');

  return (
    <section className="section-py pt-32">
      <div className="container-px">
        <SectionHeading
          eyebrow="Adoption"
          title="Every animal here has a story of recovery."
          subtitle="Browse animals ready for their next chapter — each profile includes their recovery journey and adoption requirements."
        />

        <div className="flex flex-wrap gap-2 mt-10">
          {SPECIES_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setSpecies(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize border transition-colors ${
                species === f ? 'bg-charcoal-900 text-cream-50 border-charcoal-900' : 'border-charcoal-200 text-charcoal-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {loading && <SkeletonRow count={8} className="lg:grid-cols-4" />}
          {!loading && error && <ErrorState message={error} />}
          {!loading && !error && animals.length === 0 && (
            <EmptyState title="No animals match this filter" message="Try a different species, or check back soon." />
          )}
          {!loading && !error && animals.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {animals.map((animal) => (
                <Link key={animal._id} to={`/adopt/${animal._id}`} className="card overflow-hidden block group">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={animal.photos?.[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=70'}
                      alt={animal.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <StatusBadge status={animal.adoptionStatus} />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-bold text-charcoal-900">{animal.name}</h3>
                    <p className="text-xs text-charcoal-500 mt-1 capitalize">{animal.breed} · {animal.approxAge}</p>
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
