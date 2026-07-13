import { useGetTopEventsQuery, useGetRecentBookingsQuery } from '../../features/analytics/analyticsApi';
import { Link } from 'react-router-dom';
import { CurrencyDollarIcon, ArrowTrendingUpIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

export default function PaymentsPage() {
  const { data: topEvents } = useGetTopEventsQuery();
  const { data: recent } = useGetRecentBookingsQuery();
  const events = topEvents?.data || [];
  const bookings = recent?.bookings || [];

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((s, b) => s + (b.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Payments</h1>
        <p className="text-slate-400 text-sm mt-1">Track revenue and payments across events</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: CurrencyDollarIcon, color: 'text-emerald-400' },
          { label: 'Completed Payments', value: bookings.filter(b => b.status === 'confirmed').length, icon: ArrowTrendingUpIcon, color: 'text-primary-400' },
          { label: 'Pending Payments', value: bookings.filter(b => b.status === 'pending').length, icon: CalendarDaysIcon, color: 'text-amber-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-gradient-to-br from-surface-card to-surface-card/60 border border-surface-border/60 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">{stat.label}</span>
            </div>
            <p className="font-display font-bold text-2xl text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="glass p-5 border-surface-border/60">
        <h2 className="font-display font-semibold text-white text-sm mb-4">Recent Payments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-surface-border">
                <th className="text-left py-3 px-2 font-medium">Booking</th>
                <th className="text-left py-3 px-2 font-medium">Event</th>
                <th className="text-left py-3 px-2 font-medium">User</th>
                <th className="text-right py-3 px-2 font-medium">Amount</th>
                <th className="text-right py-3 px-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/40">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-2 font-mono text-xs text-slate-400">{b.bookingRef || '—'}</td>
                  <td className="py-3 px-2 text-white truncate max-w-[150px]">{b.event?.title || '—'}</td>
                  <td className="py-3 px-2 text-slate-300">{b.user?.name || '—'}</td>
                  <td className="py-3 px-2 text-right text-primary-300 font-semibold">₹{b.totalAmount || 0}</td>
                  <td className="py-3 px-2 text-right">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      b.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300' :
                      b.status === 'pending' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
