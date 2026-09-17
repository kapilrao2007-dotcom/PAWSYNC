import { FileWarning, ShieldAlert, HeartHandshake, Stethoscope, HandCoins, Users, PawPrint } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { SkeletonRow } from '../../components/ui/StateViews';

const CARDS = [
  { key: 'totalReports', label: 'Total Reports', icon: FileWarning },
  { key: 'pendingVerification', label: 'Pending Verification', icon: ShieldAlert },
  { key: 'activeRescues', label: 'Active Rescues', icon: HeartHandshake },
  { key: 'treatmentCases', label: 'Treatment Cases', icon: Stethoscope },
  { key: 'totalDonations', label: 'Donations (₹)', icon: HandCoins, isCurrency: true },
  { key: 'verifiedVolunteers', label: 'Verified Volunteers', icon: Users },
  { key: 'adoptions', label: 'Adoptions', icon: PawPrint },
];

export default function AdminOverview() {
  const { data, loading } = useFetch('/analytics/admin-summary');
  const summary = data?.summary || {};

  return (
    <div className="p-6 md:p-10">
      <p className="eyebrow mb-2">Admin</p>
      <h1 className="text-display font-display font-extrabold text-charcoal-900">Dashboard</h1>

      <div className="mt-8">
        {loading ? (
          <SkeletonRow count={4} className="lg:grid-cols-4" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CARDS.map((card) => (
              <div key={card.key} className="card p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-charcoal-900 text-cream-50 mb-4">
                  <card.icon size={18} />
                </span>
                <p className="text-2xl font-display font-bold text-charcoal-900">
                  {card.isCurrency ? '₹' : ''}
                  {(summary[card.key] ?? 0).toLocaleString('en-IN')}
                </p>
                <p className="text-sm text-charcoal-500 mt-1">{card.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
