import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuth, selectUserRole } from './features/auth/authSlice';
import { useSessionRestore } from './hooks/useSessionRestore';
import { useSocket } from './hooks/useSocket';

import MainLayout       from './layouts/MainLayout';
import AttendeeLayout   from './layouts/AttendeeLayout';
import OrganizerRoutes  from './pages/organizer/organizerRoutes';
import EventWorkspace   from './pages/organizer/EventWorkspace';
import AdminLayout      from './layouts/AdminLayout';

import ProtectedRoute   from './components/layout/ProtectedRoute';
import RoleRoute        from './components/layout/RoleRoute';

import Home             from './pages/Home';
import Events           from './pages/Events';
import EventDetail      from './pages/EventDetailPremium';
import Checkout         from './pages/Checkout';
import PaymentPage      from './pages/PaymentPage';
import PaymentSuccess   from './pages/PaymentSuccess';
import Profile          from './pages/profile/Profile';
import MyTickets        from './pages/attendee/MyTickets';
import MyBookings       from './pages/attendee/MyBookings';
import Wishlist         from './pages/attendee/Wishlist';

import Login           from './pages/auth/Login';
import Register        from './pages/auth/Register';
import AuthCallback    from './pages/auth/AuthCallback';
import PendingApproval from './pages/auth/PendingApproval';

import AdminDashboard   from './pages/admin/AdminDashboard';
import ManageUsers      from './pages/admin/ManageUsers';
import ManageEvents     from './pages/admin/ManageEvents';
import CancellationRequests from './pages/admin/CancellationRequests';
import AdminOrganizerApprovals from './pages/admin/AdminOrganizerApprovals';
import AdminAttendees   from './pages/admin/AdminAttendees';
import AdminBookings    from './pages/admin/AdminBookings';
import AdminRevenue     from './pages/admin/AdminRevenue';
import AdminAnalytics   from './pages/admin/AdminAnalytics';
import AdminReports     from './pages/admin/AdminReports';
import AdminSettings    from './pages/admin/AdminSettings';
import TicketRequests   from './pages/admin/TicketRequests';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';

import AttendeeDashboard from './pages/attendee/AttendeeDashboard';

const roleDashboard = {
  attendee: '/dashboard',
  organizer: '/organizer/dashboard',
  admin: '/admin',
};

function AuthGate({ children }) {
  const isAuth = useSelector(selectIsAuth);
  const role = useSelector(selectUserRole);
  if (isAuth) return <Navigate to={roleDashboard[role] || '/dashboard'} replace />;
  return children;
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#0a0a0f]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-zinc-500">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  useSessionRestore();
  useSocket();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* ── Public Routes (unauthenticated) ──────────────── */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<AuthGate><Home /></AuthGate>} />
          <Route path="/login" element={<AuthGate><Login /></AuthGate>} />
          <Route path="/register" element={<AuthGate><Register /></AuthGate>} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
        </Route>

        {/* ── Protected Attendee Routes ─────────────────────── */}
        <Route
          path="/dashboard"
          element={<RoleRoute roles={['attendee']}><AttendeeLayout /></RoleRoute>}
        >
          <Route index element={<AttendeeDashboard />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="tickets" element={<MyTickets />} />
        </Route>

        <Route path="/checkout/:eventId" element={<ProtectedRoute><MainLayout /><Checkout /></ProtectedRoute>} />
        <Route path="/payment/:eventId" element={<ProtectedRoute><MainLayout /><PaymentPage /></ProtectedRoute>} />
        <Route path="/payment-success" element={<ProtectedRoute><MainLayout /><PaymentSuccess /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><AttendeeLayout /></ProtectedRoute>}>
          <Route index element={<Profile />} />
        </Route>

        {/* ── Organizer Routes (under /organizer) ──────────── */}
        <Route
          path="/organizer/events/:eventId/manage"
          element={<RoleRoute roles={['organizer', 'admin']}><EventWorkspace /></RoleRoute>}
        />
        <Route
          path="/organizer/*"
          element={<RoleRoute roles={['organizer', 'admin']}><OrganizerRoutes /></RoleRoute>}
        />

        {/* ── Admin Routes ───────────────────────────────────── */}
        <Route element={<RoleRoute roles={['admin']}><AdminLayout /></RoleRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/attendees" element={<AdminAttendees />} />
          <Route path="/admin/events" element={<ManageEvents />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/ticket-requests" element={<TicketRequests />} />
          <Route path="/admin/cancellations" element={<CancellationRequests />} />
          <Route path="/admin/organizer-approvals" element={<AdminOrganizerApprovals />} />
          <Route path="/admin/revenue" element={<AdminRevenue />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
        </Route>

        {/* ── 404 ──────────────────────────────────────────── */}
        <Route path="*" element={
          <div className="flex items-center justify-center h-screen bg-[#0a0a0f] text-center p-4">
            <div>
              <h1 className="text-6xl font-bold text-white font-display mb-2">404</h1>
              <p className="text-zinc-400 mb-6">Page not found</p>
              <a href="/" className="inline-flex px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-all">Go Home</a>
            </div>
          </div>
        } />
      </Routes>
    </Suspense>
  );
}
