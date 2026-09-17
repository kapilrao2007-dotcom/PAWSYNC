import SectionHeading from '../ui/SectionHeading';
import useCountUp from '../../hooks/useCountUp';
import useFetch from '../../hooks/useFetch';

const FALLBACK = {
  reports: 1284,
  animalsAssisted: 842,
  treatmentCases: 516,
  adoptions: 287,
  activeVolunteers: 164,
  communitiesServed: 32,
};

const METRICS = [
  { key: 'reports', label: 'Reports' },
  { key: 'animalsAssisted', label: 'Animals Assisted' },
  { key: 'treatmentCases', label: 'Treatment Cases' },
  { key: 'adoptions', label: 'Adoptions' },
  { key: 'activeVolunteers', label: 'Active Volunteers' },
  { key: 'communitiesServed', label: 'Communities Served' },
];

function Counter({ value }) {
  const [ref, count] = useCountUp(value, 1800);
  return (
    <span ref={ref} className="text-4xl md:text-5xl font-display font-extrabold text-charcoal-900 tabular-nums">
      {count.toLocaleString('en-IN')}
    </span>
  );
}

export default function CommunityImpact() {
  const { data } = useFetch('/analytics/impact');
  const stats = data?.stats || FALLBACK;

  return (
    <section id="impact" className="section-py bg-cream-100">
      <div className="container-px">
        <SectionHeading
          eyebrow="Community Impact"
          title="Numbers that represent real lives."
          subtitle="This is a demo environment — the figures below reflect sample data seeded for demonstration, not verified real-world outcomes."
          align="center"
        />

        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {METRICS.map((m) => (
            <div key={m.key} className="text-center">
              <Counter value={stats[m.key] ?? FALLBACK[m.key]} />
              <p className="text-sm text-charcoal-500 mt-2">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
