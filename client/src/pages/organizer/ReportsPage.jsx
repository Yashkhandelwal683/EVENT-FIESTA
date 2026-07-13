import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon, ArrowDownTrayIcon, DocumentArrowDownIcon,
  TableCellsIcon, ClockIcon, CurrencyDollarIcon, TicketIcon,
  UsersIcon, CheckCircleIcon,
} from '@heroicons/react/24/outline';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const reportTypes = [
  { id: 'attendance', label: 'Attendance Report', icon: UsersIcon, desc: 'Track check-in and check-out data across all events' },
  { id: 'revenue', label: 'Revenue Report', icon: CurrencyDollarIcon, desc: 'Detailed revenue breakdown and financial summaries' },
  { id: 'tickets', label: 'Ticket Report', icon: TicketIcon, desc: 'Ticket sales data with tier-wise distribution' },
  { id: 'checkin', label: 'Check-In Report', icon: CheckCircleIcon, desc: 'Real-time and historical check-in analysis' },
  { id: 'checkout', label: 'Check-Out Report', icon: ClockIcon, desc: 'Exit tracking and dwell time analysis' },
  { id: 'performance', label: 'Event Performance', icon: DocumentTextIcon, desc: 'Comprehensive event performance metrics' },
];

export default function ReportsPage() {
  const [selected, setSelected] = useState(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Reports</h1>
        <p className="text-zinc-400 text-sm mt-1">Generate and download detailed reports for your events</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report) => (
          <motion.div
            key={report.id}
            variants={item}
            onClick={() => setSelected(report.id)}
            className={`rounded-2xl border p-5 cursor-pointer transition-all duration-200 ${
              selected === report.id ? 'border-violet-500/40 bg-violet-500/5' : 'border-white/[0.04] bg-white/[0.02] hover:border-violet-500/20 hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-violet-500/10 flex-shrink-0">
                <report.icon className="w-5 h-5 text-violet-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{report.label}</h3>
                <p className="text-xs text-zinc-500 mt-1">{report.desc}</p>
              </div>
            </div>
            {selected === report.id && (
              <div className="mt-4 pt-4 border-t border-white/[0.04]">
                <p className="text-xs text-zinc-500 mb-3">Download as:</p>
                <div className="flex items-center gap-2">
                  <button onClick={handleGenerate} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-all shadow-lg shadow-violet-600/20">
                    <DocumentArrowDownIcon className="w-3.5 h-3.5" /> PDF
                  </button>
                  <button onClick={handleGenerate} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-200 text-xs font-medium hover:bg-white/[0.06] transition-all">
                    <TableCellsIcon className="w-3.5 h-3.5" /> Excel
                  </button>
                  <button onClick={handleGenerate} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-200 text-xs font-medium hover:bg-white/[0.06] transition-all">
                    <ArrowDownTrayIcon className="w-3.5 h-3.5" /> CSV
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {generating && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-emerald-300 font-medium">Generating your report...</p>
          </div>
        </motion.div>
      )}

      {/* Recent Reports */}
      <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Recent Reports</h3>
        <p className="text-zinc-500 text-xs text-center py-8">No reports generated yet. Select a report type above to get started.</p>
      </motion.div>
    </motion.div>
  );
}
