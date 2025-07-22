import React, { useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Breadcrumbs,
  Link,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  FavoriteBorder as FavoriteIcon,
  ShoppingCart as CartIcon
} from '@mui/icons-material';
import { useProduct } from '../../hooks';
import { useCart } from '../../contexts';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(id!);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      // You might want to show a success message here
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <Container sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
          <Typography variant="h4" color="error" gutterBottom>
            Product Not Found
          </Typography>
          <Typography color="text.secondary" paragraph>
            {error || 'The product you are looking for does not exist.'}
          </Typography>
          <Button component={RouterLink} to="/products" variant="contained">
            Back to Products
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 4 }}>
        <Link component={RouterLink} to="/" underline="hover">
          Home
        </Link>
        <Link component={RouterLink} to="/products" underline="hover">
          Products
        </Link>
        <Link component={RouterLink} to={`/products?category=${product.category.id}`} underline="hover">
          {product.category.name}
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Paper sx={{ overflow: 'hidden' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
          {/* Product Images */}
          <Box sx={{ p: 3 }}>
            <Card sx={{ mb: 2 }}>
              <CardMedia
                component="img"
                height="400"
                image={product.images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
            </Card>
            {product.images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                {product.images.map((image, index) => (
                  <Card
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    sx={{
                      minWidth: 80,
                      height: 80,
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid' : '1px solid',
                      borderColor: selectedImage === index ? 'primary.main' : 'grey.300',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="80"
                      image={image}
                      alt={`${product.name} ${index + 1}`}
                      sx={{ objectFit: 'cover' }}
                    />
                  </Card>
                ))}
              </Box>
            )}
          </Box>

          {/* Product Info */}
          <Box sx={{ p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={product.category.name}
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                {product.metadata.featured && (
                  <Chip
                    label="Featured"
                    color="warning"
                    variant="outlined"
                  />
                )}
              </Box>

              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                {product.name}
              </Typography>
              
              <Typography variant="h4" color="primary" sx={{ mb: 3, fontWeight: 'bold' }}>
                ${product.price}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {product.description}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Availability:
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color={product.stock > 0 ? 'success.main' : 'error.main'}
                    fontWeight="medium"
                  >
                    {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                  </Typography>
                </Box>

                {product.stock > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Quantity:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
                      <IconButton
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        size="small"
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography sx={{ px: 2, py: 1, minWidth: 40, textAlign: 'center' }}>
                        {quantity}
                      </Typography>
                      <IconButton
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.stock}
                        size="small"
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    variant="contained"
                    size="large"
                    startIcon={<CartIcon />}
                    sx={{ flex: 1 }}
                  >
                    Add to Cart - ${(product.price * quantity).toFixed(2)}
                  </Button>
                  <IconButton
                    size="large"
                    sx={{
                      border: 1,
                      borderColor: 'grey.300',
                      '&:hover': {
                        borderColor: 'primary.main',
                        color: 'primary.main'
                      }
                    }}
                  >
                    <FavoriteIcon />
                  </IconButton>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>SKU:</strong> {product.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Category:</strong> {product.category.name}
                </Typography>
              </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};
