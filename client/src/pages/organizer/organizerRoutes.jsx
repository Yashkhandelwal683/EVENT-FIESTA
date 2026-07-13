import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import OrganizerLayout from './OrganizerLayout';

const OrganizerDashboard = lazy(() => import('./OrganizerDashboard'));
const MyEvents = lazy(() => import('./MyEvents'));
const CreateEvent = lazy(() => import('./CreateEventPremium'));
const EditEvent = lazy(() => import('./EditEvent'));
const EventManage = lazy(() => import('./EventWorkspace'));
const AttendeeManagement = lazy(() => import('./AttendeeManagement'));
const QRManagement = lazy(() => import('./QRManagement'));
const AnalyticsPage = lazy(() => import('./AnalyticsPage'));
const RevenuePage = lazy(() => import('./RevenuePage'));
const ReportsPage = lazy(() => import('./ReportsPage'));
const NotificationsPage = lazy(() => import('./NotificationsPage'));
const SettingsPage = lazy(() => import('./SettingsPage'));
const CalendarPage = lazy(() => import('./CalendarPage'));
const ProfilePage = lazy(() => import('./ProfilePage'));
const QRScannerPage = lazy(() => import('./QRScannerPage'));
const TicketManagement = lazy(() => import('./TicketManagement'));
const ScanTicket = lazy(() => import('./ScanTicket'));
const TeamManagement = lazy(() => import('./TeamManagement'));

const Placeholder = ({ emoji, title, desc }) => (
  <div className="text-zinc-400 text-center py-20">
    <span className="text-4xl block mb-4">{emoji}</span>
    <p className="text-zinc-400 mb-2">{title}</p>
    <p className="text-xs text-zinc-600">{desc}</p>
  </div>
);

export default function OrganizerRoutes() {
  return (
    <Routes>
      <Route element={<OrganizerLayout />}>
      <Route index element={<OrganizerDashboard />} />
      <Route path="dashboard" element={<OrganizerDashboard />} />
      <Route path="events" element={<MyEvents />} />
      <Route path="events/:eventId/manage" element={<EventManage />} />
      <Route path="events/:eventId/edit" element={<EditEvent />} />
      <Route path="events/:eventId/sub-events" element={<Placeholder emoji="📋" title="Sub Events" desc="Manage sub-events with separate attendees, tickets, and analytics" />} />
      <Route path="events/:eventId/tickets" element={<Placeholder emoji="🎫" title="Ticket Management" desc="Manage ticket types, pricing, and inventory" />} />
      <Route path="create-event" element={<CreateEvent />} />
      <Route path="attendees" element={<AttendeeManagement />} />
      <Route path="tickets" element={<TicketManagement />} />
      <Route path="scan-ticket" element={<ScanTicket />} />
      <Route path="qr" element={<QRManagement />} />
      <Route path="scanner" element={<QRScannerPage />} />
      <Route path="team" element={<TeamManagement />} />
      <Route path="team/:eventId" element={<TeamManagement />} />
      <Route path="analytics" element={<AnalyticsPage />} />
      <Route path="calendar" element={<CalendarPage />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="profile" element={<ProfilePage />} />
    </Route>
    </Routes>
  );
}
