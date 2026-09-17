import useFetch from '../../hooks/useFetch';
import { SkeletonRow, EmptyState } from '../../components/ui/StateViews';
import StatusBadge from '../../components/ui/StatusBadge';

export default function AdminDonations() {
  const { data, loading } = useFetch('/donations', { params: { limit: 50 } });

  return (
    <div className="p-6 md:p-10">
      <p className="eyebrow mb-2">Admin</p>
      <h1 className="text-display font-display font-extrabold text-charcoal-900">Donations</h1>

      <div className="mt-8">
        {loading && <SkeletonRow count={3} className="lg:grid-cols-1" />}
        {!loading && (!data?.donations || data.donations.length === 0) && (
          <EmptyState title="No donations yet" message="Confirmed donations will appear here once campaigns go live." />
        )}
        {!loading && data?.donations?.length > 0 && (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-charcoal-400 border-b border-charcoal-100">
                  <th className="px-5 py-3 font-medium">Donation ID</th>
                  <th className="px-5 py-3 font-medium">Case</th>
                  <th className="px-5 py-3 font-medium">Donor</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.donations.map((d) => (
                  <tr key={d._id} className="border-b border-charcoal-50 last:border-0">
                    <td className="px-5 py-3 font-mono text-xs">{d.donationId}</td>
                    <td className="px-5 py-3">{d.rescueCase?.displayName} <span className="text-charcoal-400 text-xs">({d.rescueCase?.caseId})</span></td>
                    <td className="px-5 py-3">{d.isAnonymous ? 'Anonymous' : d.donorName}</td>
                    <td className="px-5 py-3 font-semibold">₹{d.amount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3"><StatusBadge status={d.status} /></td>
                    <td className="px-5 py-3 text-charcoal-400 text-xs">{new Date(d.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
