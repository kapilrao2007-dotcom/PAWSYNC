import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Users } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import useFetch from '../../hooks/useFetch';

export default function VolunteerNetwork() {
  const { data } = useFetch('/volunteers', { params: { limit: 4 } });
  const volunteers = data?.volunteers || [];

  return (
    <section className="section-py bg-charcoal-900 text-cream-50">
      <div className="container-px grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <SectionHeading
            eyebrow="Volunteer Network"
            title="Real people, showing up for animals."
            subtitle="Verified volunteers across every neighborhood coordinate rescues, transport, fostering and awareness work."
            className="[&_*]:!text-cream-50 [&_.eyebrow]:!text-coral-300"
          />
          <p className="text-charcoal-300 mt-4 max-w-md">
            Volunteers are never sent into dangerous situations alone — every case offers the option to request professional assistance instead.
          </p>
          <Link to="/volunteer" className="btn-accent mt-8">
            Become a Volunteer <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {(volunteers.length > 0
            ? volunteers
            : [
                { user: { name: 'Rehan Sheikh', area: 'Andheri' }, stats: { casesAssisted: 15 } },
                { user: { name: 'Priya Nair', area: 'Powai' }, stats: { casesAssisted: 22 } },
                { user: { name: 'Karan Mehta', area: 'Bandra' }, stats: { casesAssisted: 6 } },
                { user: { name: 'You?', area: 'Your area' }, stats: { casesAssisted: 0 } },
              ]
          )
            .slice(0, 4)
            .map((v, i) => (
              <motion.div
                key={v.user?.name || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-3xl bg-charcoal-800 border border-charcoal-700 p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal-700 text-coral-300 mb-4">
                  <Users size={16} />
                </span>
                <p className="font-semibold text-cream-50">{v.user?.name}</p>
                <p className="text-xs text-charcoal-400 mt-0.5">{v.user?.area}</p>
                <p className="text-xs text-charcoal-400 mt-3">{v.stats?.casesAssisted || 0} cases assisted</p>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
