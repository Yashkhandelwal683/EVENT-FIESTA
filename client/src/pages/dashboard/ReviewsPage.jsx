import { useGetOrganizerReviewsQuery, useReplyToReviewMutation, useToggleReviewVisibilityMutation } from '../../features/reviews/reviewsApi';
import { useState } from 'react';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

export default function ReviewsPage() {
  const { data, isLoading } = useGetOrganizerReviewsQuery();
  const [replyToReview] = useReplyToReviewMutation();
  const [toggleVisibility] = useToggleReviewVisibilityMutation();
  const [replyText, setReplyText] = useState({});

  const reviews = data?.reviews || [];
  const average = data?.average || 0;
  const total = data?.total || 0;

  const handleReply = async (id) => {
    if (!replyText[id]?.trim()) return;
    try {
      await replyToReview({ id, reply: replyText[id] }).unwrap();
      toast.success('Reply sent');
      setReplyText((prev) => ({ ...prev, [id]: '' }));
    } catch {
      toast.error('Failed to send reply');
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleVisibility(id).unwrap();
      toast.success('Visibility toggled');
    } catch {
      toast.error('Failed to toggle');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Reviews</h1>
        <p className="text-slate-400 text-sm mt-1">
          {total > 0 ? `Average rating: ${average.toFixed(1)} ★ from ${total} reviews` : 'No reviews yet'}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}</div>
      ) : reviews.length === 0 ? (
        <div className="glass p-12 text-center">
          <div className="text-4xl mb-4">⭐</div>
          <h3 className="font-display font-semibold text-white text-lg mb-2">No reviews yet</h3>
          <p className="text-slate-400 text-sm">Reviews from attendees will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="glass p-5 border-surface-border/60">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {review.user?.name?.[0] || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white text-sm">{review.user?.name || 'Anonymous'}</span>
                    <span className="text-xs text-slate-500">· {new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
                    {review.event?.title && <span className="text-xs text-primary-400 ml-auto">{review.event.title}</span>}
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      i < review.rating
                        ? <StarSolid key={i} className="w-3.5 h-3.5 text-amber-400" />
                        : <StarOutline key={i} className="w-3.5 h-3.5 text-slate-600" />
                    ))}
                  </div>
                  {review.title && <p className="text-sm font-medium text-white mb-1">{review.title}</p>}
                  <p className="text-sm text-slate-400">{review.comment}</p>
                  {review.replyText && (
                    <div className="mt-3 p-3 bg-primary-600/10 rounded-xl border border-primary-600/20">
                      <p className="text-xs text-primary-400 font-medium mb-1">Your reply:</p>
                      <p className="text-sm text-slate-300">{review.replyText}</p>
                    </div>
                  )}
                  {!review.replyText && (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyText[review._id] || ''}
                        onChange={(e) => setReplyText((prev) => ({ ...prev, [review._id]: e.target.value }))}
                        className="flex-1 bg-surface-input border border-surface-border rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500/50"
                      />
                      <button
                        onClick={() => handleReply(review._id)}
                        className="px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold rounded-lg transition-all"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => handleToggle(review._id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          review.isSpam
                            ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                            : 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                        }`}
                      >
                        {review.isSpam ? 'Unhide' : 'Hide'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
