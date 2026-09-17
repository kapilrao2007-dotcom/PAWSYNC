import { PawPrint, AlertTriangle } from 'lucide-react';

export function SkeletonRow({ count = 3, className = '' }) {
  return (
    <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-5 animate-pulse">
          <div className="h-40 rounded-2xl bg-charcoal-100 mb-4" />
          <div className="h-4 w-2/3 rounded bg-charcoal-100 mb-2" />
          <div className="h-3 w-1/2 rounded bg-charcoal-100" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', message, icon: Icon = PawPrint }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-charcoal-100 text-charcoal-400 mb-4">
        <Icon size={22} />
      </span>
      <h3 className="font-display font-semibold text-lg text-charcoal-800">{title}</h3>
      {message && <p className="text-sm text-charcoal-500 mt-2 max-w-sm">{message}</p>}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong. Please try again.' }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rescue-100 text-rescue-600 mb-4">
        <AlertTriangle size={22} />
      </span>
      <h3 className="font-display font-semibold text-lg text-charcoal-800">Couldn't load this section</h3>
      <p className="text-sm text-charcoal-500 mt-2 max-w-sm">{message}</p>
    </div>
  );
}
