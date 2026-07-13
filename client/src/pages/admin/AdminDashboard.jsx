import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { motion } from 'framer-motion';
import AdminWelcomeHero from '../../components/admin/AdminWelcomeHero';
import AdminKPICard from '../../components/admin/AdminKPICard';
import AdminApprovalCenter from '../../components/admin/AdminApprovalCenter';
import AdminActivityFeed from '../../components/admin/AdminActivityFeed';
import AdminRevenueChart from '../../components/admin/AdminRevenueChart';
import AdminSystemHealth from '../../components/admin/AdminSystemHealth';
import AdminRightPanel from '../../components/admin/AdminRightPanel';
import Spinner from '../../components/ui/Spinner';
import {
  Users, UserCheck, Calendar, Ticket, DollarSign, TrendingUp,
  Clock, Zap,
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      axiosClient.get('/api/admin/stats'),
      axiosClient.get('/api/admin/organizer-approvals'),
    ]).then(([statsRes, approvalsRes]) => {
      if (statsRes.status === 'fulfilled') setStats(statsRes.value?.data?.data ?? statsRes.value?.data);
      if (approvalsRes.status === 'fulfilled') {
        const d = approvalsRes.value?.data;
        setApprovals(d?.data || d?.organizers || d || []);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  const kpis = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'blue', prefix: '' },
    { label: 'Total Events', value: stats?.totalEvents || 0, icon: Calendar, color: 'violet', prefix: '' },
    { label: 'Live Events', value: stats?.liveEvents || 0, icon: Zap, color: 'emerald', prefix: '' },
    { label: 'Total Revenue', value: stats?.totalRevenue || 0, icon: DollarSign, color: 'amber', prefix: '₹' },
    { label: 'Registrations', value: stats?.totalRegistrations || 0, icon: Ticket, color: 'cyan', prefix: '' },
    { label: 'Pending Approvals', value: stats?.pendingOrganizerRequests || 0, icon: Clock, color: 'rose', prefix: '' },
  ];

  const kpiColorMap = {
    blue: { iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400', glow: 'from-blue-500/20' },
    violet: { iconBg: 'bg-violet-500/10', iconColor: 'text-violet-400', glow: 'from-violet-500/20' },
    emerald: { iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400', glow: 'from-emerald-500/20' },
    amber: { iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400', glow: 'from-amber-500/20' },
    cyan: { iconBg: 'bg-cyan-500/10', iconColor: 'text-cyan-400', glow: 'from-cyan-500/20' },
    rose: { iconBg: 'bg-rose-500/10', iconColor: 'text-rose-400', glow: 'from-rose-500/20' },
  };

  return (
    <div className="space-y-6 pb-10">
      <AdminWelcomeHero stats={stats} />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi, i) => (
          <AdminKPICard key={kpi.label} {...kpi} colors={kpiColorMap[kpi.color]} delay={i * 0.05} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <AdminRevenueChart stats={stats} />
          <AdminApprovalCenter approvals={approvals} isLoading={loading} />
          <AdminSystemHealth />
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <AdminActivityFeed activities={[]} />
          <AdminRightPanel stats={stats} />
        </div>
      </div>
    </div>
  );
}
