import { useGetRevenueChartQuery, useGetTicketSalesQuery, useGetCategoryDistributionQuery, useGetTopEventsQuery } from '../../features/analytics/analyticsApi';
import { ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

export default function AnalyticsPage() {
  const { data: revenueChart } = useGetRevenueChartQuery(12);
  const { data: ticketSales } = useGetTicketSalesQuery(6);
  const { data: categories } = useGetCategoryDistributionQuery();
  const { data: topEvents } = useGetTopEventsQuery();

  const revData = revenueChart?.data || [];
  const ticketData = ticketSales?.data || [];
  const catData = categories?.data || [];
  const top = topEvents?.data || [];

  const maxRev = Math.max(...revData.map(d => d.revenue || 0), 1);
  const maxTickets = Math.max(...ticketData.map(d => d.tickets || 0), 1);
  const maxCat = Math.max(...catData.map(d => d.count || 0), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Detailed insights into your event performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="glass p-5 border-surface-border/60">
          <div className="flex items-center gap-2 mb-4">
            <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-400" />
            <h2 className="font-display font-semibold text-white text-sm">Revenue (12 Months)</h2>
          </div>
          <div className="flex items-end gap-2 h-40">
            {revData.length === 0 ? (
              <p className="text-slate-500 text-sm self-center w-full text-center">No data yet</p>
            ) : (
              revData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t"
                    style={{ height: `${(d.revenue / maxRev) * 100}%`, minHeight: 4 }}
                  />
                  <span className="text-[10px] text-slate-500 truncate w-full text-center">
                    {d._id?.month ? `${['','J','F','M','A','M','J','J','A','S','O','N','D'][d._id.month]}` : ''}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ticket Sales Chart */}
        <div className="glass p-5 border-surface-border/60">
          <div className="flex items-center gap-2 mb-4">
            <ChartBarIcon className="w-4 h-4 text-primary-400" />
            <h2 className="font-display font-semibold text-white text-sm">Ticket Sales (6 Months)</h2>
          </div>
          <div className="flex items-end gap-2 h-40">
            {ticketData.length === 0 ? (
              <p className="text-slate-500 text-sm self-center w-full text-center">No data yet</p>
            ) : (
              ticketData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t"
                    style={{ height: `${(d.tickets / maxTickets) * 100}%`, minHeight: 4 }}
                  />
                  <span className="text-[10px] text-slate-500">{['','J','F','M','A','M','J','J','A','S','O','N','D'][d._id?.month] || ''}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="glass p-5 border-surface-border/60">
          <h2 className="font-display font-semibold text-white text-sm mb-4">Category Distribution</h2>
          {catData.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No categories yet</p>
          ) : (
            <div className="space-y-3">
              {catData.map((cat) => (
                <div key={cat._id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-300 capitalize">{cat._id}</span>
                    <span className="text-slate-400">{cat.count} events · {cat.soldTickets || 0} tickets</span>
                  </div>
                  <div className="h-2 bg-surface-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-violet-500 rounded-full"
                      style={{ width: `${(cat.count / maxCat) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Events */}
        <div className="glass p-5 border-surface-border/60">
          <h2 className="font-display font-semibold text-white text-sm mb-4">Top Events</h2>
          {top.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No events yet</p>
          ) : (
            <div className="space-y-3">
              {top.slice(0, 6).map((event) => (
                <div key={event._id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{event.title}</p>
                    <p className="text-xs text-slate-500">{event.ticketCount || 0} tickets</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary-300">{event.soldCount || 0}/{event.totalCapacity || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
