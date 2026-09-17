import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import useFetch from '../../hooks/useFetch';

const FALLBACK_PARTNERS = [
  { name: 'Second Chance Animal Trust', type: 'ngo', location: 'Mumbai' },
  { name: 'Bandra Street Paws Shelter', type: 'shelter', location: 'Mumbai' },
  { name: 'CarePlus Veterinary Clinic', type: 'vet_clinic', location: 'Mumbai' },
];

export default function PartnerNetwork() {
  const { data } = useFetch('/organizations');
  const partners = data?.organizations?.length ? data.organizations : FALLBACK_PARTNERS;

  return (
    <section className="section-py bg-cream-100">
      <div className="container-px">
        <SectionHeading
          eyebrow="Partner Network"
          title="Backed by verified organizations."
          subtitle="Every shelter, NGO and veterinary partner on PAWSYNC is reviewed and verified before joining the network."
          align="center"
        />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {partners.slice(0, 6).map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card p-6 flex items-center gap-4"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-charcoal-900 text-cream-50 font-display font-bold text-sm shrink-0">
                {p.name.slice(0, 2).toUpperCase()}
              </span>
              <div>
                <p className="font-semibold text-charcoal-900">{p.name}</p>
                <p className="text-xs text-charcoal-500 mt-0.5 capitalize">{p.type?.replace('_', ' ')} · {p.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
