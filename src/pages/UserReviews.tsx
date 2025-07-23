import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Rating,
  Chip,
  Button,
  Stack,
  Alert,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  EditOutlined,
  DeleteOutlined,
  MoreVertOutlined,
} from '@mui/icons-material';
import { reviewApi, productApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { Review, Product } from '../types';
import { formatCurrency } from '../utils';
import ReviewForm from '../components/ReviewForm';

const UserReviews: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<{ [key: string]: Product }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<Review | null>(null);
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userReviews = await reviewApi.getReviewsByUser(user.id);
        setReviews(userReviews as any); // Type assertion to handle interface mismatch

        // Fetch product details for each review
        const productPromises = userReviews.map(review => 
          productApi.getProduct(review.productId.toString())
        );
        
        const productResults = await Promise.allSettled(productPromises);
        const productMap: { [key: string]: Product } = {};
        
        productResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            const productId = userReviews[index].productId.toString();
            productMap[productId] = result.value;
          }
        });
        
        setProducts(productMap);
      } catch (err) {
        setError('Failed to load your reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, [user]);

  const handleMenuOpen = (reviewId: string, event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(prev => ({ ...prev, [reviewId]: event.currentTarget }));
  };

  const handleMenuClose = (reviewId: string) => {
    setAnchorEl(prev => ({ ...prev, [reviewId]: null }));
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    handleMenuClose(review.id);
  };

  const handleDeleteReview = async (review: Review) => {
    try {
      await reviewApi.deleteReview(review.id);
      setReviews(reviews.filter(r => r.id !== review.id));
      setDeleteDialogOpen(null);
    } catch (err) {
      setError('Failed to delete review');
    }
  };

  const onReviewUpdated = async () => {
    // Refresh reviews after update
    if (!user) return;
    try {
      const userReviews = await reviewApi.getReviewsByUser(user.id);
      setReviews(userReviews as any);
      setEditingReview(null);
    } catch (err) {
      setError('Failed to refresh reviews');
    }
  };

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

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Please log in to view your reviews.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your reviews...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Reviews
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {reviews.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            You haven't written any reviews yet
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Start shopping and share your experience with other customers!
          </Typography>
          <Button variant="contained" href="/products">
            Browse Products
          </Button>
        </Card>
      ) : (
        <Stack spacing={3}>
          {reviews.map((review) => {
            const product = products[review.productId.toString()];
            return (
              <Card key={review.id} elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1 }}>
                      {product && (
                        <Box
                          component="img"
                          src={product.images?.[0] || '/placeholder-product.jpg'}
                          alt={product.name}
                          sx={{
                            width: 80,
                            height: 80,
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                        />
                      )}
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {product?.name || 'Unknown Product'}
                        </Typography>
                        {product && (
                          <Typography variant="body2" color="text.secondary">
                            {formatCurrency(product.price)}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          Reviewed {formatTimeAgo(review.createdAt)}
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
                      <MenuItem onClick={() => handleEditReview(review)}>
                        <EditOutlined sx={{ mr: 1 }} />
                        Edit Review
                      </MenuItem>
                      <MenuItem onClick={() => setDeleteDialogOpen(review)}>
                        <DeleteOutlined sx={{ mr: 1 }} />
                        Delete Review
                      </MenuItem>
                    </Menu>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Rating value={review.rating} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        {review.rating}/5
                      </Typography>
                      {review.isVerified && (
                        <Chip
                          label="Verified Purchase"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {review.title}
                    </Typography>
                  </Box>

                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {review.comment}
                  </Typography>

                  {(review.helpfulCount || 0) > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {review.helpfulCount} {review.helpfulCount === 1 ? 'person' : 'people'} found this helpful
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* Edit Review Dialog */}
      {editingReview && (
        <Dialog open={true} onClose={() => setEditingReview(null)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Your Review</DialogTitle>
          <DialogContent>
            <ReviewForm
              productId={editingReview.productId.toString()}
              existingReview={editingReview}
              onReviewSubmitted={onReviewUpdated}
              onCancel={() => setEditingReview(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <Dialog open={true} onClose={() => setDeleteDialogOpen(null)}>
          <DialogTitle>Delete Review</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete your review for "{products[deleteDialogOpen.productId.toString()]?.name || 'this product'}"?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(null)}>Cancel</Button>
            <Button
              onClick={() => handleDeleteReview(deleteDialogOpen)}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default UserReviews;
