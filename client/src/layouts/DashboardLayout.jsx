import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import { useGetNotificationsQuery } from '../features/notifications/notificationsApi';
import { useAuth } from '../hooks/useAuth';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuth } = useAuth();
  const { data: notifData } = useGetNotificationsQuery({ limit: 1, unread: true }, { skip: !isAuth });
  const unreadCount = notifData?.unreadCount || 0;

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Top Navbar for Dashboard */}
      <header className="fixed top-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-2xl border-b border-surface-border/60">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-slate-400"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-glow-sm">
                <span className="text-xs font-bold text-white">EV</span>
              </div>
              <span className="font-display font-bold text-lg gradient-text hidden sm:inline">Event Fiesta</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors">
              <BellIcon className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* Desktop sidebar */}
        <div className="hidden lg:block sticky top-16 h-[calc(100vh-4rem)]">
          <Sidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-64">
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        <main className="flex-1 overflow-auto">
          <div className="container-app py-6 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
