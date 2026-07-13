import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectCurrentUser } from '../features/auth/authSlice';
import { useGetNotificationsQuery } from '../features/notifications/notificationsApi';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon, TicketIcon, CalendarDaysIcon, HeartIcon,
  UserIcon, ArrowRightOnRectangleIcon,
  Bars3Icon, XMarkIcon, BellIcon, SparklesIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/dashboard/bookings', label: 'My Bookings', icon: TicketIcon },
  { path: '/events', label: 'Browse Events', icon: CalendarDaysIcon, accent: true },
  { path: '/dashboard/wishlist', label: 'Wishlist', icon: HeartIcon },
  { path: '/dashboard/tickets', label: 'My Tickets', icon: TicketIcon },
  { path: '/profile', label: 'Profile', icon: UserIcon },
];

export default function AttendeeLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const { data: notifData } = useGetNotificationsQuery({ limit: 1 }, { skip: false });
  const unreadCount = notifData?.unreadCount || notifData?.data?.unreadCount || 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px]
        bg-surface-card/80 backdrop-blur-2xl border-r border-surface-border
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-surface-border">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-base tracking-tight">Event Fiesta</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-slate-400">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="px-3 py-4 border-b border-surface-border">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-primary-500/20 shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'User'}</p>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary-500/10 text-primary-400 font-semibold">
                Attendee
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.15em] px-3 mb-2">Navigation</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group relative ${
                  item.accent
                    ? isActive
                      ? 'bg-gradient-to-r from-primary-600/20 to-violet-600/20 text-white border border-primary-500/20'
                      : 'text-primary-400/80 hover:bg-primary-500/10 border border-transparent hover:border-primary-500/10'
                    : isActive
                    ? 'bg-white/[0.06] text-white border border-white/[0.06]'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <item.icon className={`w-[18px] h-[18px] shrink-0 ${item.accent ? 'text-primary-400' : ''}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-surface-border px-3 py-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <ArrowRightOnRectangleIcon className="w-[18px] h-[18px]" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-surface/80 backdrop-blur-2xl border-b border-surface-border">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-slate-400">
                <Bars3Icon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <button
                onClick={() => navigate('/dashboard')}
                className="relative p-2.5 rounded-xl hover:bg-white/5 text-slate-500 hover:text-slate-200 transition-all"
              >
                <BellIcon className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 px-1">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Profile */}
              <div className="flex items-center gap-2.5 pl-3 border-l border-white/[0.06] ml-1">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-primary-500/20">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-slate-200">{user?.name || 'User'}</p>
                  <p className="text-[10px] text-slate-500">Attendee</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
