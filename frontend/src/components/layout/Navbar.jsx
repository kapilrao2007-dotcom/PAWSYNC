import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, PawPrint, ArrowUpRight, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  {
    label: 'Rescue',
    to: '/rescue',
    menu: {
      columns: [
        {
          heading: 'Explore Rescue',
          items: [
            { label: 'Browse Rescue Cases', to: '/rescue' },
            { label: 'Rescue Network Map', to: '/rescue' },
            { label: 'How PAWSYNC Works', to: '/#how-it-works' },
          ],
        },
        {
          heading: 'Respond',
          items: [
            { label: 'Report an Animal', to: '/report' },
            { label: 'Become a Volunteer', to: '/volunteer' },
            { label: 'Safety & Privacy', to: '/privacy' },
          ],
        },
      ],
      featured: {
        eyebrow: 'Emergency',
        title: 'See an animal in need?',
        desc: 'Report it in under a minute — no diagnosis needed.',
        to: '/report',
        cta: 'Report an Animal',
      },
    },
  },
  {
    label: 'Discover',
    to: '/discover',
    menu: {
      columns: [
        {
          heading: 'Explore',
          items: [
            { label: 'Live Rescue Cases', to: '/rescue' },
            { label: 'Community Impact', to: '/#impact' },
            { label: 'Rescue Network Map', to: '/discover' },
          ],
        },
        {
          heading: 'Network',
          items: [
            { label: 'Partner Organizations', to: '/organizations' },
            { label: 'Veterinary Network', to: '/vets' },
            { label: 'Lost & Found', to: '/lost-and-found' },
          ],
        },
      ],
      featured: {
        eyebrow: 'Community',
        title: 'One community. Every life.',
        desc: 'See how the whole rescue network fits together.',
        to: '/about',
        cta: 'About PAWSYNC',
      },
    },
  },
  {
    label: 'Donate',
    to: '/donate',
    menu: {
      columns: [
        {
          heading: 'Give',
          items: [
            { label: 'Active Campaigns', to: '/donate' },
            { label: 'Report an Animal', to: '/report' },
          ],
        },
        {
          heading: 'Transparency',
          items: [
            { label: 'How Funds Are Used', to: '/donate' },
            { label: 'Approved Expense Ledger', to: '/donate' },
            { label: 'Community Impact', to: '/#impact' },
          ],
        },
      ],
      featured: {
        eyebrow: 'Transparent Funding',
        title: 'Every rupee, tracked.',
        desc: 'See approved expenses for every open campaign.',
        to: '/donate',
        cta: 'View Campaigns',
      },
    },
  },
  {
    label: 'Adopt',
    to: '/adopt',
    menu: {
      columns: [
        {
          heading: 'Explore',
          items: [
            { label: 'Browse Animals', to: '/adopt' },
            { label: 'Adoption Requirements', to: '/adopt' },
          ],
        },
        {
          heading: 'Support Network',
          items: [
            { label: 'Shelters & Organizations', to: '/organizations' },
            { label: 'Foster Network', to: '/foster' },
            { label: 'Volunteer Network', to: '/volunteer' },
          ],
        },
      ],
      featured: {
        eyebrow: 'Adoption',
        title: 'Meet your new best friend.',
        desc: 'Every profile includes a full recovery story.',
        to: '/adopt',
        cta: 'Browse Animals',
      },
    },
  },
  {
    label: 'Volunteer',
    to: '/volunteer',
    menu: {
      columns: [
        {
          heading: 'Get Involved',
          items: [
            { label: 'Become a Volunteer', to: '/volunteer' },
            { label: 'My Dashboard', to: '/dashboard' },
          ],
        },
        {
          heading: 'Network',
          items: [
            { label: 'Veterinary Network', to: '/vets' },
            { label: 'Partner Organizations', to: '/organizations' },
            { label: 'Safety Guidelines', to: '/privacy' },
          ],
        },
      ],
      featured: {
        eyebrow: 'Volunteers',
        title: "You're never sent in alone.",
        desc: 'Request professional assistance on any case, any time.',
        to: '/volunteer',
        cta: 'Join the Network',
      },
    },
  },
];

function MegaPanel({ menu, onNavigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-0 right-0 mt-3 origin-top"
    >
      <div className="glass-surface rounded-3xl shadow-card border-charcoal-100 overflow-hidden">
        <div className="grid md:grid-cols-[1fr,1fr,0.8fr] gap-8 p-8">
          {menu.columns.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal-400 mb-4">
                {col.heading}
              </p>
              <ul className="space-y-3">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      onClick={onNavigate}
                      className="text-[15px] font-medium text-charcoal-800 hover:text-coral-600 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {menu.featured && (
            <Link
              to={menu.featured.to}
              onClick={onNavigate}
              className="group rounded-2xl bg-gradient-to-br from-sage-600 to-charcoal-800 p-6 flex flex-col justify-between min-h-[180px] hover:from-sage-500 transition-colors"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-coral-300 mb-2">
                  {menu.featured.eyebrow}
                </p>
                <p className="font-display font-bold text-cream-50 text-lg leading-snug">{menu.featured.title}</p>
                <p className="text-sm text-cream-200/80 mt-2">{menu.featured.desc}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-cream-50 mt-4">
                {menu.featured.cta}
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [openMobileSection, setOpenMobileSection] = useState(null);
  const closeTimer = useRef(null);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setActiveMenu(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const openMenu = (index) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(index);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveMenu(null), 140);
  };

  const handleAnchorNav = (e, to) => {
    if (to.startsWith('/#')) {
      e.preventDefault();
      setActiveMenu(null);
      const id = to.slice(2);
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 flex justify-center pt-3 md:pt-5 px-4">
        <div className="relative w-full max-w-6xl" onMouseLeave={scheduleClose}>
          <motion.nav
            initial={false}
            animate={{
              width: scrolled ? 'min(920px, 96%)' : '100%',
              paddingTop: scrolled ? 8 : 14,
              paddingBottom: scrolled ? 8 : 14,
            }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={`relative z-10 mx-auto flex items-center justify-between px-5 md:px-7 rounded-full transition-colors duration-500 ${
              scrolled || activeMenu !== null
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
              {NAV_LINKS.map((link, index) => (
                <li key={link.to} onMouseEnter={() => openMenu(index)}>
                  <NavLink
                    to={link.to}
                    onFocus={() => openMenu(index)}
                    onClick={(e) => handleAnchorNav(e, link.to)}
                    className={({ isActive }) =>
                      `relative flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                        isActive || activeMenu === index ? 'text-charcoal-900' : 'text-charcoal-500 hover:text-charcoal-900'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.label}
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-200 ${activeMenu === index ? 'rotate-180' : ''}`}
                        />
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

          <div onMouseEnter={() => activeMenu !== null && openMenu(activeMenu)}>
            <AnimatePresence>
              {activeMenu !== null && (
                <MegaPanel menu={NAV_LINKS[activeMenu].menu} onNavigate={() => setActiveMenu(null)} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-cream-50 md:hidden overflow-y-auto"
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
              {NAV_LINKS.map((link, index) => (
                <motion.li
                  key={link.to}
                  variants={{
                    closed: { opacity: 0, y: 16 },
                    open: { opacity: 1, y: 0 },
                  }}
                  className="border-b border-charcoal-100"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      to={link.to}
                      onClick={(e) => handleAnchorNav(e, link.to)}
                      className="block py-4 text-display-sm font-display font-semibold text-charcoal-900"
                    >
                      {link.label}
                    </Link>
                    <button
                      onClick={() => setOpenMobileSection((s) => (s === index ? null : index))}
                      className="flex h-9 w-9 items-center justify-center text-charcoal-400"
                      aria-label={`Toggle ${link.label} links`}
                      aria-expanded={openMobileSection === index}
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${openMobileSection === index ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                  <AnimatePresence>
                    {openMobileSection === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 pl-1 space-y-3">
                          {link.menu.columns.flatMap((c) => c.items).map((item) => (
                            <Link
                              key={item.label}
                              to={item.to}
                              onClick={(e) => handleAnchorNav(e, item.to)}
                              className="block text-sm text-charcoal-500"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </motion.ul>

            <div className="px-6 mt-10 flex flex-col gap-3 pb-10">
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
