import { Link } from 'react-router-dom';
import { PawPrint, Instagram, Twitter, Facebook } from 'lucide-react';

const COLUMNS = [
  {
    title: 'PAWSYNC',
    links: [
      { label: 'About', to: '/about' },
      { label: 'How It Works', to: '/#how-it-works' },
      { label: 'Community Impact', to: '/#impact' },
    ],
  },
  {
    title: 'Get Involved',
    links: [
      { label: 'Rescue', to: '/rescue' },
      { label: 'Donate', to: '/donate' },
      { label: 'Adopt', to: '/adopt' },
      { label: 'Volunteer', to: '/volunteer' },
    ],
  },
  {
    title: 'Network',
    links: [
      { label: 'Organizations', to: '/organizations' },
      { label: 'Veterinary Partners', to: '/vets' },
      { label: 'Lost & Found', to: '/lost-and-found' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' },
      { label: 'Contact', to: '/contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-cream-200">
      <div className="container-px section-py grid grid-cols-2 md:grid-cols-6 gap-10">
        <div className="col-span-2 md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50 text-charcoal-900">
              <PawPrint size={18} />
            </span>
            <span className="font-display font-extrabold text-cream-50 text-xl">PAWSYNC</span>
          </Link>
          <p className="text-charcoal-300 text-sm leading-relaxed max-w-xs">
            One community-powered network connecting animals in need with people ready to help.
          </p>
          <div className="flex items-center gap-3 mt-6">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal-700 text-charcoal-300 hover:text-cream-50 hover:border-cream-50 transition-colors"
                aria-label="Social link"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-cream-50 mb-4">{col.title}</h4>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-charcoal-300 hover:text-cream-50 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-charcoal-700">
        <div className="container-px py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-charcoal-400">
          <p>&copy; {new Date().getFullYear()} PAWSYNC. Together, we can make every rescue count.</p>
          <p className="text-charcoal-500">Demo environment — sample data shown throughout.</p>
        </div>
      </div>
    </footer>
  );
}
