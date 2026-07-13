import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import {
  useGetEventTeamQuery,
  useGetTeamStatsQuery,
  useInviteMemberMutation,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
} from '../../features/team/teamApi';
import { useGetEventsQuery } from '../../features/organizer/organizerApi';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import {
  UsersIcon, UserPlusIcon, ShieldCheckIcon, EyeIcon,
  MagnifyingGlassIcon, TrashIcon, PencilIcon, EnvelopeIcon,
  ArrowUpRightIcon, XMarkIcon, CheckCircleIcon, ClockIcon,
  UserGroupIcon, Cog6ToothIcon, InformationCircleIcon,
} from '@heroicons/react/24/outline';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const ROLES = [
  { value: 'co_organizer', label: 'Co-Organizer', description: 'Full access except team management', icon: ShieldCheckIcon, color: 'text-violet-400 bg-violet-500/10' },
  { value: 'check_in_staff', label: 'Check-in Staff', description: 'Can scan QR codes and manage entry', icon: CheckCircleIcon, color: 'text-emerald-400 bg-emerald-500/10' },
  { value: 'content_manager', label: 'Content Manager', description: 'Can edit event content and send announcements', icon: Cog6ToothIcon, color: 'text-blue-400 bg-blue-500/10' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access to event data', icon: EyeIcon, color: 'text-zinc-400 bg-zinc-500/10' },
];

const ROLE_BADGES = {
  co_organizer: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  check_in_staff: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  content_manager: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  viewer: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
};

const STATUS_BADGES = {
  pending: 'bg-amber-500/10 text-amber-400',
  accepted: 'bg-emerald-500/10 text-emerald-400',
  declined: 'bg-red-500/10 text-red-400',
  removed: 'bg-zinc-500/10 text-zinc-400',
};

export default function TeamManagement() {
  const { eventId } = useParams();
  const [selectedEvent, setSelectedEvent] = useState(eventId || '');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: eventsData } = useGetEventsQuery(undefined, { skip: !!eventId });
  const events = eventsData?.events || [];

  const { data: teamData, isLoading: teamLoading } = useGetEventTeamQuery(selectedEvent, { skip: !selectedEvent });
  const { data: statsData } = useGetTeamStatsQuery(selectedEvent, { skip: !selectedEvent });

  const [inviteMember, { isLoading: inviting }] = useInviteMemberMutation();
  const [updateMemberRole] = useUpdateMemberRoleMutation();
  const [removeMember, { isLoading: removing }] = useRemoveMemberMutation();

  const members = teamData?.members || [];
  const stats = statsData || {};

  const filtered = members.filter((m) =>
    m.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInvite = async () => {
    if (!inviteEmail || !selectedEvent) return;
    try {
      await inviteMember({ eventId: selectedEvent, email: inviteEmail, role: inviteRole }).unwrap();
      toast.success('Invitation sent successfully!');
      setInviteEmail('');
      setInviteRole('viewer');
      setShowInviteModal(false);
    } catch (err) {
      toast.error(err?.data?.message ?? 'Failed to send invitation');
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await updateMemberRole({ eventId: selectedEvent, memberId, role: newRole }).unwrap();
      toast.success('Role updated');
      setEditingMember(null);
    } catch (err) {
      toast.error(err?.data?.message ?? 'Failed to update role');
    }
  };

  const handleRemove = async (memberId) => {
    try {
      await removeMember({ eventId: selectedEvent, memberId }).unwrap();
      toast.success('Member removed');
    } catch (err) {
      toast.error(err?.data?.message ?? 'Failed to remove member');
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Team Management</h1>
          <p className="text-zinc-400 text-sm mt-1">Invite and manage your event team</p>
        </div>
        {selectedEvent && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all"
          >
            <UserPlusIcon className="w-4 h-4" />
            Invite Member
          </button>
        )}
      </motion.div>

      {/* Event Selector (if not in context) */}
      {!eventId && (
        <motion.div variants={item} className="glass rounded-2xl p-4">
          <label className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-2">Select Event</label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/40 transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-surface text-zinc-400">Choose an event...</option>
            {events.map((ev) => (
              <option key={ev._id} value={ev._id} className="bg-surface text-white">{ev.title}</option>
            ))}
          </select>
        </motion.div>
      )}

      {!selectedEvent ? (
        <motion.div variants={item} className="glass rounded-2xl p-12 text-center">
          <UsersIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400 font-medium">Select an event to manage its team</p>
          <p className="text-xs text-zinc-600 mt-1">Choose an event from the dropdown above</p>
        </motion.div>
      ) : teamLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <>
          {/* Stats */}
          <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="glass rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{stats.total || 0}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Total Members</p>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">{stats.accepted || 0}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Active</p>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-amber-400">{stats.pending || 0}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Pending</p>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-violet-400">{stats.byRole?.co_organizer || 0}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Co-Organizers</p>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div variants={item} className="relative max-w-sm">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/40 transition-all"
            />
          </motion.div>

          {/* Members List */}
          {filtered.length === 0 ? (
            <motion.div variants={item} className="glass rounded-2xl p-12 text-center">
              <UserGroupIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 font-medium">
                {members.length === 0 ? 'No team members yet' : 'No matching members'}
              </p>
              <p className="text-xs text-zinc-600 mt-1 mb-4">
                {members.length === 0 ? 'Invite your first team member to get started' : 'Try a different search'}
              </p>
              {members.length === 0 && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600/80 text-white text-xs font-medium hover:bg-violet-500 transition-all"
                >
                  <UserPlusIcon className="w-3.5 h-3.5" /> Invite First Member
                </button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filtered.map((member) => (
                <motion.div
                  key={member._id}
                  variants={item}
                  layout
                  className="glass rounded-2xl p-4 hover:ring-1 hover:ring-violet-500/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                      {member.user?.avatar ? (
                        <img src={member.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        member.user?.name?.[0]?.toUpperCase() || '?'
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white truncate">{member.user?.name || 'Unknown'}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium border capitalize ${ROLE_BADGES[member.role] || ''}`}>
                          {member.role?.replace('_', ' ')}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${STATUS_BADGES[member.status] || ''}`}>
                          {member.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{member.user?.email}</p>
                      <p className="text-[9px] text-zinc-600 mt-0.5">
                        Invited by {member.invitedBy?.name} · {new Date(member.invitedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => setEditingMember(editingMember === member._id ? null : member._id)}
                        className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
                        title="Change role"
                      >
                        <PencilIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemove(member._id)}
                        disabled={removing}
                        className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                        title="Remove member"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Role Editor */}
                  <AnimatePresence>
                    {editingMember === member._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-white/[0.06]">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Change Role</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {ROLES.map((r) => (
                              <button
                                key={r.value}
                                onClick={() => handleRoleChange(member._id, r.value)}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                  member.role === r.value
                                    ? 'border-violet-500/40 bg-violet-500/10'
                                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <r.icon className={`w-3.5 h-3.5 ${r.color.split(' ')[0]}`} />
                                  <span className="text-xs font-medium text-white">{r.label}</span>
                                </div>
                                <p className="text-[9px] text-zinc-500">{r.description}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}

          {/* Role Legend */}
          <motion.div variants={item} className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <InformationCircleIcon className="w-4 h-4 text-zinc-500" />
              <p className="text-xs text-zinc-400 font-medium">Role Permissions</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {ROLES.map((r) => (
                <div key={r.value} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center gap-2 mb-1">
                    <r.icon className={`w-4 h-4 ${r.color.split(' ')[0]}`} />
                    <span className="text-xs font-medium text-white">{r.label}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500">{r.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md glass rounded-2xl p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-violet-500/10">
                    <UserPlusIcon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Invite Team Member</h3>
                    <p className="text-[10px] text-zinc-500">They'll receive a notification</p>
                  </div>
                </div>
                <button onClick={() => setShowInviteModal(false)} className="p-1.5 rounded-lg hover:bg-white/[0.04] text-zinc-500">
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1.5">Email Address</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/40 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-2">Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setInviteRole(r.value)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        inviteRole === r.value
                          ? 'border-violet-500/40 bg-violet-500/10'
                          : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <r.icon className={`w-3.5 h-3.5 ${r.color.split(' ')[0]}`} />
                        <span className="text-xs font-medium text-white">{r.label}</span>
                      </div>
                      <p className="text-[9px] text-zinc-500">{r.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end pt-2">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={!inviteEmail || inviting}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-medium hover:from-violet-500 hover:to-fuchsia-500 transition-all disabled:opacity-50"
                >
                  {inviting ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
