import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardMedia,
  Button,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  IconButton,
  Tabs,
  Tab,
  Rating,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBackOutlined,
  AddShoppingCartOutlined,
  FavoriteOutlined,
  ShareOutlined,
  ReviewsOutlined,
  InfoOutlined,
} from '@mui/icons-material';
import { productApi, reviewApi } from '../api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Product, Review } from '../types';
import { formatCurrency, t } from '../utils';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [tabValue, setTabValue] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const fetchedProduct = await productApi.getProduct(id);
        setProduct(fetchedProduct);
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      
      try {
        setReviewsLoading(true);
        const fetchedReviews = await reviewApi.getReviewsByProduct(id);
        setReviews(fetchedReviews);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      // Show success message or navigate to cart
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const onReviewSubmitted = async () => {
    // Refresh reviews after a new review is submitted
    try {
      const fetchedReviews = await reviewApi.getReviewsByProduct(id!);
      setReviews(fetchedReviews as any); // Type assertion to handle the interface mismatch
      setShowReviewForm(false);
    } catch (err) {
      console.error('Failed to refresh reviews:', err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading product details...
        </Typography>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Product not found'}
        </Alert>
        <Button
          startIcon={<ArrowBackOutlined />}
          onClick={() => navigate('/products')}
          variant="outlined"
        >
          {t('backToProducts')}
        </Button>
      </Container>
    );
  }

  const averageRating = calculateAverageRating();
  const ratingDistribution = getRatingDistribution();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackOutlined />}
        onClick={() => navigate('/products')}
        sx={{ mb: 3 }}
      >
        {t('backToProducts')}
      </Button>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Product Images */}
        <Box sx={{ flex: 1 }}>
          <Card elevation={2}>
            <CardMedia
              component="img"
              height="500"
              image={product.images?.[0] || '/placeholder-product.jpg'}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
          </Card>
        </Box>

        {/* Product Info */}
        <Box sx={{ flex: 1 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Rating value={averageRating} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary">
                  ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </Typography>
              </Box>

              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                {formatCurrency(product.price)}
              </Typography>

              <Chip
                label={product.stock > 0 ? `${product.stock} ${t('inStock')}` : t('outOfStock')}
                color={product.stock > 0 ? 'success' : 'error'}
                variant="outlined"
                sx={{ mb: 2 }}
              />

              <Typography variant="body1" color="text.secondary" paragraph>
                {product.description}
              </Typography>
            </Box>

            {/* Quantity and Add to Cart */}
            <Paper elevation={1} sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body1">{t('quantity')}:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      size="small"
                    >
                      -
                    </IconButton>
                    <Typography variant="body1" sx={{ minWidth: 40, textAlign: 'center' }}>
                      {quantity}
                    </Typography>
                    <IconButton
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      size="small"
                    >
                      +
                    </IconButton>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  fullWidth
                >
                  {t('addToCart')}
                </Button>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton>
                    <FavoriteOutlined />
                  </IconButton>
                  <IconButton>
                    <ShareOutlined />
                  </IconButton>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Box>

      {/* Product Details and Reviews Tabs */}
      <Box sx={{ mt: 6 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="product details tabs">
          <Tab icon={<InfoOutlined />} label={t('description')} />
          <Tab icon={<ReviewsOutlined />} label={`Reviews (${reviews.length})`} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          {product.category && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Category
              </Typography>
              <Chip label={product.category.name} variant="outlined" />
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Stack spacing={4}>
            {/* Review Summary */}
            <Paper elevation={1} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                <Box sx={{ textAlign: 'center', minWidth: 200 }}>
                  <Typography variant="h3" component="div" gutterBottom>
                    {averageRating.toFixed(1)}
                  </Typography>
                  <Rating value={averageRating} precision={0.1} readOnly size="large" />
                  <Typography variant="body2" color="text.secondary">
                    Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </Typography>
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Stack spacing={1}>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <Box key={rating} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ minWidth: 60 }}>
                          {rating} star{rating !== 1 ? 's' : ''}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={reviews.length > 0 ? (ratingDistribution[rating as keyof typeof ratingDistribution] / reviews.length) * 100 : 0}
                          sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="body2" sx={{ minWidth: 30 }}>
                          {ratingDistribution[rating as keyof typeof ratingDistribution]}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Paper>

            {/* Write Review Button */}
            {user && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Customer Reviews</Typography>
                <Button
                  variant="outlined"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  startIcon={<ReviewsOutlined />}
                >
                  Write a Review
                </Button>
              </Box>
            )}

            {/* Review Form */}
            {showReviewForm && user && product && (
              <ReviewForm
                productId={product.id}
                onReviewSubmitted={onReviewSubmitted}
                onCancel={() => setShowReviewForm(false)}
              />
            )}

            {/* Reviews List */}
            {reviewsLoading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Loading reviews...
                </Typography>
              </Box>
            ) : (
              <ReviewList reviews={reviews} />
            )}

            {reviews.length === 0 && !reviewsLoading && (
              <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  No reviews yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Be the first to review this product!
                </Typography>
              </Paper>
            )}
          </Stack>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default ProductDetail;
