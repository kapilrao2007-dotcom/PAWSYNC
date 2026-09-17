const STYLES = {
  reported: 'bg-charcoal-100 text-charcoal-700',
  verified: 'bg-sage-100 text-sage-700',
  volunteer_assigned: 'bg-coral-100 text-coral-700',
  rescue_in_progress: 'bg-coral-100 text-coral-700',
  rescued: 'bg-sage-100 text-sage-700',
  treatment: 'bg-rescue-100 text-rescue-700',
  foster_shelter: 'bg-sage-100 text-sage-700',
  recovered: 'bg-sage-200 text-sage-800',
  adoption: 'bg-coral-100 text-coral-700',
  closed: 'bg-charcoal-100 text-charcoal-600',
  submitted: 'bg-charcoal-100 text-charcoal-700',
  under_review: 'bg-coral-100 text-coral-700',
  rejected: 'bg-rescue-100 text-rescue-700',
  available: 'bg-sage-100 text-sage-700',
  pending: 'bg-coral-100 text-coral-700',
  adopted: 'bg-charcoal-100 text-charcoal-600',
  confirmed: 'bg-sage-100 text-sage-700',
  refunded: 'bg-charcoal-100 text-charcoal-600',
};

export default function StatusBadge({ status }) {
  const label = String(status || '').replace(/_/g, ' ');
  const style = STYLES[status] || 'bg-charcoal-100 text-charcoal-700';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${style}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
