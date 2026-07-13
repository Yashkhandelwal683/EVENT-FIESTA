import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, UserCheck, Calendar, Ticket,
  DollarSign, BarChart3, FileText, Settings, LogOut,
  ChevronLeft, ChevronRight, Shield, Clock, AlertTriangle,
  XCircle, Zap, BadgeCheck, Bell,
} from 'lucide-react';

const mainLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/organizer-approvals', icon: Clock, label: 'Organizer Requests', badge: true },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/attendees', icon: UserCheck, label: 'Attendees' },
  { to: '/admin/events', icon: Calendar, label: 'Events' },
];

const secondaryLinks = [
  { to: '/admin/bookings', icon: Ticket, label: 'Bookings' },
  { to: '/admin/ticket-requests', icon: Ticket, label: 'Ticket Requests' },
  { to: '/admin/cancellations', icon: XCircle, label: 'Cancellations' },
  { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
  { to: '/admin/revenue', icon: DollarSign, label: 'Revenue' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/reports', icon: FileText, label: 'Reports' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminSidebar({ collapsed, setCollapsed, user, handleLogout }) {
  return (
    <aside className={`fixed top-0 left-0 z-50 h-full bg-[#0a0a12]/95 backdrop-blur-2xl border-r border-white/[0.04] transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-[240px]'}`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-white/[0.04] ${collapsed ? 'justify-center px-0' : 'px-5'}`}>
          {collapsed ? (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="flex items-center gap-3 w-full">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-base bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent tracking-tight">Event Fiesta</span>
            </div>
          )}
        </div>

        {/* Profile Card */}
        {!collapsed && (
          <div className="px-3 py-4 border-b border-white/[0.04]">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-500/20 flex-shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Admin'}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold">✓ Admin</span>
                  <span className="text-[9px] text-slate-600">·</span>
                  <span className="text-[9px] text-cyan-400 flex items-center gap-0.5"><BadgeCheck className="w-2.5 h-2.5" /> Super</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-white/[0.04]">
          <p className={`text-[9px] font-bold text-slate-700 uppercase tracking-[0.15em] mb-2 ${collapsed ? 'text-center' : 'px-3'}`}>
            {collapsed ? '—' : 'Management'}
          </p>
          {mainLinks.map(({ to, icon: Icon, label, end, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group relative ${
                  to === '/admin/organizer-approvals'
                    ? isActive
                      ? 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-white border border-amber-500/20'
                      : 'text-amber-400/80 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/10'
                    : isActive
                    ? 'bg-white/[0.06] text-white border border-white/[0.06]'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'
                }`
              }
            >
              <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${to === '/admin/organizer-approvals' ? 'text-amber-400' : ''}`} />
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
            {collapsed ? '—' : 'Analytics & Finance'}
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

        {/* Admin CTA */}
        {!collapsed && (
          <div className="mx-3 mb-3">
            <div className="rounded-xl bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/15 p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">🛡️</span>
                <p className="text-[11px] font-bold text-blue-300">Platform Admin</p>
              </div>
              <p className="text-[10px] text-slate-500 mb-2.5">Full access to all platform features and settings.</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">● Active</span>
              </div>
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
