import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Squares2X2Icon,
  CalendarDaysIcon,
  PlusCircleIcon,
  QrCodeIcon,
  UsersIcon,
  TicketIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  StarIcon,
  BellIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const organizerLinks = [
  { to: '/dashboard',            icon: Squares2X2Icon,       label: 'Overview' },
  { to: '/dashboard/events',     icon: CalendarDaysIcon,     label: 'Events' },
  { to: '/dashboard/sub-events', icon: PlusCircleIcon,       label: 'Sub Events' },
  { to: '/dashboard/attendees',  icon: UsersIcon,            label: 'Attendees' },
  { to: '/dashboard/tickets',    icon: TicketIcon,           label: 'Tickets' },
  { to: '/dashboard/payments',   icon: CurrencyDollarIcon,   label: 'Payments' },
  { to: '/dashboard/analytics',  icon: ChartBarIcon,         label: 'Analytics' },
  { to: '/dashboard/reviews',    icon: StarIcon,             label: 'Reviews' },
  { to: '/dashboard/notifications', icon: BellIcon,          label: 'Notifications' },
  { to: '/dashboard/messages',   icon: EnvelopeIcon,         label: 'Messages' },
  { to: '/dashboard/settings',   icon: Cog6ToothIcon,        label: 'Settings' },
  { to: '/profile',              icon: UserCircleIcon,       label: 'Profile' },
];

export default function Sidebar({ onClose }) {
  const { user, isAdmin, logout } = useAuth();

  return (
    <aside className="flex flex-col h-full w-64 bg-surface-card border-r border-surface-border">
      <div className="flex items-center justify-between p-5 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">EV</span>
          </div>
          <span className="font-display font-bold gradient-text text-base">Dashboard</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5 text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 scrollbar-thin">
        {organizerLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-600/20 text-primary-300 shadow-glow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className="border-t border-surface-border my-2" />
            <NavLink
              to="/admin"
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-primary-600/20 text-primary-300 shadow-glow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <ShieldCheckIcon className="w-4.5 h-4.5 flex-shrink-0" />
              <span>Admin Panel</span>
            </NavLink>
          </>
        )}

        <div className="border-t border-surface-border my-2" />
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all w-full"
        >
          <ArrowRightOnRectangleIcon className="w-4.5 h-4.5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </nav>

      {/* User info at bottom */}
      <div className="p-4 border-t border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ShieldCheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
