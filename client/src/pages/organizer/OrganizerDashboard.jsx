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
  const { data, isLoading } = useGetDashboardQuery();
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
