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
  Avatar
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Add,
  Image as ImageIcon
} from '@mui/icons-material';
import { t } from '../../utils';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: {
    id: number;
    name: string;
  };
  image: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Gaming Laptop Pro',
      description: 'High-performance gaming laptop with RTX 4080 graphics card, 32GB RAM, and 1TB SSD',
      price: 2499.99,
      stock: 25,
      category: { id: 1, name: 'Electronics' },
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500',
      status: 'active',
      createdAt: '2025-01-15'
    },
    {
      id: 2,
      name: 'Premium Wireless Headphones',
      description: 'Noise-cancelling over-ear headphones with 30-hour battery life',
      price: 299.99,
      stock: 50,
      category: { id: 1, name: 'Electronics' },
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      status: 'active',
      createdAt: '2025-01-16'
    },
    {
      id: 3,
      name: 'Designer Winter Jacket',
      description: 'Premium waterproof winter jacket with down insulation',
      price: 189.99,
      stock: 30,
      category: { id: 2, name: 'Clothing' },
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
      status: 'active',
      createdAt: '2025-01-17'
    },
    {
      id: 4,
      name: 'Programming Complete Guide',
      description: 'Comprehensive guide to modern web development and programming languages',
      price: 49.99,
      stock: 100,
      category: { id: 3, name: 'Books' },
      image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500',
      status: 'active',
      createdAt: '2025-01-18'
    }
  ]);

  const [categories] = useState<Category[]>([
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' },
    { id: 3, name: 'Books' },
    { id: 4, name: 'Home & Garden' }
  ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category.id.toString() === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm(t('confirmDelete'))) {
      setProducts(products.filter(product => product.id !== productId));
      setSnackbar({ open: true, message: t('itemDeleted'), severity: 'success' });
    }
  };

  const handleSaveProduct = () => {
    if (selectedProduct) {
      if (selectedProduct.id) {
        // Update existing product
        setProducts(products.map(product => 
          product.id === selectedProduct.id ? selectedProduct : product
        ));
        setSnackbar({ open: true, message: t('itemUpdated'), severity: 'success' });
      } else {
        // Create new product
        const newProduct = { 
          ...selectedProduct, 
          id: Math.max(...products.map(p => p.id)) + 1,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setProducts([...products, newProduct]);
        setSnackbar({ open: true, message: t('itemCreated'), severity: 'success' });
      }
    }
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleAddProduct = () => {
    setSelectedProduct({
      id: 0,
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: { id: 1, name: 'Electronics' },
      image: '',
      status: 'active',
      createdAt: ''
    });
    setOpenDialog(true);
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'error';
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'error';
    if (stock < 10) return 'warning';
    return 'success';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" color="primary">
          {t('manageProducts')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddProduct}
        >
          {t('addProduct')}
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gaps: 2, alignItems: 'center' }}>
          <TextField
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, mr: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>{t('category')}</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="all">{t('allCategories')}</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>{t('productName')}</TableCell>
              <TableCell>{t('category')}</TableCell>
              <TableCell>{t('price')}</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha Creación</TableCell>
              <TableCell>{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>
                    <Avatar 
                      src={product.image} 
                      sx={{ width: 40, height: 40 }} 
                      variant="rounded"
                    >
                      <ImageIcon />
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200, display: 'block' }}>
                        {product.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.stock}
                      color={getStockColor(product.stock) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.status === 'active' ? t('active') : t('inactive')}
                      color={getStatusColor(product.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{product.createdAt}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditProduct(product)} size="small">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteProduct(product.id)} size="small" color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Edit/Add Product Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProduct?.id ? t('editProduct') : t('addProduct')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label={t('productName')}
                value={selectedProduct?.name || ''}
                onChange={(e) => setSelectedProduct(prev => prev ? { ...prev, name: e.target.value } : null)}
                fullWidth
              />
              <TextField
                label={t('productDescription')}
                value={selectedProduct?.description || ''}
                onChange={(e) => setSelectedProduct(prev => prev ? { ...prev, description: e.target.value } : null)}
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                label="URL de Imagen"
                value={selectedProduct?.image || ''}
                onChange={(e) => setSelectedProduct(prev => prev ? { ...prev, image: e.target.value } : null)}
                fullWidth
                placeholder="https://ejemplo.com/imagen.jpg"
                helperText="Introduce la URL de la imagen del producto"
              />
              {/* Image Preview */}
              {selectedProduct?.image && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Vista previa de la imagen:
                  </Typography>
                  <Avatar
                    src={selectedProduct.image}
                    sx={{ width: 100, height: 100 }}
                    variant="rounded"
                  >
                    <ImageIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                </Box>
              )}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label={t('productPrice')}
                  type="number"
                  value={selectedProduct?.price || 0}
                  onChange={(e) => setSelectedProduct(prev => prev ? { ...prev, price: parseFloat(e.target.value) } : null)}
                  fullWidth
                />
                <TextField
                  label={t('productStock')}
                  type="number"
                  value={selectedProduct?.stock || 0}
                  onChange={(e) => setSelectedProduct(prev => prev ? { ...prev, stock: parseInt(e.target.value) } : null)}
                  fullWidth
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>{t('productCategory')}</InputLabel>
                  <Select
                    value={selectedProduct?.category.id || 1}
                    onChange={(e) => {
                      const categoryId = e.target.value as number;
                      const category = categories.find(c => c.id === categoryId);
                      if (category) {
                        setSelectedProduct(prev => prev ? { ...prev, category } : null);
                      }
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={selectedProduct?.status || 'active'}
                    onChange={(e) => setSelectedProduct(prev => prev ? { ...prev, status: e.target.value as 'active' | 'inactive' } : null)}
                  >
                    <MenuItem value="active">{t('active')}</MenuItem>
                    <MenuItem value="inactive">{t('inactive')}</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>{t('cancel')}</Button>
          <Button onClick={handleSaveProduct} variant="contained">{t('save')}</Button>
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

export default AdminProducts;
