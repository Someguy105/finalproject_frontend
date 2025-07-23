import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ShoppingCartOutlined,
  SearchOutlined,
  FilterListOutlined,
} from '@mui/icons-material';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';
import { formatCurrency } from '../utils';
import { useCart } from '../contexts/CartContext';
import { t } from '../utils';

export const Products: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState('all');
  const itemsPerPage = 12;

  const { products, loading, error } = useProducts();
  const { addItem } = useCart();

  // Ensure products is always an array
  const productList = Array.isArray(products) ? products : [];

  // Filter and sort products
  const filteredProducts = productList.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || product.category.name.toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = Array.from(new Set(products?.map((p: Product) => p.category.name) || []));

  const addToCart = (product: Product) => {
    addItem(product, 1);
    // Optional: Show a snackbar or notification
    console.log('Added to cart:', product.name);
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {t('errorLoadingProducts')}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            {t('ourProducts')}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {t('discoverCollection')}
          </Typography>
        </Box>

        {/* Filters and Search */}
        <Box sx={{ mb: 4 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ md: 'center' }}
            justifyContent="space-between"
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flex: 1 }}>
              <TextField
                placeholder={t('searchProducts')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchOutlined sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ minWidth: 300 }}
              />
              
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>{t('category')}</InputLabel>
                <Select
                  value={category}
                  label={t('category')}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value="all">{t('allCategories')}</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>{t('sortBy')}</InputLabel>
              <Select
                value={sortBy}
                label={t('sortBy')}
                onChange={(e) => setSortBy(e.target.value)}
                startAdornment={<FilterListOutlined sx={{ mr: 1 }} />}
              >
                <MenuItem value="name">{t('name')} A-Z</MenuItem>
                <MenuItem value="price-low">{t('priceLowToHigh')}</MenuItem>
                <MenuItem value="price-high">{t('priceHighToLow')}</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {filteredProducts.length} {t('productsFound')}
            </Typography>
            {searchTerm && (
              <Chip
                label={`Search: "${searchTerm}"`}
                onDelete={() => setSearchTerm('')}
                color="primary"
                variant="outlined"
              />
            )}
            {category !== 'all' && (
              <Chip
                label={`Category: ${category}`}
                onDelete={() => setCategory('all')}
                color="secondary"
                variant="outlined"
              />
            )}
          </Box>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Products Grid */}
        {!loading && (
          <>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: 3,
                mb: 6,
              }}
            >
              {paginatedProducts.map((product: Product) => (
                <Card
                  key={product.id}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      height: 200,
                      bgcolor: 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <Typography variant="h4" color="text.secondary">
                        📦
                      </Typography>
                    )}
                    {product.metadata.featured && (
                      <Chip
                        label="Featured"
                        color="secondary"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                        }}
                      />
                    )}
                  </CardMedia>
                  
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography variant="h6" component="h3" gutterBottom noWrap>
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product.description}
                    </Typography>
                    
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Chip
                        label={product.category.name}
                        variant="outlined"
                        size="small"
                        color="primary"
                      />
                      <Typography
                        variant="body2"
                        color={product.stock > 0 ? 'success.main' : 'error.main'}
                        fontWeight="medium"
                      >
                        {product.stock > 0 ? `${product.stock} ${t('inStock')}` : t('outOfStock')}
                      </Typography>
                    </Stack>
                    
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        {formatCurrency(product.price)}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/products/${product.id}`);
                          }}
                          sx={{ minWidth: 'auto' }}
                        >
                          {t('details')}
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<ShoppingCartOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          disabled={product.stock === 0}
                          sx={{ minWidth: 'auto' }}
                        >
                          {t('addToCart')}
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* No products found */}
            {paginatedProducts.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h5" gutterBottom>
                  {t('noProductsFound')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t('tryAdjustingSearch')}
                </Typography>
              </Box>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Products;
