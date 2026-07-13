import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Calendar, PlusCircle, Ticket, Users, QrCode,
  DollarSign, BarChart3, FileText, CalendarDays, Bell, Settings,
  User, ScanLine, ChevronLeft, ChevronRight, LogOut, Star, Zap, UserCog
} from 'lucide-react';

const mainLinks = [
  { to: '/organizer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/organizer/events', icon: Calendar, label: 'My Events' },
  { to: '/organizer/create-event', icon: PlusCircle, label: 'Create Event', featured: true },
  { to: '/organizer/tickets', icon: Ticket, label: 'Tickets' },
  { to: '/organizer/attendees', icon: Users, label: 'Attendees' },
  { to: '/organizer/scan-ticket', icon: ScanLine, label: 'Scan Ticket' },
  { to: '/organizer/team', icon: UserCog, label: 'Team' },
];

const secondaryLinks = [
  { to: '/organizer/revenue', icon: DollarSign, label: 'Revenue' },
  { to: '/organizer/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/organizer/calendar', icon: CalendarDays, label: 'Calendar' },
  { to: '/organizer/notifications', icon: Bell, label: 'Notifications' },
  { to: '/organizer/reports', icon: FileText, label: 'Reports' },
  { to: '/organizer/settings', icon: Settings, label: 'Settings' },
  { to: '/organizer/profile', icon: User, label: 'Profile' },
];

export default function PremiumSidebar({ collapsed, setCollapsed, user, handleLogout }) {
  return (
    <aside className={`fixed top-0 left-0 z-50 h-full bg-[#0a0a12]/95 backdrop-blur-2xl border-r border-white/[0.04] transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-[240px]'}`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-white/[0.04] ${collapsed ? 'justify-center px-0' : 'px-5'}`}>
          {collapsed ? (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="flex items-center gap-3 w-full">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-base bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent tracking-tight">Event Fiesta</span>
            </div>
          )}
        </div>

        {/* Profile Card */}
        {!collapsed && (
          <div className="px-3 py-4 border-b border-white/[0.04]">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-violet-500/20 flex-shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Organizer'}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">✓ Verified</span>
                  <span className="text-[9px] text-slate-600">·</span>
                  <span className="text-[9px] text-amber-400 flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-current" /> 4.8</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-white/[0.04]">
          <p className={`text-[9px] font-bold text-slate-700 uppercase tracking-[0.15em] mb-2 ${collapsed ? 'text-center' : 'px-3'}`}>
            {collapsed ? '—' : 'Navigation'}
          </p>
          {mainLinks.map(({ to, icon: Icon, label, featured }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/organizer/dashboard'}
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group relative ${
                  featured
                    ? isActive
                      ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 text-white border border-violet-500/20'
                      : 'text-violet-400 hover:bg-violet-500/10 border border-transparent hover:border-violet-500/10'
                    : isActive
                    ? 'bg-white/[0.06] text-white border border-white/[0.06]'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'
                }`
              }
            >
              <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${featured ? 'text-violet-400' : ''}`} />
              {!collapsed && <span className="truncate">{label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-800 text-xs text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-white/[0.06]">
                  {label}
                </div>
              )}
            </NavLink>
          ))}

          <div className={`my-3 border-t border-white/[0.04] ${collapsed ? 'mx-2' : ''}`} />

          <p className={`text-[9px] font-bold text-slate-700 uppercase tracking-[0.15em] mb-2 ${collapsed ? 'text-center' : 'px-3'}`}>
            {collapsed ? '—' : 'Tools'}
          </p>
          {secondaryLinks.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-white/[0.06] text-white border border-white/[0.06]'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'
                }`
              }
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-800 text-xs text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-white/[0.06]">
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Upgrade Card */}
        {!collapsed && (
          <div className="mx-3 mb-3">
            <div className="rounded-xl bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 border border-violet-500/15 p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">🚀</span>
                <p className="text-[11px] font-bold text-violet-300">Upgrade to Pro</p>
              </div>
              <p className="text-[10px] text-slate-500 mb-2.5">Unlock analytics, custom branding, and priority support.</p>
              <button className="w-full py-1.5 rounded-lg bg-violet-600/20 text-[10px] font-bold text-violet-300 hover:bg-violet-600/30 transition-colors border border-violet-500/20">
                Upgrade
              </button>
            </div>
          </div>
        )}

        {/* Bottom */}
        <div className="border-t border-white/[0.04] px-3 py-3 space-y-1">
          <button
            onClick={handleLogout}
            className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all group relative`}
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
            {collapsed && (
              <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-800 text-xs text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-white/[0.06]">
                Logout
              </div>
            )}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-full px-3 py-2 rounded-xl text-slate-600 hover:text-slate-400 hover:bg-white/[0.03] transition-all"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
