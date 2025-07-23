import React, { useState } from 'react';
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
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Search,
  Edit,
  Visibility,
  LocalShipping,
  CheckCircle,
  Cancel,
  FilterList,
  Add,
  Delete,
  Save
} from '@mui/icons-material';
import { t } from '../../utils';

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  orderNumber: string;
  customer: {
    id: number;
    name: string;
    email: string;
  };
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      orderNumber: 'ORD-2025-001',
      customer: {
        id: 1,
        name: 'Tech Customer',
        email: 'customer1@example.com'
      },
      items: [
        { productId: 1, productName: 'Gaming Laptop Pro', quantity: 1, price: 2499.99 },
        { productId: 2, productName: 'Premium Wireless Headphones', quantity: 1, price: 299.99 }
      ],
      total: 2799.97,
      status: 'delivered',
      shippingAddress: {
        street: '123 Tech Street',
        city: 'Silicon Valley',
        state: 'CA',
        zipCode: '94025',
        country: 'USA'
      },
      createdAt: '2025-01-20',
      updatedAt: '2025-01-22'
    },
    {
      id: 2,
      orderNumber: 'ORD-2025-002',
      customer: {
        id: 2,
        name: 'Fashion Customer',
        email: 'customer2@example.com'
      },
      items: [
        { productId: 3, productName: 'Designer Winter Jacket', quantity: 1, price: 189.99 }
      ],
      total: 215.18,
      status: 'shipped',
      shippingAddress: {
        street: '456 Fashion Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      createdAt: '2025-01-19',
      updatedAt: '2025-01-21'
    },
    {
      id: 3,
      orderNumber: 'ORD-2025-003',
      customer: {
        id: 1,
        name: 'Tech Customer',
        email: 'customer1@example.com'
      },
      items: [
        { productId: 4, productName: 'Programming Complete Guide', quantity: 1, price: 49.99 }
      ],
      total: 59.98,
      status: 'pending',
      shippingAddress: {
        street: '789 Book Lane',
        city: 'Boston',
        state: 'MA',
        zipCode: '02101',
        country: 'USA'
      },
      createdAt: '2025-01-18',
      updatedAt: '2025-01-19'
    },
    {
      id: 4,
      orderNumber: 'ORD-2025-004',
      customer: {
        id: 2,
        name: 'Fashion Customer',
        email: 'customer2@example.com'
      },
      items: [
        { productId: 2, productName: 'Premium Wireless Headphones', quantity: 1, price: 299.99 }
      ],
      total: 298.99,
      status: 'processing',
      shippingAddress: {
        street: '321 Audio Drive',
        city: 'Nashville',
        state: 'TN',
        zipCode: '37201',
        country: 'USA'
      },
      createdAt: '2025-01-17',
      updatedAt: '2025-01-18'
    }
  ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Form data for create/edit
  const [formData, setFormData] = useState({
    orderNumber: '',
    customerName: '',
    customerEmail: '',
    items: [{ productName: '', quantity: 1, price: 0 }],
    status: 'pending' as Order['status'],
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleUpdateOrderStatus = (orderId: number, newStatus: Order['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
        : order
    ));
    setSnackbar({ open: true, message: `Estado del pedido actualizado a ${getStatusText(newStatus)}`, severity: 'success' });
  };

  // Reset form data
  const resetFormData = () => {
    setFormData({
      orderNumber: '',
      customerName: '',
      customerEmail: '',
      items: [{ productName: '', quantity: 1, price: 0 }],
      status: 'pending',
      shippingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    });
  };

  // Handle create order
  const handleCreateOrder = () => {
    const newOrder: Order = {
      id: Math.max(...orders.map(o => o.id)) + 1,
      orderNumber: formData.orderNumber || `ORD-${new Date().getFullYear()}-${String(Math.max(...orders.map(o => o.id)) + 1).padStart(3, '0')}`,
      customer: {
        id: Math.max(...orders.map(o => o.customer.id)) + 1,
        name: formData.customerName,
        email: formData.customerEmail
      },
      items: formData.items.map((item, index) => ({
        productId: index + 1,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price
      })),
      total: formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0),
      status: formData.status,
      shippingAddress: formData.shippingAddress,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setOrders([...orders, newOrder]);
    setOpenCreateDialog(false);
    resetFormData();
    setSnackbar({ open: true, message: 'Pedido creado exitosamente', severity: 'success' });
  };

  // Handle edit order
  const handleEditOrder = (order: Order) => {
    setFormData({
      orderNumber: order.orderNumber,
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      items: order.items.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price
      })),
      status: order.status,
      shippingAddress: order.shippingAddress
    });
    setSelectedOrder(order);
    setOpenEditDialog(true);
  };

  // Handle update order
  const handleUpdateOrder = () => {
    if (!selectedOrder) return;

    const updatedOrder: Order = {
      ...selectedOrder,
      orderNumber: formData.orderNumber,
      customer: {
        ...selectedOrder.customer,
        name: formData.customerName,
        email: formData.customerEmail
      },
      items: formData.items.map((item, index) => ({
        productId: selectedOrder.items[index]?.productId || index + 1,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price
      })),
      total: formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0),
      status: formData.status,
      shippingAddress: formData.shippingAddress,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setOrders(orders.map(order =>
      order.id === selectedOrder.id ? updatedOrder : order
    ));
    setOpenEditDialog(false);
    resetFormData();
    setSelectedOrder(null);
    setSnackbar({ open: true, message: 'Pedido actualizado exitosamente', severity: 'success' });
  };

  // Handle delete order
  const handleDeleteOrder = (order: Order) => {
    setOrderToDelete(order);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteOrder = () => {
    if (!orderToDelete) return;

    setOrders(orders.filter(order => order.id !== orderToDelete.id));
    setOpenDeleteDialog(false);
    setOrderToDelete(null);
    setSnackbar({ open: true, message: 'Pedido eliminado exitosamente', severity: 'success' });
  };

  // Handle form changes
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value
      }
    }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productName: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'warning';
      case 'pending': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return t('completed');
      case 'shipped': return t('shipped');
      case 'processing': return 'Procesando';
      case 'pending': return t('pending');
      case 'cancelled': return t('cancelled');
      default: return status;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
        {t('manageOrders')}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenCreateDialog(true)}
            sx={{ minWidth: 150 }}
          >
            Crear Pedido
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              startAdornment={<FilterList />}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="pending">{t('pending')}</MenuItem>
              <MenuItem value="processing">Procesando</MenuItem>
              <MenuItem value="shipped">{t('shipped')}</MenuItem>
              <MenuItem value="delivered">{t('completed')}</MenuItem>
              <MenuItem value="cancelled">{t('cancelled')}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>{t('orderNumber')}</TableCell>
              <TableCell>{t('customer')}</TableCell>
              <TableCell>Artículos</TableCell>
              <TableCell>{t('orderTotal')}</TableCell>
              <TableCell>{t('orderStatus')}</TableCell>
              <TableCell>{t('orderDate')}</TableCell>
              <TableCell>{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {order.orderNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {order.customer.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.customer.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{order.items.length} artículo(s)</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      ${order.total.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(order.status)}
                      color={getStatusColor(order.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{order.createdAt}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={() => handleViewOrder(order)} size="small" title="Ver detalles">
                        <Visibility />
                      </IconButton>
                      <IconButton onClick={() => handleEditOrder(order)} size="small" color="primary" title="Editar pedido">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteOrder(order)} size="small" color="error" title="Eliminar pedido">
                        <Delete />
                      </IconButton>
                      {order.status === 'pending' && (
                        <IconButton 
                          onClick={() => handleUpdateOrderStatus(order.id, 'processing')} 
                          size="small" 
                          color="warning"
                          title="Marcar como procesando"
                        >
                          <Edit />
                        </IconButton>
                      )}
                      {order.status === 'processing' && (
                        <IconButton 
                          onClick={() => handleUpdateOrderStatus(order.id, 'shipped')} 
                          size="small" 
                          color="info"
                          title="Marcar como enviado"
                        >
                          <LocalShipping />
                        </IconButton>
                      )}
                      {order.status === 'shipped' && (
                        <IconButton 
                          onClick={() => handleUpdateOrderStatus(order.id, 'delivered')} 
                          size="small" 
                          color="success"
                          title="Marcar como entregado"
                        >
                          <CheckCircle />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Create Order Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Crear Nuevo Pedido</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* Customer Information */}
            <Typography variant="h6" gutterBottom>
              Información del Cliente
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                label="Número de Pedido"
                value={formData.orderNumber}
                onChange={(e) => handleFormChange('orderNumber', e.target.value)}
                placeholder="Se generará automáticamente si se deja vacío"
                fullWidth
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                label="Nombre del Cliente"
                value={formData.customerName}
                onChange={(e) => handleFormChange('customerName', e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Email del Cliente"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleFormChange('customerEmail', e.target.value)}
                required
                fullWidth
              />
            </Box>

            {/* Shipping Address */}
            <Typography variant="h6" gutterBottom>
              Dirección de Envío
            </Typography>
            <Box sx={{ mb: 3 }}>
              <TextField
                label="Calle"
                value={formData.shippingAddress.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Ciudad"
                  value={formData.shippingAddress.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Estado/Provincia"
                  value={formData.shippingAddress.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  fullWidth
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Código Postal"
                  value={formData.shippingAddress.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="País"
                  value={formData.shippingAddress.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  fullWidth
                />
              </Box>
            </Box>

            {/* Order Items */}
            <Typography variant="h6" gutterBottom>
              Artículos del Pedido
            </Typography>
            {formData.items.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <TextField
                  label="Nombre del Producto"
                  value={item.productName}
                  onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                  required
                  sx={{ flex: 2 }}
                />
                <TextField
                  label="Cantidad"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                  required
                  sx={{ flex: 1 }}
                  inputProps={{ min: 1 }}
                />
                <TextField
                  label="Precio"
                  type="number"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                  required
                  sx={{ flex: 1 }}
                  inputProps={{ min: 0, step: 0.01 }}
                />
                {formData.items.length > 1 && (
                  <IconButton onClick={() => removeItem(index)} color="error">
                    <Delete />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button onClick={addItem} startIcon={<Add />} sx={{ mb: 3 }}>
              Agregar Artículo
            </Button>

            {/* Order Status */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Estado del Pedido</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleFormChange('status', e.target.value)}
              >
                <MenuItem value="pending">Pendiente</MenuItem>
                <MenuItem value="processing">Procesando</MenuItem>
                <MenuItem value="shipped">Enviado</MenuItem>
                <MenuItem value="delivered">Entregado</MenuItem>
                <MenuItem value="cancelled">Cancelado</MenuItem>
              </Select>
            </FormControl>

            {/* Order Total Preview */}
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6">
                Total: ${formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenCreateDialog(false); resetFormData(); }}>
            Cancelar
          </Button>
          <Button 
            onClick={handleCreateOrder} 
            variant="contained"
            disabled={!formData.customerName || !formData.customerEmail || formData.items.some(item => !item.productName)}
          >
            Crear Pedido
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Editar Pedido</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* Customer Information */}
            <Typography variant="h6" gutterBottom>
              Información del Cliente
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                label="Número de Pedido"
                value={formData.orderNumber}
                onChange={(e) => handleFormChange('orderNumber', e.target.value)}
                fullWidth
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                label="Nombre del Cliente"
                value={formData.customerName}
                onChange={(e) => handleFormChange('customerName', e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Email del Cliente"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleFormChange('customerEmail', e.target.value)}
                required
                fullWidth
              />
            </Box>

            {/* Shipping Address */}
            <Typography variant="h6" gutterBottom>
              Dirección de Envío
            </Typography>
            <Box sx={{ mb: 3 }}>
              <TextField
                label="Calle"
                value={formData.shippingAddress.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Ciudad"
                  value={formData.shippingAddress.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Estado/Provincia"
                  value={formData.shippingAddress.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  fullWidth
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Código Postal"
                  value={formData.shippingAddress.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="País"
                  value={formData.shippingAddress.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  fullWidth
                />
              </Box>
            </Box>

            {/* Order Items */}
            <Typography variant="h6" gutterBottom>
              Artículos del Pedido
            </Typography>
            {formData.items.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <TextField
                  label="Nombre del Producto"
                  value={item.productName}
                  onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                  required
                  sx={{ flex: 2 }}
                />
                <TextField
                  label="Cantidad"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                  required
                  sx={{ flex: 1 }}
                  inputProps={{ min: 1 }}
                />
                <TextField
                  label="Precio"
                  type="number"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                  required
                  sx={{ flex: 1 }}
                  inputProps={{ min: 0, step: 0.01 }}
                />
                {formData.items.length > 1 && (
                  <IconButton onClick={() => removeItem(index)} color="error">
                    <Delete />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button onClick={addItem} startIcon={<Add />} sx={{ mb: 3 }}>
              Agregar Artículo
            </Button>

            {/* Order Status */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Estado del Pedido</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleFormChange('status', e.target.value)}
              >
                <MenuItem value="pending">Pendiente</MenuItem>
                <MenuItem value="processing">Procesando</MenuItem>
                <MenuItem value="shipped">Enviado</MenuItem>
                <MenuItem value="delivered">Entregado</MenuItem>
                <MenuItem value="cancelled">Cancelado</MenuItem>
              </Select>
            </FormControl>

            {/* Order Total Preview */}
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6">
                Total: ${formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenEditDialog(false); resetFormData(); setSelectedOrder(null); }}>
            Cancelar
          </Button>
          <Button 
            onClick={handleUpdateOrder} 
            variant="contained"
            disabled={!formData.customerName || !formData.customerEmail || formData.items.some(item => !item.productName)}
          >
            Actualizar Pedido
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar el pedido {orderToDelete?.orderNumber}? 
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={confirmDeleteOrder} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Detail Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Detalles del Pedido {selectedOrder?.orderNumber}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ pt: 2 }}>
              {/* Customer Info */}
              <Typography variant="h6" gutterBottom>
                Información del Cliente
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography><strong>Nombre:</strong> {selectedOrder.customer.name}</Typography>
                <Typography><strong>Email:</strong> {selectedOrder.customer.email}</Typography>
              </Box>

              {/* Shipping Address */}
              <Typography variant="h6" gutterBottom>
                Dirección de Envío
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography>{selectedOrder.shippingAddress.street}</Typography>
                <Typography>
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                </Typography>
                <Typography>{selectedOrder.shippingAddress.country}</Typography>
              </Box>

              {/* Order Items */}
              <Typography variant="h6" gutterBottom>
                Artículos del Pedido
              </Typography>
              <List>
                {selectedOrder.items.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={item.productName}
                        secondary={`Cantidad: ${item.quantity} × $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`}
                      />
                    </ListItem>
                    {index < selectedOrder.items.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>

              {/* Order Summary */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="h6">
                  Total del Pedido: ${selectedOrder.total.toFixed(2)}
                </Typography>
                <Typography>
                  Estado: <Chip 
                    label={getStatusText(selectedOrder.status)} 
                    color={getStatusColor(selectedOrder.status) as any} 
                    size="small" 
                  />
                </Typography>
                <Typography>Creado: {selectedOrder.createdAt}</Typography>
                <Typography>Actualizado: {selectedOrder.updatedAt}</Typography>
              </Box>

              {/* Status Update */}
              {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Actualizar Estado
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedOrder.status === 'pending' && (
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        onClick={() => {
                          handleUpdateOrderStatus(selectedOrder.id, 'processing');
                          setOpenDialog(false);
                        }}
                      >
                        Marcar como Procesando
                      </Button>
                    )}
                    {selectedOrder.status === 'processing' && (
                      <Button
                        variant="contained"
                        color="info"
                        size="small"
                        startIcon={<LocalShipping />}
                        onClick={() => {
                          handleUpdateOrderStatus(selectedOrder.id, 'shipped');
                          setOpenDialog(false);
                        }}
                      >
                        Marcar como Enviado
                      </Button>
                    )}
                    {selectedOrder.status === 'shipped' && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckCircle />}
                        onClick={() => {
                          handleUpdateOrderStatus(selectedOrder.id, 'delivered');
                          setOpenDialog(false);
                        }}
                      >
                        Marcar como Entregado
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Cancel />}
                      onClick={() => {
                        handleUpdateOrderStatus(selectedOrder.id, 'cancelled');
                        setOpenDialog(false);
                      }}
                    >
                      Cancelar Pedido
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
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
