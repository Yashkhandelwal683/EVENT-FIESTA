import { useMemo } from 'react';
import { useGetDashboardQuery } from '../../features/organizer/organizerApi';
import {
  Calendar, Ticket, Users, DollarSign, TrendingUp,
  Star, Eye, CheckCircle, Clock, Zap
} from 'lucide-react';
import WelcomeHero from '../../components/dashboard/WelcomeHero';
import KPICard from '../../components/dashboard/KPICard';
import QuickActions from '../../components/dashboard/QuickActions';
import UpcomingEvents from '../../components/dashboard/UpcomingEvents';
import RevenueChart from '../../components/dashboard/RevenueChart';
import RecentActivity from '../../components/dashboard/RecentActivity';
import LiveEventPanel from '../../components/dashboard/LiveEventPanel';
import RightPanel from '../../components/dashboard/RightPanel';

export default function OrganizerDashboard() {
  const { data, isLoading, isError, error, refetch } = useGetDashboardQuery();
  const d = data?.data;
  const counts = d?.counts || {};
  const revenue = d?.revenue || {};
  const ratings = d?.ratings || {};

  const kpis = useMemo(() => [
    { label: 'Total Events', value: counts.totalEvents, icon: Calendar, color: 'violet' },
    { label: 'Revenue', value: revenue.total, icon: DollarSign, color: 'emerald', prefix: '₹' },
    { label: 'Tickets Sold', value: counts.totalTicketsSold, icon: Ticket, color: 'rose' },
    { label: 'Attendees', value: counts.totalRegistrations, icon: Users, color: 'cyan' },
    { label: 'Live Events', value: counts.liveEvents, icon: Zap, color: 'fuchsia' },
    { label: 'Upcoming', value: counts.upcomingEvents, icon: Clock, color: 'blue' },
    { label: 'Completed', value: counts.completedEvents, icon: CheckCircle, color: 'emerald' },
    { label: 'Avg Rating', value: ratings.average || 0, icon: Star, color: 'amber', suffix: '★', decimals: 1 },
  ], [counts, revenue, ratings]);

  return (
    <div className="space-y-6 pb-10">
      {isError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-red-300">Couldn't load dashboard data</p>
            <p className="text-xs text-red-400/70">{error?.data?.message || 'Something went wrong. Please try again.'}</p>
          </div>
          <button
            onClick={refetch}
            className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-xs font-semibold hover:bg-red-500/30 transition-all"
          >
            Retry
          </button>
        </div>
      )}

      {/* Welcome Hero */}
      <WelcomeHero data={d} isLoading={isLoading} />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => (
          <KPICard key={kpi.label} {...kpi} loading={isLoading} delay={i * 0.05} />
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left — 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <UpcomingEvents events={d?.events || []} isLoading={isLoading} />
          <RevenueChart revenue={revenue} events={d?.events || []} />
          <RecentActivity events={d?.events || []} />
        </div>

        {/* Right — 1 col */}
        <div className="space-y-4">
          <LiveEventPanel counts={counts} isLoading={isLoading} />
          <RightPanel data={d} counts={counts} revenue={revenue} ratings={ratings} />
        </div>
      </div>
    </div>
  );
}
