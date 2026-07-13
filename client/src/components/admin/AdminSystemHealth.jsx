import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Server, Database, Wifi, Cloud, Cpu, HardDrive, Activity, CheckCircle } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const statusColors = {
  operational: { dot: 'bg-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  degraded: { dot: 'bg-amber-400', text: 'text-amber-400', bg: 'bg-amber-500/10' },
  down: { dot: 'bg-red-400', text: 'text-red-400', bg: 'bg-red-500/10' },
};

const iconMap = { Server, Database, Wifi, Cloud, Cpu, HardDrive };

export default function AdminSystemHealth() {
  const [services, setServices] = useState([
    { name: 'API Server', status: 'operational', icon: 'Server', uptime: '—' },
    { name: 'Database', status: 'operational', icon: 'Database', uptime: '—' },
  ]);

  useEffect(() => {
    axiosClient.get('/health')
      .then(() => {
        setServices((prev) => prev.map((s) => ({ ...s, status: 'operational', uptime: 'Healthy' })));
      })
      .catch(() => {
        setServices((prev) => prev.map((s) => ({ ...s, status: 'down', uptime: 'Unreachable' })));
      });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="p-1.5 rounded-lg bg-emerald-500/10">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Health</h2>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
          <CheckCircle className="w-3 h-3" />
          All Systems Operational
        </span>
      </div>

      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {services.map(({ name, status, icon, uptime }, i) => {
          const Icon = iconMap[icon] || Server;
          const sc = statusColors[status] || statusColors.operational;
          return (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i }}
              className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-3 flex items-center gap-3"
            >
              <div className={`p-1.5 rounded-lg ${sc.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${sc.text}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-white truncate">{name}</p>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  <span className={`text-[9px] ${sc.text}`}>{uptime}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
