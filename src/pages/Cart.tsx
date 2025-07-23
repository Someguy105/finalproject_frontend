import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  Button,
  IconButton,
  TextField,
  Divider,
  Alert,
  Paper,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  DeleteOutlined,
  AddOutlined,
  RemoveOutlined,
  ShoppingCartCheckoutOutlined,
  ArrowBackOutlined,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, t } from '../utils';

interface CheckoutFormData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  paymentMethod: string;
}

export const Cart: React.FC = () => {
  const { items, totalItems, totalAmount, removeItem, updateQuantity, clearCart, checkout } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    paymentMethod: 'credit_card',
  });

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError('');

    try {
      const orderId = await checkout({
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      }, formData.paymentMethod);

      setCheckoutSuccess(true);
      setTimeout(() => {
        setCheckoutDialogOpen(false);
        navigate(`/orders/${orderId}`);
      }, 2000);
    } catch (error: any) {
      setCheckoutError(error.message || t('checkoutFailed'));
    } finally {
      setCheckoutLoading(false);
    }
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.08; // 8% tax rate
  };

  const calculateShipping = (subtotal: number) => {
    return subtotal > 100 ? 0 : 9.99; // Free shipping over $100
  };

  const subtotal = totalAmount;
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const finalTotal = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            {t('yourCartIsEmpty')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {t('noItemsInCart')}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            startIcon={<ArrowBackOutlined />}
          >
            {t('continueShopping')}
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          {t('shoppingCart')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {totalItems} {totalItems === 1 ? t('item') : t('items')} {t('itemsInCart')}
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
        {/* Cart Items */}
        <Box>
          <Stack spacing={2}>
            {items.map((item) => (
              <Card key={item.product.id} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 1 }}
                    image={item.product.images?.[0] || '/api/placeholder/120/120'}
                    alt={item.product.name}
                  />
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {item.product.description}
                    </Typography>
                    <Chip 
                      label={item.product.category.name} 
                      size="small" 
                      variant="outlined" 
                      sx={{ mb: 2 }}
                    />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        >
                          <RemoveOutlined />
                        </IconButton>
                        
                        <TextField
                          size="small"
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value) || 0)}
                          sx={{ width: 80 }}
                          inputProps={{ min: 1, max: item.product.stock }}
                        />
                        
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <AddOutlined />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6">
                          {formatCurrency(item.product.price * item.quantity)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatCurrency(item.product.price)} {t('each')}
                        </Typography>
                      </Box>
                      
                      <IconButton
                        color="error"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <DeleteOutlined />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/products')}
              startIcon={<ArrowBackOutlined />}
            >
              {t('continueShopping')}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={clearCart}
            >
              {t('clearCart')}
            </Button>
          </Box>
        </Box>

        {/* Order Summary */}
        <Paper sx={{ p: 3, height: 'fit-content', position: 'sticky', top: 20 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            {t('orderSummary')}
          </Typography>
          
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>{t('subtotal')} ({totalItems} {t('items')})</Typography>
              <Typography>{formatCurrency(subtotal)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>{t('tax')}</Typography>
              <Typography>{formatCurrency(tax)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>{t('shipping')}</Typography>
              <Typography>
                {shipping === 0 ? (
                  <Chip label={t('free').toUpperCase()} size="small" color="success" />
                ) : (
                  formatCurrency(shipping)
                )}
              </Typography>
            </Box>
            
            <Divider />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight="bold">
                {t('total')}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {formatCurrency(finalTotal)}
              </Typography>
            </Box>
          </Stack>

          {shipping > 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Agrega {formatCurrency(100 - subtotal)} más para envío gratuito!
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => setCheckoutDialogOpen(true)}
            startIcon={<ShoppingCartCheckoutOutlined />}
            sx={{ py: 1.5 }}
          >
            {t('proceedToCheckout')}
          </Button>
        </Paper>
      </Box>

      {/* Checkout Dialog */}
      <Dialog open={checkoutDialogOpen} onClose={() => setCheckoutDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingCartCheckoutOutlined color="primary" />
            <Typography variant="h5" fontWeight="bold">
              {t('completeYourOrder')}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {checkoutSuccess ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                bgcolor: 'success.main', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}>
                <Typography variant="h3" color="white">✓</Typography>
              </Box>
              <Typography variant="h5" color="success.main" gutterBottom fontWeight="bold">
                {t('orderPlacedSuccessfully')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {t('thankYouForOrder')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('redirectingToOrder')}
              </Typography>
              <CircularProgress sx={{ mt: 2 }} />
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
              {/* Shipping Form */}
              <Stack spacing={3}>
                {checkoutError && (
                  <Alert severity="error">{checkoutError}</Alert>
                )}

                <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" color="primary.main">
                    📍 {t('shippingAddress')}
                  </Typography>
                  
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label={t('streetAddress')}
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      placeholder="123 Main Street"
                    />
                    
                    <TextField
                      fullWidth
                      label={t('city')}
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="Miami"
                    />
                    
                    <TextField
                      fullWidth
                      label={t('state')}
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      placeholder="Florida"
                    />
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <TextField
                        label={t('zipCode')}
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        placeholder="33101"
                      />
                      <TextField
                        label={t('country')}
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        placeholder="US"
                      />
                    </Box>
                  </Stack>
                </Paper>

                <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" color="primary.main">
                    💳 {t('paymentMethod')}
                  </Typography>
                  <TextField
                    fullWidth
                    select
                    label={t('paymentMethod')}
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    SelectProps={{ native: true }}
                  >
                    <option value="credit_card">{t('creditCard')}</option>
                    <option value="paypal">{t('paypal')}</option>
                    <option value="bank_transfer">{t('bankTransfer')}</option>
                  </TextField>
                </Paper>
              </Stack>

              {/* Order Summary */}
              <Paper sx={{ p: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200', height: 'fit-content' }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" color="primary.main">
                  📋 Order Summary
                </Typography>
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                    <Typography>Subtotal ({totalItems} items)</Typography>
                    <Typography fontWeight="500">{formatCurrency(subtotal)}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                    <Typography>Tax (8%)</Typography>
                    <Typography fontWeight="500">{formatCurrency(tax)}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
                    <Typography>Shipping</Typography>
                    <Typography fontWeight="500">
                      {shipping === 0 ? (
                        <Chip label="FREE" size="small" color="success" />
                      ) : (
                        formatCurrency(shipping)
                      )}
                    </Typography>
                  </Box>
                  
                  <Divider />
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    p: 2, 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    borderRadius: 1,
                    mt: 1
                  }}>
                    <Typography variant="h6" fontWeight="bold">
                      Total
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {formatCurrency(finalTotal)}
                    </Typography>
                  </Box>
                </Stack>

                {shipping > 0 && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    💡 Add {formatCurrency(100 - subtotal)} more for free shipping!
                  </Alert>
                )}
              </Paper>
            </Box>
          )}
        </DialogContent>
        
        {!checkoutSuccess && (
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={() => setCheckoutDialogOpen(false)} size="large">
              {t('cancel')}
            </Button>
            <Button
              variant="contained"
              onClick={handleCheckout}
              disabled={checkoutLoading || !formData.street || !formData.city || !formData.state || !formData.zipCode}
              size="large"
              sx={{ px: 4 }}
            >
              {checkoutLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} />
                  {t('processing')}...
                </Box>
              ) : (
                t('placeOrder')
              )}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Container>
  );
};

export default Cart;
