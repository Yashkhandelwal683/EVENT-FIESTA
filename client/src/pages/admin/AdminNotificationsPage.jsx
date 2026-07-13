import { Bell } from 'lucide-react';

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Notifications</h1>
        <p className="page-subtitle">Manage system notifications</p>
      </div>
      <div className="glass p-12 text-center">
        <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400">No notifications yet.</p>
      </div>
    </div>
  );
}
