import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useGetDashboardQuery } from '../../features/organizer/organizerApi';
import PremiumSidebar from '../../components/dashboard/PremiumSidebar';
import TopNavbar from '../../components/dashboard/TopNavbar';

export default function OrganizerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isCreateEventPage = location.pathname === '/organizer/create-event';
  const { data } = useGetDashboardQuery();
  const unreadCount = data?.data?.counts?.unreadNotifications || 0;

  const handleLogout = async () => { await logout(); navigate('/'); };

  return (
    <div className="flex h-screen bg-[#07070d] text-white overflow-hidden">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`hidden lg:block`}>
        <PremiumSidebar collapsed={collapsed} setCollapsed={setCollapsed} user={user} handleLogout={handleLogout} />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden">
          <PremiumSidebar collapsed={false} setCollapsed={() => setSidebarOpen(false)} user={user} handleLogout={handleLogout} />
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'lg:ml-[68px]' : 'lg:ml-[240px]'}`}>
        <TopNavbar
          user={user}
          unreadCount={unreadCount}
          onMenuClick={() => setSidebarOpen(true)}
          isCreateEventPage={isCreateEventPage}
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
