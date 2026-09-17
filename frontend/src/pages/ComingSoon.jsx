import { Link, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const TITLES = {
  '/about': 'About PAWSYNC',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Service',
  '/contact': 'Contact Us',
  '/organizations': 'Organization Directory',
  '/vets': 'Veterinary Network',
  '/lost-and-found': 'Lost & Found',
};

export default function ComingSoon() {
  const { pathname } = useLocation();
  const title = TITLES[pathname] || 'Coming Soon';

  return (
    <section className="min-h-[70vh] flex items-center justify-center pt-24">
      <div className="container-px max-w-md mx-auto text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-coral-100 text-coral-600 mb-6">
          <Sparkles size={22} />
        </span>
        <h1 className="text-display font-display font-bold text-charcoal-900">{title}</h1>
        <p className="text-charcoal-500 mt-3">
          This module is part of the PAWSYNC roadmap and is being built out in an upcoming phase. Thanks for your patience.
        </p>
        <Link to="/" className="btn-outline mt-8 inline-flex">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
