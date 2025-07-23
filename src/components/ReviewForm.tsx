import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Rating,
  TextField,
  Button,
  Box,
  Stack,
  Alert,
  FormHelperText,
} from '@mui/material';
import { StarOutlineOutlined } from '@mui/icons-material';
import { reviewApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { Review } from '../types';

interface ReviewFormProps {
  productId: string;
  existingReview?: Review;
  onReviewSubmitted: () => void;
  onCancel: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  existingReview,
  onReviewSubmitted,
  onCancel,
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(existingReview?.rating || 5);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (rating === 0) {
      setError('Please select a rating');
      return false;
    }
    if (title.trim().length < 3) {
      setError('Title must be at least 3 characters long');
      return false;
    }
    if (comment.trim().length < 10) {
      setError('Review must be at least 10 characters long');
      return false;
    }
    if (comment.trim().length > 1000) {
      setError('Review must be less than 1000 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    if (!user) {
      setError('You must be logged in to write a review');
      return;
    }

    try {
      setSubmitting(true);
      
      if (existingReview) {
        // Update existing review
        await reviewApi.updateReview(existingReview.id, {
          rating,
          title: title.trim(),
          comment: comment.trim(),
        });
      } else {
        // Create new review
        await reviewApi.createReview({
          productId: parseInt(productId),
          userId: user.id,
          rating,
          title: title.trim(),
          comment: comment.trim(),
          isVerified: false, // This could be set based on purchase history
        });
      }

      onReviewSubmitted();
      
      // Reset form only if creating new review
      if (!existingReview) {
        setRating(5);
        setTitle('');
        setComment('');
      }
    } catch (err: any) {
      setError(err.message || `Failed to ${existingReview ? 'update' : 'submit'} review. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  const ratingLabels: { [index: string]: string } = {
    1: 'Terrible',
    2: 'Poor',
    3: 'Average',
    4: 'Good',
    5: 'Excellent',
  };

  return (
    <Paper elevation={2} sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom>
        {existingReview ? 'Edit Your Review' : 'Write Your Review'}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Rating */}
          <Box>
            <Typography variant="body1" gutterBottom>
              Overall Rating *
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Rating
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue || 0);
                }}
                size="large"
                emptyIcon={<StarOutlineOutlined fontSize="inherit" />}
              />
              <Typography variant="body2" color="text.secondary">
                {ratingLabels[rating]}
              </Typography>
            </Box>
            <FormHelperText>
              Click to rate this product
            </FormHelperText>
          </Box>

          {/* Review Title */}
          <TextField
            label="Review Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            placeholder="Summarize your experience in a few words"
            inputProps={{ maxLength: 100 }}
            helperText={`${title.length}/100 characters`}
          />

          {/* Review Comment */}
          <TextField
            label="Your Review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            required
            multiline
            rows={6}
            placeholder="Tell others about your experience with this product. What did you like or dislike? How does it compare to similar products?"
            inputProps={{ maxLength: 1000 }}
            helperText={`${comment.length}/1000 characters`}
          />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting || !rating || !title.trim() || !comment.trim()}
            >
              {submitting ? `${existingReview ? 'Updating' : 'Submitting'}...` : `${existingReview ? 'Update' : 'Submit'} Review`}
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};

export default ReviewForm;
