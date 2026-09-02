import { NextResponse } from 'next/server';
import { getProductCollection } from '@/lib/mongodb';
import { Review, Product } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, rating, comment, userName, orderId } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
      return NextResponse.json({ error: 'Review comment is required' }, { status: 400 });
    }

    const newReview: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userName: (userName || 'Verified Atelier Client').trim(),
      rating: Math.min(5, Math.max(1, Math.round(numRating))),
      date: new Date().toISOString().split('T')[0],
      comment: comment.trim(),
      verified: true
    };

    const collection = await getProductCollection();
    const product: Product | null = await collection.findOne({
      $or: [{ id: productId }, { slug: productId }]
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const existingReviews: Review[] = Array.isArray(product.reviews) ? product.reviews : [];
    const updatedReviews = [newReview, ...existingReviews];
    const newReviewCount = updatedReviews.length;
    const newAvgRating = Number(
      (updatedReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / newReviewCount).toFixed(1)
    );

    await collection.updateOne(
      { id: product.id },
      {
        $set: {
          reviews: updatedReviews,
          reviewCount: newReviewCount,
          rating: newAvgRating
        }
      }
    );

    return NextResponse.json({
      success: true,
      review: newReview,
      product: {
        ...product,
        reviews: updatedReviews,
        reviewCount: newReviewCount,
        rating: newAvgRating
      }
    });
  } catch (error: any) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit review' }, { status: 500 });
  }
}
