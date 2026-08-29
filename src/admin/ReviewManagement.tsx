import React, { useState, useMemo } from 'react';
import {
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  MessageSquare,
  Sparkles,
  X,
  Search,
  Filter,
  CheckSquare,
  Square
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Review } from '../types';

export const ReviewManagement: React.FC = () => {
  const { reviews, updateReviewStatus, replyToReview, deleteReview } = useStore();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [replyingReview, setReplyingReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (filterStatus !== 'all' && r.status !== filterStatus) return false;
      if (ratingFilter !== 'all' && r.rating !== parseInt(ratingFilter)) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = r.userName.toLowerCase().includes(q);
        const matchProd = (r.productName || '').toLowerCase().includes(q);
        const matchTitle = (r.title || '').toLowerCase().includes(q);
        const matchComment = r.comment.toLowerCase().includes(q);
        if (!matchName && !matchProd && !matchTitle && !matchComment) return false;
      }

      return true;
    });
  }, [reviews, filterStatus, ratingFilter, searchQuery]);

  const handleOpenReply = (rev: Review) => {
    setReplyingReview(rev);
    setReplyText(rev.reply?.text || '');
  };

  const handleSaveReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingReview || !replyText.trim()) return;
    replyToReview(replyingReview.id, replyText.trim(), 'AURA Atelier Concierge');
    setReplyingReview(null);
    setReplyText('');
  };

  const isAllSelected = filteredReviews.length > 0 && filteredReviews.every((r) => selectedIds.includes(r.id));
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredReviews.some((r) => r.id === id)));
    } else {
      const pageIds = filteredReviews.map((r) => r.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleBulkApprove = () => {
    selectedIds.forEach((id) => updateReviewStatus(id, 'approved'));
    setSelectedIds([]);
  };

  const handleBulkReject = () => {
    selectedIds.forEach((id) => updateReviewStatus(id, 'rejected'));
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (confirm(`Permanently remove ${selectedIds.length} selected impressions?`)) {
      selectedIds.forEach((id) => deleteReview(id));
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-950">
            Customer Reviews & Authenticity Moderation
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Approve verified buyer impressions, bulk moderate submissions, and publish official replies.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'approved', 'pending', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                filterStatus === st
                  ? 'bg-zinc-950 text-white shadow-2xs'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {st} ({reviews.filter((r) => (st === 'all' ? true : r.status === st)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer, product, impression text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-3 py-2 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-500"
            />
          </div>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-medium text-zinc-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">5 Stars ★★★★★</option>
            <option value="4">4 Stars ★★★★</option>
            <option value="3">3 Stars ★★★</option>
            <option value="2">2 Stars ★★</option>
            <option value="1">1 Star ★</option>
          </select>
        </div>

        {filteredReviews.length > 0 && (
          <button
            onClick={handleToggleSelectAll}
            className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 flex items-center gap-1.5 self-start md:self-auto"
          >
            {isAllSelected ? <CheckSquare className="w-4 h-4 text-zinc-950" /> : <Square className="w-4 h-4 text-zinc-400" />}
            <span>Select All ({filteredReviews.length})</span>
          </button>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-zinc-900 text-white px-5 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="bg-amber-400 text-zinc-950 font-bold px-2 py-0.5 rounded-full font-mono">
              {selectedIds.length}
            </span>
            <span>reviews selected</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={handleBulkApprove}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Approve All</span>
            </button>
            <button
              onClick={handleBulkReject}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl font-bold flex items-center gap-1 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject All</span>
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Reviews Stream */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-zinc-200 text-zinc-400 text-xs">
            No customer impressions found matching this filter criteria.
          </div>
        ) : (
          filteredReviews.map((review) => {
            const isChecked = selectedIds.includes(review.id);
            return (
              <div
                key={review.id}
                className={`bg-white rounded-2xl border border-zinc-200 p-6 space-y-4 shadow-2xs transition-colors ${
                  isChecked ? 'border-zinc-400 bg-zinc-50/40' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-150">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleSelect(review.id)}
                      className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 cursor-pointer mr-1"
                    />
                    <img
                      src={
                        review.userAvatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(review.userName)}`
                      }
                      alt={review.userName}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-zinc-900">{review.userName}</span>
                        {review.isVerifiedBuyer && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                            ✓ Verified Buyer
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Product: <strong className="text-zinc-700">{review.productName}</strong>
                        {review.orderNumber && (
                          <span>
                            {' '}
                            • Order: <strong className="font-mono text-zinc-700">{review.orderNumber}</strong>
                          </span>
                        )}
                        <span> • {new Date(review.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'fill-current' : 'text-zinc-200'
                          }`}
                        />
                      ))}
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        review.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : review.status === 'pending'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {review.status}
                    </span>
                  </div>
                </div>

                {/* Review Content */}
                <div>
                  <h4 className="text-xs font-bold text-zinc-950">{review.title}</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed mt-1">{review.comment}</p>
                </div>

                {/* Store Reply if present */}
                {review.reply && (
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-150 text-xs space-y-1">
                    <p className="font-bold text-zinc-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Official Concierge Reply ({review.reply.repliedBy})
                    </p>
                    <p className="text-zinc-600 text-[11px]">{review.reply.text}</p>
                  </div>
                )}

                {/* Actions Toolbar */}
                <div className="pt-3 border-t border-zinc-150 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenReply(review)}
                    className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{review.reply ? 'Edit Official Reply' : 'Post Official Reply'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {review.status !== 'approved' && (
                      <button
                        onClick={() => updateReviewStatus(review.id, 'approved')}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-semibold flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {review.status !== 'rejected' && (
                      <button
                        onClick={() => updateReviewStatus(review.id, 'rejected')}
                        className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-semibold flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm('Delete review permanently?')) {
                          deleteReview(review.id);
                        }
                      }}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reply Modal */}
      {replyingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-zinc-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-200">
              <h3 className="text-base font-serif font-bold text-zinc-950">
                Reply to {replyingReview.userName}
              </h3>
              <button onClick={() => setReplyingReview(null)} className="text-zinc-400 hover:text-zinc-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReply} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1">
                  Concierge Response Text
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Thank you for sharing your experience. We are thrilled to hear..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-zinc-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setReplyingReview(null)}
                  className="px-4 py-2 bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-950 text-white text-xs font-bold rounded-xl"
                >
                  Publish Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
