import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, PawPrint } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { label: 'Rescue', to: '/rescue' },
  { label: 'Discover', to: '/discover' },
  { label: 'Donate', to: '/donate' },
  { label: 'Adopt', to: '/adopt' },
  { label: 'Volunteer', to: '/volunteer' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 flex justify-center pt-3 md:pt-5 px-4">
        <motion.nav
          initial={false}
          animate={{
            width: scrolled ? 'min(920px, 96%)' : '100%',
            paddingTop: scrolled ? 8 : 14,
            paddingBottom: scrolled ? 8 : 14,
          }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className={`max-w-6xl flex items-center justify-between px-5 md:px-7 rounded-full transition-colors duration-500 ${
            scrolled
              ? 'glass-surface shadow-soft border-charcoal-100'
              : 'bg-transparent border border-transparent'
          }`}
        >
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="PAWSYNC home">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal-900 text-cream-50">
              <PawPrint size={16} strokeWidth={2.4} />
            </span>
            <span className="font-display font-extrabold tracking-tight text-charcoal-900 text-lg">
              PAWSYNC
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                      isActive ? 'text-charcoal-900' : 'text-charcoal-500 hover:text-charcoal-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-indicator"
                          className="absolute left-4 right-4 -bottom-0.5 h-[2px] bg-coral-500 rounded-full"
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="px-4 py-2 text-sm font-medium text-charcoal-700 hover:text-charcoal-900 transition-colors"
                >
                  {user.name?.split(' ')[0]}
                </Link>
                <button onClick={logout} className="btn-outline !px-5 !py-2.5 text-sm">
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/sign-in" className="px-4 py-2 text-sm font-medium text-charcoal-700 hover:text-charcoal-900 transition-colors">
                Sign In
              </Link>
            )}
            <Link to="/report" className="btn-accent !px-5 !py-2.5 text-sm">
              Get Help
            </Link>
          </div>

          <button
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-charcoal-800"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={22} />
          </button>
        </motion.nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-cream-50 md:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-6 pt-6">
              <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal-900 text-cream-50">
                  <PawPrint size={16} />
                </span>
                <span className="font-display font-extrabold text-charcoal-900 text-lg">PAWSYNC</span>
              </Link>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal-800"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <motion.ul
              className="flex flex-col gap-1 px-6 mt-10"
              initial="closed"
              animate="open"
              variants={{ open: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
            >
              {NAV_LINKS.map((link) => (
                <motion.li
                  key={link.to}
                  variants={{
                    closed: { opacity: 0, y: 16 },
                    open: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    to={link.to}
                    className="block py-4 text-display-sm font-display font-semibold text-charcoal-900 border-b border-charcoal-100"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>

            <div className="px-6 mt-10 flex flex-col gap-3">
              {user ? (
                <>
                  <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-outline w-full">
                    My Dashboard
                  </Link>
                  <button onClick={logout} className="btn-ghost w-full justify-center">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/sign-in" className="btn-outline w-full">
                  Sign In
                </Link>
              )}
              <Link to="/report" className="btn-accent w-full">
                Get Help
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
