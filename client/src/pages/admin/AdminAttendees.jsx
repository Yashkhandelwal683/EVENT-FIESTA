import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { formatDate } from '../../utils/formatDate';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function AdminAttendees() {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchAttendees = async () => {
    try {
      const { data } = await axiosClient.get('/api/users');
      const raw = data?.data ?? data;
      const users = raw?.users ?? (Array.isArray(raw) ? raw : []);
      setAttendees(users.filter((u) => u.role === 'attendee'));
    } catch {
      toast.error('Failed to load attendees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, []);

  const filtered = attendees.filter(
    (a) =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalAttendees = attendees.length;

  const newThisWeek = attendees.filter((a) => {
    const d = a.createdAt ? new Date(a.createdAt) : null;
    if (!d) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return d >= weekAgo;
  }).length;

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Attendees</h1>
          <p className="page-subtitle mt-1">Manage all registered attendees</p>
        </div>
        <button
          onClick={() => toast('Export feature coming soon')}
          className="btn btn-secondary"
        >
          Export
        </button>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5">
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">Total Attendees</p>
          <p className="text-2xl font-bold text-white font-display tabular-nums">{totalAttendees}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">Verified</p>
          <p className="text-2xl font-bold text-white font-display tabular-nums">{attendees.filter((a) => a.isVerified).length}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-1">New This Week</p>
          <p className="text-2xl font-bold text-white font-display tabular-nums">{newThisWeek}</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="relative w-full sm:w-72">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9 w-full"
        />
      </motion.div>

      <motion.div variants={item} className="glass overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-surface-border text-slate-400">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Registered Date</th>
              <th className="px-4 py-3 font-medium">Events Attended</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                  No attendees found
                </td>
              </tr>
            ) : (
              filtered.map((a, i) => (
                <motion.tr
                  key={a._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-surface-border/50 hover:bg-white/3"
                >
                  <td className="px-5 py-4 text-white font-medium">{a.name}</td>
                  <td className="px-4 py-4 text-slate-300">{a.email}</td>
                  <td className="px-4 py-4 text-slate-300">
                    {formatDate(a.createdAt)}
                  </td>
                  <td className="px-4 py-4 text-slate-300">{a.eventsAttended ?? 0}</td>
                  <td className="px-4 py-4">
                    <Badge variant={a.isVerified ? 'success' : 'warning'}>
                      {a.isVerified ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}
