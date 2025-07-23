import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Rating,
  Chip,
  Button,
  Stack,
  Avatar,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  ThumbUpOutlined,
  ThumbUp,
  MoreVertOutlined,
  ReportOutlined,
  VerifiedOutlined,
} from '@mui/icons-material';
import { Review } from '../types';

// Simple date formatting function
const formatTimeAgo = (date: string | Date) => {
  const now = new Date();
  const reviewDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - reviewDate.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating-high' | 'rating-low' | 'helpful'>('newest');
  const [filterBy, setFilterBy] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

  const handleMenuOpen = (reviewId: string, event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(prev => ({ ...prev, [reviewId]: event.currentTarget }));
  };

  const handleMenuClose = (reviewId: string) => {
    setAnchorEl(prev => ({ ...prev, [reviewId]: null }));
  };

  const handleHelpfulClick = (reviewId: string) => {
    setHelpfulReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const sortReviews = (reviewsToSort: Review[]) => {
    return [...reviewsToSort].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        case 'helpful':
          return (b.helpfulCount || 0) - (a.helpfulCount || 0);
        default:
          return 0;
      }
    });
  };

  const filterReviews = (reviewsToFilter: Review[]) => {
    if (filterBy === 'all') return reviewsToFilter;
    return reviewsToFilter.filter(review => review.rating === parseInt(filterBy));
  };

  const processedReviews = sortReviews(filterReviews(reviews));

  const getInitials = (userId: string) => {
    // Since we don't have user names, we'll use the user ID to generate initials
    return userId.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (userId: string) => {
    // Generate a consistent color based on user ID
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <Stack spacing={3}>
      {/* Sort and Filter Controls */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            label="Sort by"
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
            <MenuItem value="rating-high">Highest Rating</MenuItem>
            <MenuItem value="rating-low">Lowest Rating</MenuItem>
            <MenuItem value="helpful">Most Helpful</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filterBy}
            label="Filter"
            onChange={(e) => setFilterBy(e.target.value as any)}
          >
            <MenuItem value="all">All Stars</MenuItem>
            <MenuItem value="5">5 Stars</MenuItem>
            <MenuItem value="4">4 Stars</MenuItem>
            <MenuItem value="3">3 Stars</MenuItem>
            <MenuItem value="2">2 Stars</MenuItem>
            <MenuItem value="1">1 Star</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Reviews */}
      <Stack spacing={2}>
        {processedReviews.map((review) => (
          <Card key={review.id} elevation={1}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar
                    sx={{ 
                      bgcolor: getAvatarColor(review.userId),
                      width: 48,
                      height: 48,
                    }}
                  >
                    {getInitials(review.userId)}
                  </Avatar>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Customer {review.userId.slice(0, 8)}...
                      </Typography>
                      {review.isVerified && (
                        <Chip
                          icon={<VerifiedOutlined />}
                          label="Verified Purchase"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {formatTimeAgo(review.createdAt)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(review.id, e)}
                >
                  <MoreVertOutlined />
                </IconButton>
                <Menu
                  anchorEl={anchorEl[review.id]}
                  open={Boolean(anchorEl[review.id])}
                  onClose={() => handleMenuClose(review.id)}
                >
                  <MenuItem onClick={() => handleMenuClose(review.id)}>
                    <ReportOutlined sx={{ mr: 1 }} />
                    Report Review
                  </MenuItem>
                </Menu>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Rating value={review.rating} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {review.rating}/5
                  </Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                  {review.title}
                </Typography>
              </Box>

              <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
                {review.comment}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Button
                    size="small"
                    startIcon={helpfulReviews.has(review.id) ? <ThumbUp /> : <ThumbUpOutlined />}
                    onClick={() => handleHelpfulClick(review.id)}
                    color={helpfulReviews.has(review.id) ? 'primary' : 'inherit'}
                  >
                    Helpful
                  </Button>
                  {(review.helpfulCount || 0) > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      ({review.helpfulCount} found helpful)
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {processedReviews.length === 0 && reviews.length > 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No reviews match your current filter.
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

export default ReviewList;
