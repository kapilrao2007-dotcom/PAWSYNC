import { motion } from 'framer-motion';
import { Bell, Award, HeartHandshake } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { EmptyState } from '../components/ui/StateViews';

export default function Dashboard() {
  const { user } = useAuth();
  const { data } = useFetch('/notifications');
  const notifications = data?.notifications || [];

  return (
    <section className="pt-32 pb-24">
      <div className="container-px">
        <p className="eyebrow mb-3">My Impact</p>
        <h1 className="text-display-lg font-display font-extrabold text-charcoal-900">Welcome back, {user?.name?.split(' ')[0]}.</h1>

        <div className="grid sm:grid-cols-3 gap-5 mt-10">
          <StatCard icon={Award} label="Contribution Points" value={user?.contributionPoints ?? 0} />
          <StatCard icon={HeartHandshake} label="Level" value={(user?.level || 'none').replace(/_/g, ' ')} capitalize />
          <StatCard icon={Bell} label="Badges Earned" value={user?.badges?.length ?? 0} />
        </div>

        <div className="mt-14">
          <h2 className="font-display font-bold text-xl text-charcoal-900 mb-6">Notifications</h2>
          {notifications.length === 0 ? (
            <EmptyState icon={Bell} title="No notifications yet" message="Updates about your reports, cases and donations will appear here." />
          ) : (
            <div className="space-y-3">
              {notifications.map((n, i) => (
                <motion.div
                  key={n._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`card p-5 flex items-start gap-4 ${!n.isRead ? 'border-coral-200 bg-coral-50/40' : ''}`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal-100 text-charcoal-500 shrink-0">
                    <Bell size={15} />
                  </span>
                  <div>
                    <p className="font-semibold text-charcoal-900 text-sm">{n.title}</p>
                    <p className="text-sm text-charcoal-500 mt-1">{n.message}</p>
                    <p className="text-xs text-charcoal-400 mt-2">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, label, value, capitalize }) {
  return (
    <div className="card p-6">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-charcoal-900 text-cream-50 mb-4">
        <Icon size={18} />
      </span>
      <p className={`text-2xl font-display font-bold text-charcoal-900 ${capitalize ? 'capitalize' : ''}`}>{value}</p>
      <p className="text-sm text-charcoal-500 mt-1">{label}</p>
    </div>
  );
}
