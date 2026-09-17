import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileWarning,
  Stethoscope,
  Users,
  Building2,
  HandCoins,
  Receipt,
  HeartHandshake,
  Home as HomeIcon,
  Gift,
  Flag,
  ShieldCheck,
  BarChart3,
  Settings,
  PawPrint,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ACTIVE_ITEMS = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Rescue Reports', to: '/admin/reports', icon: FileWarning },
  { label: 'Rescue Cases', to: '/admin/cases', icon: HeartHandshake },
  { label: 'Donations', to: '/admin/donations', icon: HandCoins },
];

const ROADMAP_ITEMS = [
  { label: 'Animals', icon: PawPrint },
  { label: 'Volunteers', icon: Users },
  { label: 'Veterinarians', icon: Stethoscope },
  { label: 'Shelters', icon: HomeIcon },
  { label: 'Organizations', icon: Building2 },
  { label: 'Expenses', icon: Receipt },
  { label: 'Adoption', icon: HeartHandshake },
  { label: 'Foster', icon: HomeIcon },
  { label: 'Rewards', icon: Gift },
  { label: 'Community Reports', icon: Flag },
  { label: 'Users', icon: Users },
  { label: 'Audit Logs', icon: ShieldCheck },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex bg-cream-100">
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-charcoal-900 text-cream-200 min-h-screen sticky top-0">
        <Link to="/" className="flex items-center gap-2 px-6 py-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream-50 text-charcoal-900">
            <PawPrint size={15} />
          </span>
          <span className="font-display font-extrabold text-cream-50 text-lg">PAWSYNC</span>
        </Link>

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {ACTIVE_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-coral-500 text-cream-50' : 'text-charcoal-300 hover:bg-charcoal-800 hover:text-cream-50'
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}

          <p className="px-3 pt-6 pb-2 text-[11px] uppercase tracking-wider text-charcoal-500">Coming in Phase 2</p>
          {ROADMAP_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-charcoal-500 cursor-not-allowed"
              title="Planned for a future phase"
            >
              <item.icon size={16} />
              {item.label}
            </div>
          ))}
        </nav>

        <div className="px-6 py-5 border-t border-charcoal-800">
          <p className="text-xs text-charcoal-400">Signed in as</p>
          <p className="text-sm font-semibold text-cream-50 truncate">{user?.name}</p>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
