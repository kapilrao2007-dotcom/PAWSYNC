import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center pt-24">
      <div className="container-px max-w-md mx-auto text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-charcoal-100 text-charcoal-400 mb-6">
          <PawPrint size={22} />
        </span>
        <h1 className="text-display font-display font-bold text-charcoal-900">Page not found</h1>
        <p className="text-charcoal-500 mt-3">The page you're looking for may have moved or doesn't exist.</p>
        <Link to="/" className="btn-primary mt-8 inline-flex">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
