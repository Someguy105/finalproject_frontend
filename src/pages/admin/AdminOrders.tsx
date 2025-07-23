import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  ShoppingCart
} from '@mui/icons-material';
import { orderApi } from '../../api/orders';
import { OrderStatus, PaymentStatus } from '../../types';

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  currency: string;
  createdAt: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Load data from backend
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await orderApi.getOrders();
        
        const mappedOrders = ordersData.map(order => ({
          id: order.id.toString(),
          orderNumber: order.orderNumber,
          userId: order.userId.toString(),
          status: order.status,
          paymentStatus: order.paymentStatus,
          totalAmount: Number(order.totalAmount) || 0,
          currency: order.currency,
          createdAt: new Date(order.createdAt).toISOString().split('T')[0]
        }));

        setOrders(mappedOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
        setSnackbar({ 
          open: true, 
          message: 'Error loading orders from server', 
          severity: 'error' 
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('¿Confirmar eliminación del pedido?')) {
      try {
        // Note: The backend doesn't have a delete order endpoint, so we'll just remove from UI
        setOrders(orders.filter(order => order.id !== orderId));
        setSnackbar({ open: true, message: 'Pedido eliminado', severity: 'success' });
      } catch (error) {
        console.error('Error deleting order:', error);
        setSnackbar({ open: true, message: 'Error deleting order', severity: 'error' });
      }
    }
  };

  const handleSaveOrder = async () => {
    if (!selectedOrder) return;

    try {
      if (selectedOrder.id === 'new') {
        // Create new order - simplified for demo
        const newOrderData = {
          userId: parseInt(selectedOrder.userId),
          orderNumber: selectedOrder.orderNumber,
          subtotal: selectedOrder.totalAmount,
          taxAmount: 0,
          shippingAmount: 0,
          discountAmount: 0,
          totalAmount: selectedOrder.totalAmount,
          currency: selectedOrder.currency || 'USD'
        };
        
        const createdOrder = await orderApi.createOrder(newOrderData);
        const mappedOrder = {
          id: createdOrder.id.toString(),
          orderNumber: createdOrder.orderNumber,
          userId: createdOrder.userId.toString(),
          status: createdOrder.status,
          paymentStatus: createdOrder.paymentStatus,
          totalAmount: Number(createdOrder.totalAmount) || 0,
          currency: createdOrder.currency,
          createdAt: new Date(createdOrder.createdAt).toISOString().split('T')[0]
        };
        
        setOrders([...orders, mappedOrder]);
        setSnackbar({ open: true, message: 'Pedido creado', severity: 'success' });
      } else {
        // Update existing order
        const updateData = {
          status: selectedOrder.status,
          paymentStatus: selectedOrder.paymentStatus
        };
        
        const updatedOrder = await orderApi.updateOrder(selectedOrder.id, updateData);
        const mappedOrder = {
          id: updatedOrder.id.toString(),
          orderNumber: updatedOrder.orderNumber,
          userId: updatedOrder.userId.toString(),
          status: updatedOrder.status,
          paymentStatus: updatedOrder.paymentStatus,
          totalAmount: Number(updatedOrder.totalAmount) || 0,
          currency: updatedOrder.currency,
          createdAt: new Date(updatedOrder.createdAt).toISOString().split('T')[0]
        };
        
        setOrders(orders.map(order => 
          order.id === selectedOrder.id ? mappedOrder : order
        ));
        setSnackbar({ open: true, message: 'Pedido actualizado', severity: 'success' });
      }
    } catch (error) {
      console.error('Error saving order:', error);
      setSnackbar({ open: true, message: 'Error saving order', severity: 'error' });
    }
    
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleAddOrder = () => {
    setSelectedOrder({
      id: 'new',
      orderNumber: `ORD-${Date.now()}`,
      userId: '',
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      totalAmount: 0,
      currency: 'USD',
      createdAt: ''
    });
    setOpenDialog(true);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'warning';
      case OrderStatus.PROCESSING: return 'info';
      case OrderStatus.SHIPPED: return 'primary';
      case OrderStatus.DELIVERED: return 'success';
      case OrderStatus.CANCELLED: return 'error';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING: return 'warning';
      case PaymentStatus.COMPLETED: return 'success';
      case PaymentStatus.FAILED: return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Pedidos
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddOrder}
          >
            Agregar Pedido
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Número de Pedido</TableCell>
                <TableCell>Usuario ID</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Estado de Pago</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="center">Fecha</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ShoppingCart color="primary" />
                        <Typography variant="subtitle2" fontWeight="medium">
                          {order.orderNumber}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {order.userId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        size="small"
                        color={getStatusColor(order.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.paymentStatus}
                        size="small"
                        color={getPaymentStatusColor(order.paymentStatus)}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">
                        {order.currency} {(parseFloat(order.totalAmount?.toString() || '0') || 0).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {order.createdAt}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleEditOrder(order)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteOrder(order.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Order Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedOrder?.id === 'new' ? 'Agregar Pedido' : 'Editar Pedido'}
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Número de Pedido"
                fullWidth
                value={selectedOrder.orderNumber}
                onChange={(e) => setSelectedOrder({
                  ...selectedOrder,
                  orderNumber: e.target.value
                })}
                disabled={selectedOrder.id !== 'new'}
              />
              
              <TextField
                label="ID de Usuario"
                fullWidth
                type="number"
                value={selectedOrder.userId}
                onChange={(e) => setSelectedOrder({
                  ...selectedOrder,
                  userId: e.target.value
                })}
              />
              
              <FormControl fullWidth>
                <InputLabel>Estado del Pedido</InputLabel>
                <Select
                  value={selectedOrder.status}
                  onChange={(e) => setSelectedOrder({
                    ...selectedOrder,
                    status: e.target.value as OrderStatus
                  })}
                  label="Estado del Pedido"
                >
                  <MenuItem value={OrderStatus.PENDING}>Pendiente</MenuItem>
                  <MenuItem value={OrderStatus.PROCESSING}>Procesando</MenuItem>
                  <MenuItem value={OrderStatus.SHIPPED}>Enviado</MenuItem>
                  <MenuItem value={OrderStatus.DELIVERED}>Entregado</MenuItem>
                  <MenuItem value={OrderStatus.CANCELLED}>Cancelado</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Estado de Pago</InputLabel>
                <Select
                  value={selectedOrder.paymentStatus}
                  onChange={(e) => setSelectedOrder({
                    ...selectedOrder,
                    paymentStatus: e.target.value as PaymentStatus
                  })}
                  label="Estado de Pago"
                >
                  <MenuItem value={PaymentStatus.PENDING}>Pendiente</MenuItem>
                  <MenuItem value={PaymentStatus.COMPLETED}>Completado</MenuItem>
                  <MenuItem value={PaymentStatus.FAILED}>Fallido</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Total"
                type="number"
                value={selectedOrder.totalAmount}
                onChange={(e) => setSelectedOrder({
                  ...selectedOrder,
                  totalAmount: parseFloat(e.target.value) || 0
                })}
              />
              
              <TextField
                label="Moneda"
                fullWidth
                value={selectedOrder.currency}
                onChange={(e) => setSelectedOrder({
                  ...selectedOrder,
                  currency: e.target.value
                })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveOrder}
            variant="contained"
            disabled={!selectedOrder?.orderNumber || !selectedOrder?.userId}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminOrders;
