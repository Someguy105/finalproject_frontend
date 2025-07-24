import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  Divider,
  InputAdornment,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Skeleton,
  Snackbar,
  IconButton,
} from '@mui/material';
import {
  ShoppingBagOutlined,
  SearchOutlined,
  FilterListOutlined,
  LocalShippingOutlined,
  CheckCircleOutlined,
  PendingOutlined,
  CancelOutlined,
  RefreshOutlined,
  VisibilityOutlined,
  NotificationsOutlined,
  CloseOutlined,
} from '@mui/icons-material';
import { useMyOrders } from '../hooks/useOrders';
import { formatCurrency } from '../utils';
import { OrderStatus, PaymentStatus } from '../types';

const CustomerOrders: React.FC = () => {
  const { orders, loading, error, refetch } = useMyOrders();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });
  
  // Auto-refresh orders every 60 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [refetch]);
  
  // Handle manual refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      console.log("Manual refresh requested");
      await refetch();
      // Simular tiempo de procesamiento para dar feedback visual
      setTimeout(() => {
        setNotification({ show: true, message: 'Pedidos actualizados correctamente' });
        setRefreshing(false);
      }, 800);
    } catch (e) {
      console.error("Error refreshing orders:", e);
      setNotification({ show: true, message: 'Error al actualizar pedidos' });
      setRefreshing(false);
    }
  }, [refetch]);

  // Verificar la presencia de órdenes específicas para customer@test.com
  useEffect(() => {
    if (orders && orders.length > 0) {
      // Registrar todas las órdenes para debugging
      console.log("All orders:", orders.map(o => ({ id: o.id, orderNumber: o.orderNumber })));
      
      // Verificar específicamente órdenes con ID 5 y 6
      const order5 = orders.find(o => o.id === '5');
      const order6 = orders.find(o => o.id === '6');
      
      console.log("Specific orders check:", { 
        "order5": order5 ? "Found" : "Not found", 
        "order6": order6 ? "Found" : "Not found"
      });
    }
  }, [orders]);
  
  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    console.log("Filtering orders:", orders);
    let filtered = orders.filter(order => {
      // Asegurar que tenemos valores string para búsqueda
      const orderNumber = order.orderNumber?.toString().toLowerCase() || '';
      const orderId = order.id?.toString().toLowerCase() || '';
      
      const matchesSearch = !searchTerm || 
                          orderNumber.includes(searchTerm.toLowerCase()) ||
                          orderId.includes(searchTerm.toLowerCase());
                          
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      // Registro para depuración
      if (order.id === '5' || order.id === '6' || order.id === '7' || order.id === '8') {
        console.log(`Order ${order.id} filtering:`, { 
          order, 
          matchesSearch, 
          matchesStatus,
          searchTerm,
          statusFilter
        });
      }
      
      return matchesSearch && matchesStatus;
    });

    // Sort orders
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'amount-high':
        filtered.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case 'amount-low':
        filtered.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
      default:
        break;
    }

    return filtered;
  }, [orders, searchTerm, statusFilter, sortBy]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleOutlined color="success" />;
      case 'shipped':
        return <LocalShippingOutlined color="info" />;
      case 'processing':
        return <PendingOutlined color="warning" />;
      case 'cancelled':
        return <CancelOutlined color="error" />;
      default:
        return <PendingOutlined />;
    }
  };

  const getStatusColor = (status: OrderStatus): 'success' | 'info' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderSummary = useMemo(() => {
    if (loading) {
      // Show skeleton placeholders while loading
      return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
            <Skeleton variant="text" sx={{ bgcolor: 'primary.light', height: 42 }} />
            <Skeleton variant="text" sx={{ bgcolor: 'primary.light', width: '80%', mx: 'auto', mt: 1 }} />
          </Paper>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
            <Skeleton variant="text" sx={{ bgcolor: 'success.light', height: 42 }} />
            <Skeleton variant="text" sx={{ bgcolor: 'success.light', width: '80%', mx: 'auto', mt: 1 }} />
          </Paper>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'info.main', color: 'white' }}>
            <Skeleton variant="text" sx={{ bgcolor: 'info.light', height: 42 }} />
            <Skeleton variant="text" sx={{ bgcolor: 'info.light', width: '80%', mx: 'auto', mt: 1 }} />
          </Paper>
        </Box>
      );
    }

    if (orders.length === 0) return null;

    // Asegurar que el totalAmount es un número y que se calcula correctamente
    const totalSpent = orders.reduce((sum, order) => {
      const amount = typeof order.totalAmount === 'number' ? order.totalAmount : 
                    parseFloat(order.totalAmount as any) || 0;
      return sum + amount;
    }, 0);
    
    console.log("Orders for total calculation:", orders.map(o => ({ id: o.id, amount: o.totalAmount })));
    console.log("Calculated total:", totalSpent);
    
    const deliveredOrders = orders.filter(order => order.status === OrderStatus.DELIVERED).length;
    const pendingOrders = orders.filter(order => [OrderStatus.PENDING, OrderStatus.PROCESSING].includes(order.status)).length;

    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white', boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold">
            {orders.length}
          </Typography>
          <Typography variant="body2">Total Pedidos</Typography>
        </Paper>
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.main', color: 'white', boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold">
            {formatCurrency(totalSpent)}
          </Typography>
          <Typography variant="body2">Total Gastado</Typography>
        </Paper>
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'info.main', color: 'white', boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold">
            {deliveredOrders}
          </Typography>
          <Typography variant="body2">Pedidos Entregados</Typography>
        </Paper>
      </Box>
    );
  }, [orders, loading]);

  // Loading state is now handled inline in the main return for better UX

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with Refresh Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
            Mis Pedidos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Seguimiento y gestión del historial de pedidos
          </Typography>
        </Box>
        
        <Button 
          variant="outlined" 
          color="primary"
          startIcon={refreshing ? <CircularProgress size={16} color="inherit" /> : <RefreshOutlined />}
          onClick={handleRefresh}
          disabled={refreshing || loading}
        >
          {refreshing ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 4 }}
          action={
            <Button color="inherit" size="small" onClick={refetch}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && !error && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Cargando pedidos...
          </Typography>
        </Box>
      )}

      {!loading && orders.length > 0 && getOrderSummary}

      {/* Filters and Search */}
      {!loading && orders.length > 0 && (
        <Paper sx={{ p: 3, mb: 4, boxShadow: 2, borderRadius: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              placeholder="Buscar pedidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1 }}
              size="small"
            />
            
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Estado"
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="pending">Pendiente</MenuItem>
                <MenuItem value="processing">En proceso</MenuItem>
                <MenuItem value="shipped">Enviado</MenuItem>
                <MenuItem value="delivered">Entregado</MenuItem>
                <MenuItem value="cancelled">Cancelado</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Ordenar por"
              >
                <MenuItem value="newest">Más recientes</MenuItem>
                <MenuItem value="oldest">Más antiguos</MenuItem>
                <MenuItem value="amount-high">Mayor precio</MenuItem>
                <MenuItem value="amount-low">Menor precio</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Paper>
      )}

      {/* Orders List */}
      {!loading && filteredOrders.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, boxShadow: 3 }}>
          <ShoppingBagOutlined sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.7 }} />
          <Typography variant="h5" gutterBottom fontWeight="medium">
            {orders.length === 0 ? 'No tienes pedidos aún' : 'No hay pedidos que coincidan con tus filtros'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {orders.length === 0 
              ? '¡Comienza a comprar para ver tus pedidos aquí!'
              : 'Intenta ajustar tus criterios de búsqueda o filtros.'
            }
          </Typography>
          {orders.length === 0 && (
            <Button 
              variant="contained" 
              size="large"
              component={Link}
              to="/products"
              sx={{ px: 4, py: 1.2 }}
            >
              Ir a comprar
            </Button>
          )}
        </Paper>
      ) : (
        <Stack spacing={3}>
          {filteredOrders.map((order) => (
            <Card 
              key={order.id} 
              sx={{ 
                borderRadius: 2, 
                boxShadow: 2,
                '&:hover': { 
                  boxShadow: 6,
                  transform: 'translateY(-2px)' 
                }, 
                transition: 'all 0.2s ease-in-out',
                border: order.paymentStatus !== 'completed' ? '1px solid' : 'none',
                borderColor: 'warning.light'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { 
                    xs: '1fr', 
                    sm: 'repeat(2, 1fr)', 
                    md: '2fr 1fr 1fr 1fr 2fr' 
                  }, 
                  gap: 3, 
                  alignItems: 'center' 
                }}>
                  {/* Order Info */}
                  <Box>
                    <Stack spacing={1}>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        Pedido #{order.orderNumber || order.id.substring(0, 8)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {order.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(order.createdAt)}
                      </Typography>
                    </Stack>
                  </Box>

                  {/* Status */}
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {getStatusIcon(order.status)}
                      <Chip 
                        label={
                          order.status === OrderStatus.PENDING ? 'Pendiente' :
                          order.status === OrderStatus.PROCESSING ? 'En proceso' :
                          order.status === OrderStatus.SHIPPED ? 'Enviado' :
                          order.status === OrderStatus.DELIVERED ? 'Entregado' :
                          order.status === OrderStatus.CANCELLED ? 'Cancelado' :
                          String(order.status)
                        } 
                        color={getStatusColor(order.status)}
                        variant="outlined"
                        sx={{ fontWeight: 'medium' }}
                      />
                    </Stack>
                  </Box>

                  {/* Amount */}
                  <Box>
                    <Stack spacing={0.5}>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {formatCurrency(order.totalAmount)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'producto' : 'productos'}
                      </Typography>
                    </Stack>
                  </Box>

                  {/* Payment Status */}
                  <Box>
                    <Chip 
                      label={
                        order.paymentStatus === PaymentStatus.COMPLETED ? 'Pagado' :
                        order.paymentStatus === PaymentStatus.PENDING ? 'Pendiente' :
                        order.paymentStatus === PaymentStatus.FAILED ? 'Fallido' :
                        order.paymentStatus === PaymentStatus.REFUNDED ? 'Reembolsado' :
                        String(order.paymentStatus)
                      } 
                      color={order.paymentStatus === PaymentStatus.COMPLETED ? 'success' : 'warning'}
                      variant="filled"
                      size="small"
                    />
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityOutlined />}
                        onClick={() => navigate(`/orders/${order.id}`)}
                        color="primary"
                      >
                        Ver Detalles
                      </Button>
                      
                      {order.status === 'delivered' && (
                        <Button
                          variant="contained"
                          size="small"
                          color="secondary"
                          component={Link}
                          to="/reviews"
                          sx={{ minWidth: 'auto' }}
                        >
                          Valorar
                        </Button>
                      )}
                    </Stack>
                  </Box>
                </Box>

                {/* Order summary line */}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Pago: {
                      order.paymentMethod?.includes('credit_card') ? 'Tarjeta de Crédito' :
                      order.paymentMethod?.includes('paypal') ? 'PayPal' :
                      order.paymentMethod?.replace('_', ' ').toUpperCase() || 'N/A'
                    }
                  </Typography>
                  {order.shippingAddress && (
                    <Typography variant="body2" color="text.secondary">
                      Envío a: {order.shippingAddress.city}, {order.shippingAddress.state}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Quick Actions */}
      {!loading && orders.length > 0 && (
        <Paper sx={{ p: 3, mt: 4, bgcolor: 'grey.50', borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h6" gutterBottom fontWeight="medium">
            Acciones Rápidas
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              startIcon={<ShoppingBagOutlined />}
            >
              Continuar Comprando
            </Button>
            <Button
              component={Link}
              to="/reviews"
              variant="outlined"
              startIcon={<CheckCircleOutlined />}
            >
              Escribir Reseñas
            </Button>
            <Button
              variant="text"
              startIcon={<NotificationsOutlined />}
              component={Link}
              to="/account"
            >
              Notificaciones
            </Button>
          </Stack>
        </Paper>
      )}
      
      {/* Success notification */}
      <Snackbar
        open={notification.show}
        autoHideDuration={4000}
        onClose={() => setNotification({ show: false, message: '' })}
        message={notification.message}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setNotification({ show: false, message: '' })}
          >
            <CloseOutlined fontSize="small" />
          </IconButton>
        }
        sx={{ bottom: { xs: 90, sm: 24 } }}
      />
    </Container>
  );
};

export default CustomerOrders;
