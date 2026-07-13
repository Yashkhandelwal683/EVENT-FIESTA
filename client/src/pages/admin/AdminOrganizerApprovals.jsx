import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import axiosClient from '../../api/axiosClient';
import { CheckIcon, XMarkIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';

export default function AdminOrganizerApprovals() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get(`/api/approval/organizer-requests?status=${filter}`);
      setRequests(data?.data?.requests || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await axiosClient.patch(`/api/approval/approve-organizer/${id}`);
      toast.success('Organizer approved');
      fetchRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason (optional):');
    setActionLoading(id);
    try {
      await axiosClient.patch(`/api/approval/reject-organizer/${id}`, { reason });
      toast.success('Organizer rejected');
      fetchRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = requests.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.email?.toLowerCase().includes(search.toLowerCase()) ||
    r.organizationName?.toLowerCase().includes(search.toLowerCase())
  );

  const filters = [
    { value: 'pending', label: 'Pending', count: requests.filter(r => r.approvalStatus === 'pending').length },
    { value: 'approved', label: 'Approved', count: requests.filter(r => r.approvalStatus === 'approved').length },
    { value: 'rejected', label: 'Rejected', count: requests.filter(r => r.approvalStatus === 'rejected').length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-white">Organizer Approval Requests</h1>
          <p className="text-sm text-slate-400 mt-0.5">Review and manage organizer applications</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filter === f.value
                ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                : 'text-slate-400 border border-surface-border hover:border-white/10'
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
        <div className="relative ml-auto">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text" placeholder="Search..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-56 bg-white/[0.03] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary-500/40 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FunnelIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-zinc-400 text-sm">No {filter} requests found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req, i) => (
            <motion.div
              key={req._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass p-4 rounded-xl flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-white">{req.name?.charAt(0) || 'O'}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{req.name}</p>
                  <p className="text-xs text-slate-400 truncate">{req.email}</p>
                  {req.organizationName && (
                    <p className="text-[10px] text-slate-500 mt-0.5">{req.organizationName} · {req.city || '—'}</p>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-slate-400">
                  {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                {req.approvalStatus === 'pending' && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleApprove(req._id)}
                      disabled={actionLoading === req._id}
                      className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                    >
                      {actionLoading === req._id ? <Spinner small /> : <CheckIcon className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      disabled={actionLoading === req._id}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {req.approvalStatus === 'approved' && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">Approved</span>
                )}
                {req.approvalStatus === 'rejected' && (
                  <div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">Rejected</span>
                    {req.rejectedReason && <p className="text-[10px] text-red-400/70 mt-0.5 max-w-[200px] truncate">{req.rejectedReason}</p>}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
