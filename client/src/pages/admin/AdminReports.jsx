import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { DocumentTextIcon, UsersIcon, CalendarDaysIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const reports = [
  {
    id: 'revenue',
    title: 'Revenue Report',
    description: 'Detailed revenue breakdown and financial summaries',
    icon: DocumentTextIcon,
    format: 'PDF',
    toastMsg: 'Revenue PDF generation coming soon',
  },
  {
    id: 'user',
    title: 'User Report',
    description: 'User registration and activity analytics',
    icon: UsersIcon,
    format: 'CSV',
    toastMsg: 'User CSV export coming soon',
  },
  {
    id: 'events',
    title: 'Events Report',
    description: 'Event performance and attendance metrics',
    icon: CalendarDaysIcon,
    format: 'Excel',
    toastMsg: 'Events Excel export coming soon',
  },
];

export default function AdminReports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get('/api/admin/stats')
      .then(({ data }) => setStats(data?.data ?? data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <motion.div variants={item}>
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">Generate and download platform-wide reports</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-start justify-between mb-2">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Total Reports Generated</span>
            <DocumentTextIcon className="w-4 h-4 text-primary-400" />
          </div>
          <p className="text-xl font-bold text-white font-display tabular-nums">{stats?.totalReports ?? 0}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-start justify-between mb-2">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Available Formats</span>
            <ArrowDownTrayIcon className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-white font-display tabular-nums">3</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <motion.div
            key={report.id}
            variants={item}
            className="glass rounded-2xl p-5 hover:bg-white/[0.04] transition-all duration-200 group"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-primary-500/10 flex-shrink-0 group-hover:bg-primary-500/20 transition-colors">
                <report.icon className="w-5 h-5 text-primary-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{report.title}</h3>
                <p className="text-xs text-zinc-500 mt-1">{report.description}</p>
              </div>
            </div>
            <button
              onClick={() => toast(report.toastMsg)}
              className="btn btn-primary w-full text-xs flex items-center justify-center gap-2"
            >
              <ArrowDownTrayIcon className="w-3.5 h-3.5" />
              Generate {report.format}
            </button>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={item} className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Recent Reports</h3>
        <p className="text-zinc-500 text-xs text-center py-8">
          No reports generated yet. Select a report type above to get started.
        </p>
      </motion.div>
    </motion.div>
  );
}
