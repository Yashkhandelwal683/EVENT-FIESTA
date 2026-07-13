import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Moon, Sun, Menu, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useThemeStore } from '../store/themeStore';
import { useNotificationStore } from '../store/notificationStore';
import { useGetNotificationsQuery } from '../features/notifications/notificationsApi';
import AdminSidebar from '../components/layout/AdminSidebar';

const navLinks = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/organizer-approvals', label: 'Approvals' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/revenue', label: 'Revenue' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/settings', label: 'Settings' },
];

function AdminTopNavbar({ user, onMenuClick }) {
  const navigate = useNavigate();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';
  const { unreadCount } = useNotificationStore();
  const { data: notifData } = useGetNotificationsQuery({ limit: 1 }, { skip: !user });

  useEffect(() => {
    if (notifData?.data?.unreadCount != null) {
      useNotificationStore.getState().setUnreadCount(notifData.data.unreadCount);
    }
  }, [notifData]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(true);
      }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filteredLinks = navLinks.filter(l =>
    l.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-[#07070d]/80 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button onClick={onMenuClick} className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-slate-500">
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCmdOpen(true)}
              className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-500 text-sm hover:text-slate-300 hover:border-blue-500/30 hover:bg-white/[0.04] transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Quick search...</span>
              <kbd className="text-[10px] text-slate-600 bg-white/[0.04] px-1.5 py-0.5 rounded ml-4 font-mono">⌘K</kbd>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/admin/notifications')} className="relative p-2.5 rounded-xl hover:bg-white/5 dark:hover:bg-white/5 text-slate-500 hover:text-slate-200 transition-all">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-white/5 text-slate-500 hover:text-slate-200 transition-all"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5 pl-3 border-l border-white/[0.06] ml-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-500/20">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <span className="hidden md:block text-sm font-semibold text-slate-200">{user?.name || 'Admin'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Command Palette */}
      <AnimatePresence>
        {cmdOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
            onClick={() => setCmdOpen(false)}
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-[#12121a] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
                <Search className="w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search admin pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                  autoFocus
                />
                <button onClick={() => setCmdOpen(false)} className="text-[11px] text-slate-600 bg-white/[0.04] px-2 py-0.5 rounded-md">ESC</button>
              </div>
              <div className="max-h-72 overflow-y-auto p-2">
                {filteredLinks.map((l) => (
                  <button
                    key={l.to}
                    onClick={() => { navigate(l.to); setCmdOpen(false); setSearchQuery(''); }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/[0.04] hover:text-white transition-all"
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/'); };

  return (
    <div className="flex h-screen bg-[#07070d] text-white overflow-hidden">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`hidden lg:block`}>
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} user={user} handleLogout={handleLogout} />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden">
          <AdminSidebar collapsed={false} setCollapsed={() => setSidebarOpen(false)} user={user} handleLogout={handleLogout} />
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'lg:ml-[68px]' : 'lg:ml-[240px]'}`}>
        <AdminTopNavbar
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
