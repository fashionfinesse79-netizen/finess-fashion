'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { Star, X, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: { id: string; name: string; images?: string[]; slug?: string } | null;
  orderId?: string;
  initialUserName?: string;
  onSuccess?: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor / Needs Improvement',
  2: 'Fair Quality',
  3: 'Good & Meets Expectations',
  4: 'Very Good Luxury Quality',
  5: 'Exceptional Atelier Masterpiece'
};

export default function ReviewModal({
  isOpen,
  onClose,
  product,
  orderId,
  initialUserName = '',
  onSuccess
}: ReviewModalProps) {
  const { addReview } = useStore();
  const { user } = useAuth();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setRating(5);
      setHoverRating(0);
      setComment('');
      setError(null);
      setUserName(initialUserName || (user ? user.name || user.email.split('@')[0] : ''));
    }
  }, [isOpen, initialUserName, user]);

  if (!isOpen || !product) return null;

  const activeRating = hoverRating || rating;
  const productImage = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=300&q=80';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide a brief review describing your experience.');
      return;
    }
    if (comment.trim().length < 5) {
      setError('Please write at least 5 characters for your review.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await addReview(product.id, {
      rating,
      comment: comment.trim(),
      userName: userName.trim() || 'Verified Atelier Client',
      orderId
    });

    setSubmitting(false);

    if (result.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setError(result.error || 'Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#FAF6F0] border border-[#58111A]/20 p-6 sm:p-8 shadow-2xl space-y-5 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={submitting}
          className="absolute top-4 right-4 text-[#7A3B43] hover:text-[#58111A] transition-colors cursor-pointer"
          title="Close review modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold block">
            VERIFIED ATELIER CLIENT REVIEW
          </span>
          <h3 className="font-serif-luxury text-2xl text-[#58111A] mt-1">
            RATE YOUR GARMENT
          </h3>
          <p className="text-xs text-[#7A3B43] font-light mt-1">
            Share your thoughts on fit, fabric drape, and craftsmanship.
          </p>
        </div>

        {/* Product preview */}
        <div className="flex items-center gap-3 p-3 bg-white border border-[#58111A]/15 shadow-sm">
          <div className="relative w-12 h-16 shrink-0 bg-[#FAF6F0] border border-[#58111A]/10 overflow-hidden">
            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-xs text-[#58111A] truncate">{product.name}</h4>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-medium mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Verified Purchase</span>
              {orderId && <span className="text-gray-400">• Order #{orderId}</span>}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-[11px] font-semibold">
              {error}
            </div>
          )}

          {/* Star Rating selector */}
          <div className="text-center py-2 bg-white/60 border border-[#58111A]/10 rounded-sm">
            <label className="block text-[11px] font-semibold text-[#58111A] uppercase tracking-wider mb-2">
              Overall Rating
            </label>
            <div className="flex justify-center items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                  title={`${star} Stars`}
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      star <= activeRating
                        ? 'fill-[#D4AF37] text-[#D4AF37]'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#7A3B43] font-serif-luxury italic mt-2">
              {RATING_LABELS[activeRating] || 'Select Rating'}
            </p>
          </div>

          {/* Client Name */}
          <div>
            <label className="block text-[11px] font-semibold text-[#7A3B43] uppercase tracking-wider mb-1">
              Your Name (Displayed with review)
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Princess Ananya Singhania"
              className="w-full px-3 py-2.5 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none focus:border-[#58111A]"
              required
            />
          </div>

          {/* Review Comment */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[11px] font-semibold text-[#7A3B43] uppercase tracking-wider">
                Review & Experience
              </label>
              <span className="text-[10px] text-gray-400">{comment.length} chars</span>
            </div>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Exquisite silk texture and impeccable corseted fit! Draped beautifully and received endless compliments..."
              className="w-full px-3 py-2.5 bg-white border border-[#58111A]/15 text-xs text-[#58111A] focus:outline-none focus:border-[#58111A] resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#58111A] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#D4AF37] hover:text-[#58111A] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> PUBLISHING VERIFIED REVIEW...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" /> SUBMIT VERIFIED REVIEW
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
