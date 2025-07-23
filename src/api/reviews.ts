import { get, post, put, del } from './client';
import { Review } from '../types';

export const reviewApi = {
  // Get all reviews
  getReviews: (): Promise<Review[]> => {
    return get<Review[]>('/reviews');
  },

  // Get single review by ID
  getReview: (id: string): Promise<Review> => {
    return get<Review>(`/reviews/${id}`);
  },

  // Get reviews by product ID
  getReviewsByProduct: (productId: string): Promise<Review[]> => {
    return get<Review[]>(`/reviews/product/${productId}`);
  },

  // Get reviews by user ID
  getReviewsByUser: (userId: string): Promise<Review[]> => {
    return get<Review[]>(`/reviews/user/${userId}`);
  },

  // Create new review
  createReview: (reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpfulCount'>): Promise<Review> => {
    return post<Review>('/reviews', reviewData);
  },

  // Update review (admin only)
  updateReview: (id: string, reviewData: Partial<Review>): Promise<Review> => {
    return put<Review>(`/reviews/${id}`, reviewData);
  },

  // Delete review (admin only)
  deleteReview: (id: string): Promise<boolean> => {
    return del<boolean>(`/reviews/${id}`);
  },

  // Mark review as helpful
  markReviewHelpful: (id: string): Promise<Review> => {
    return post<Review>(`/reviews/${id}/helpful`, {});
  },

  // Get review with MongoDB validation
  getReviewWithMongoValidation: (id: string): Promise<Review> => {
    return get<Review>(`/reviews/${id}/mongo`);
  },
};
