import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Eye, Shield, Filter, Search } from 'lucide-react';

export default function AdminApprovalCenter({ approvals, isLoading }) {
  approvals = Array.isArray(approvals) ? approvals : [];
  const pending = approvals.filter(a => a.approvalStatus === 'pending');
  const recent = approvals.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Organizer Approvals</h2>
          {pending.length > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {pending.length} pending
            </span>
          )}
        </div>
        <a href="/admin/organizer-approvals" className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors font-semibold">
          View all →
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.04]">
              <th className="text-[10px] font-bold text-slate-600 uppercase tracking-wider text-left px-5 py-3">Organizer</th>
              <th className="text-[10px] font-bold text-slate-600 uppercase tracking-wider text-left px-5 py-3 hidden sm:table-cell">Email</th>
              <th className="text-[10px] font-bold text-slate-600 uppercase tracking-wider text-left px-5 py-3 hidden md:table-cell">Date</th>
              <th className="text-[10px] font-bold text-slate-600 uppercase tracking-wider text-left px-5 py-3">Status</th>
              <th className="text-[10px] font-bold text-slate-600 uppercase tracking-wider text-right px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-5 py-3"><div className="h-3 w-24 rounded bg-white/5" /></td>
                  <td className="px-5 py-3 hidden sm:table-cell"><div className="h-3 w-32 rounded bg-white/5" /></td>
                  <td className="px-5 py-3 hidden md:table-cell"><div className="h-3 w-20 rounded bg-white/5" /></td>
                  <td className="px-5 py-3"><div className="h-5 w-16 rounded-full bg-white/5" /></td>
                  <td className="px-5 py-3"><div className="h-3 w-16 rounded bg-white/5 ml-auto" /></td>
                </tr>
              ))
            ) : recent.length > 0 ? (
              recent.map((org, i) => (
                <motion.tr
                  key={org._id || i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-300 flex-shrink-0">
                        {org.name?.[0]?.toUpperCase() || 'O'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{org.name || 'Unknown'}</p>
                        <p className="text-[10px] text-slate-600 truncate">{org.organization || org.college || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <p className="text-xs text-slate-400 truncate max-w-[180px]">{org.email || ''}</p>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <p className="text-[11px] text-slate-500">
                      {org.createdAt ? new Date(org.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      org.approvalStatus === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : org.approvalStatus === 'rejected'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {org.approvalStatus || 'pending'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a href={`/admin/organizer-approvals`} className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-10">
                  <div className="text-3xl mb-2">📋</div>
                  <p className="text-xs text-slate-500">No approval requests</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
