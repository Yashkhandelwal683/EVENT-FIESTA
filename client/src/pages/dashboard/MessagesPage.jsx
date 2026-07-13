import { EnvelopeIcon } from '@heroicons/react/24/outline';

export default function MessagesPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass p-16 text-center">
        <EnvelopeIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h2 className="font-display font-bold text-2xl text-white mb-3">Messages</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
          The messaging feature is coming soon. You'll be able to communicate with attendees and organizers directly from here.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/20 rounded-xl text-primary-300 text-sm">
          <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
          Coming Soon
        </div>
      </div>
    </div>
  );
}
