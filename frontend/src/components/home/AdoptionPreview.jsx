import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { SkeletonRow, EmptyState, ErrorState } from '../ui/StateViews';
import useFetch from '../../hooks/useFetch';

export default function AdoptionPreview() {
  const { data, loading, error } = useFetch('/animals', { params: { adoptionStatus: 'available', limit: 4 } });

  return (
    <section className="section-py bg-sage-50">
      <div className="container-px">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Adoption"
            title="Meet animals ready for a home."
            subtitle="Every animal here has completed treatment and recovery — now they're looking for a family."
          />
          <Link to="/adopt" className="btn-outline shrink-0 self-start md:self-auto">
            Browse all animals <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="mt-12">
          {loading && <SkeletonRow count={4} className="lg:grid-cols-4" />}
          {!loading && error && <ErrorState message={error} />}
          {!loading && !error && (!data?.animals || data.animals.length === 0) && (
            <EmptyState title="No animals available for adoption right now" message="Check back soon — new profiles are added as animals complete recovery." />
          )}
          {!loading && !error && data?.animals?.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.animals.map((animal) => (
                <Link key={animal._id} to={`/adopt/${animal._id}`} className="card overflow-hidden block group">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={animal.photos?.[0] || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=70'}
                      alt={animal.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
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
