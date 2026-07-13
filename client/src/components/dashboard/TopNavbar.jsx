import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Plus, Moon, Sun, Menu, X, Zap } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

const navLinks = [
  { to: '/organizer/dashboard', label: 'Dashboard' },
  { to: '/organizer/events', label: 'Events' },
  { to: '/organizer/create-event', label: 'Create' },
  { to: '/organizer/revenue', label: 'Revenue' },
  { to: '/organizer/analytics', label: 'Analytics' },
  { to: '/organizer/calendar', label: 'Calendar' },
  { to: '/organizer/notifications', label: 'Notifications' },
  { to: '/organizer/reports', label: 'Reports' },
  { to: '/organizer/settings', label: 'Settings' },
  { to: '/organizer/profile', label: 'Profile' },
];

export default function TopNavbar({ user, unreadCount = 0, onMenuClick, isCreateEventPage }) {
  const navigate = useNavigate();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

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
              className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-500 text-sm hover:text-slate-300 hover:border-violet-500/30 hover:bg-white/[0.04] transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Quick search...</span>
              <kbd className="text-[10px] text-slate-600 bg-white/[0.04] px-1.5 py-0.5 rounded ml-4 font-mono">⌘K</kbd>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!isCreateEventPage && (
              <button
                onClick={() => navigate('/organizer/create-event')}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Plus className="w-4 h-4" />
                Create Event
              </button>
            )}

            <button className="relative p-2.5 rounded-xl hover:bg-white/5 text-slate-500 hover:text-slate-200 transition-all">
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
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-violet-500/20">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="hidden md:block text-sm font-semibold text-slate-200">{user?.name || 'Organizer'}</span>
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
                  placeholder="Search pages, events..."
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
