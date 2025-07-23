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
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Add,
  Image as ImageIcon
} from '@mui/icons-material';
import { t } from '../../utils';
import { productApi, categoryApi } from '../../api/products';
import { Product as BackendProduct, Category as BackendCategory } from '../../types';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: {
    id: string;
    name: string;
  };
  image: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productApi.getProducts(),
          categoryApi.getCategories()
        ]);
        
        console.log('Products data from backend:', productsData);
        console.log('Categories data from backend:', categoriesData);
        
        // Map backend data to frontend format
        const mappedProducts = productsData.map(product => {
          // Find the category for this product
          let productCategory = { id: '1', name: 'Electronics' }; // Default fallback
          
          if (product.category && typeof product.category === 'object') {
            // Category is already populated
            productCategory = {
              id: product.category.id?.toString() || '1',
              name: product.category.name || 'Unknown Category'
            };
          }

          // Map the status correctly from backend
          let productStatus: 'active' | 'inactive' = 'active';
          if (product.hasOwnProperty('isAvailable')) {
            productStatus = (product as any).isAvailable ? 'active' : 'inactive';
            console.log(`Product ${product.name} - isAvailable: ${(product as any).isAvailable}, mapped status: ${productStatus}`);
          } else if (product.metadata?.featured !== undefined) {
            productStatus = product.metadata.featured ? 'active' : 'inactive';
            console.log(`Product ${product.name} - metadata.featured: ${product.metadata.featured}, mapped status: ${productStatus}`);
          }

          return {
            id: product.id?.toString() || 'unknown',
            name: product.name || 'Unknown Product',
            description: product.description || '',
            price: typeof product.price === 'string' ? parseFloat(product.price) : product.price || 0,
            stock: typeof product.stock === 'string' ? parseInt(product.stock) : product.stock || 0,
            category: productCategory,
            image: product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500',
            status: productStatus,
            createdAt: product.createdAt ? new Date(product.createdAt).toISOString().split('T')[0] : ''
          };
        });

        const mappedCategories = categoriesData.map(category => ({
          id: category.id?.toString() || 'unknown',
          name: category.name || 'Unknown Category'
        }));

        console.log('Mapped products:', mappedProducts);
        console.log('Mapped categories:', mappedCategories);

        setProducts(mappedProducts);
        setCategories(mappedCategories);
      } catch (error) {
        console.error('Error loading data:', error);
        setSnackbar({ 
          open: true, 
          message: 'Error loading data from server: ' + (error as Error).message, 
          severity: 'error' 
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este producto?')) {
      try {
        console.log('Deleting product with ID:', productId);
        await productApi.deleteProduct(productId);
        setProducts(products.filter(product => product.id !== productId));
        setSnackbar({ open: true, message: 'Producto eliminado exitosamente', severity: 'success' });
      } catch (error) {
        console.error('Error deleting product:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setSnackbar({ open: true, message: 'Error eliminando producto: ' + errorMessage, severity: 'error' });
      }
    }
  };

  const handleSaveProduct = async () => {
    if (!selectedProduct) return;

    try {
      if (selectedProduct.id === 'new') {
        // Create new product - using correct format for backend
        const newProductData = {
          name: selectedProduct.name,
          description: selectedProduct.description,
          price: selectedProduct.price.toString(), // Backend expects string
          stock: selectedProduct.stock,
          images: selectedProduct.image ? [selectedProduct.image] : [],
          categoryId: parseInt(selectedProduct.category.id), // Backend expects number
          isAvailable: selectedProduct.status === 'active', // Send isAvailable instead of metadata.featured
          metadata: {
            featured: selectedProduct.status === 'active'
          }
        };
        
        console.log('Creating product with data:', newProductData);
        
        const createdProduct = await productApi.createProduct(newProductData as any);
        
        console.log('Created product response:', createdProduct);
        
        // Map the response back to frontend format
        let createdStatus: 'active' | 'inactive' = 'active';
        if (createdProduct.hasOwnProperty('isAvailable')) {
          createdStatus = (createdProduct as any).isAvailable ? 'active' : 'inactive';
        } else if (createdProduct.metadata?.featured !== undefined) {
          createdStatus = createdProduct.metadata.featured ? 'active' : 'inactive';
        }
        
        const mappedProduct = {
          id: createdProduct.id?.toString() || 'unknown',
          name: createdProduct.name || 'Unknown Product',
          description: createdProduct.description || '',
          price: typeof createdProduct.price === 'string' ? parseFloat(createdProduct.price) : createdProduct.price || 0,
          stock: typeof createdProduct.stock === 'string' ? parseInt(createdProduct.stock) : createdProduct.stock || 0,
          category: {
            id: createdProduct.category?.id?.toString() || selectedProduct.category.id,
            name: createdProduct.category?.name || selectedProduct.category.name
          },
          image: createdProduct.images?.[0] || selectedProduct.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500',
          status: createdStatus,
          createdAt: createdProduct.createdAt ? new Date(createdProduct.createdAt).toISOString().split('T')[0] : ''
        };
        
        setProducts([...products, mappedProduct]);
        setSnackbar({ open: true, message: 'Producto creado exitosamente', severity: 'success' });
      } else {
        // Update existing product
        const updateData = {
          name: selectedProduct.name,
          description: selectedProduct.description,
          price: selectedProduct.price.toString(), // Backend expects string
          stock: selectedProduct.stock,
          images: selectedProduct.image ? [selectedProduct.image] : [],
          categoryId: parseInt(selectedProduct.category.id), // Backend expects number
          isAvailable: selectedProduct.status === 'active', // Send isAvailable instead of metadata.featured
          metadata: {
            featured: selectedProduct.status === 'active'
          }
        };
        
        console.log('Updating product with data:', updateData);
        
        const updatedProduct = await productApi.updateProduct(selectedProduct.id, updateData as any);
        
        console.log('Updated product response:', updatedProduct);
        
        // Map the response back to frontend format
        let updatedStatus: 'active' | 'inactive' = selectedProduct.status;
        if (updatedProduct.hasOwnProperty('isAvailable')) {
          updatedStatus = (updatedProduct as any).isAvailable ? 'active' : 'inactive';
        } else if (updatedProduct.metadata?.featured !== undefined) {
          updatedStatus = updatedProduct.metadata.featured ? 'active' : 'inactive';
        }
        
        const mappedProduct = {
          id: updatedProduct.id?.toString() || selectedProduct.id,
          name: updatedProduct.name || selectedProduct.name,
          description: updatedProduct.description || selectedProduct.description,
          price: typeof updatedProduct.price === 'string' ? parseFloat(updatedProduct.price) : updatedProduct.price || selectedProduct.price,
          stock: typeof updatedProduct.stock === 'string' ? parseInt(updatedProduct.stock) : updatedProduct.stock || selectedProduct.stock,
          category: {
            id: updatedProduct.category?.id?.toString() || selectedProduct.category.id,
            name: updatedProduct.category?.name || selectedProduct.category.name
          },
          image: updatedProduct.images?.[0] || selectedProduct.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500',
          status: updatedStatus,
          createdAt: updatedProduct.createdAt ? new Date(updatedProduct.createdAt).toISOString().split('T')[0] : selectedProduct.createdAt
        };
        
        setProducts(products.map(product => 
          product.id === selectedProduct.id ? mappedProduct : product
        ));
        setSnackbar({ open: true, message: 'Producto actualizado exitosamente', severity: 'success' });
      }
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSnackbar({ open: true, message: 'Error guardando producto: ' + errorMessage, severity: 'error' });
    }
    
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleAddProduct = () => {
    const defaultCategory = categories.length > 0 ? categories[0] : { id: '1', name: 'Electronics' };
    
    setSelectedProduct({
      id: 'new',
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: defaultCategory,
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
          Productos
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Buscar productos..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label="Categoría"
            >
              <MenuItem value="all">Todas las categorías</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddProduct}
            sx={{ ml: 'auto' }}
          >
            Agregar Producto
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Imagen</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="center">Stock</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Avatar
                        src={product.image}
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      >
                        <ImageIcon />
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {product.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={product.category.name} 
                        size="small" 
                        variant="outlined" 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">
                        ${product.price.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={product.stock}
                        size="small"
                        color={getStockColor(product.stock)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={product.status === 'active' ? 'Activo' : 'Inactivo'}
                        size="small"
                        color={getStatusColor(product.status)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleEditProduct(product)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteProduct(product.id)}
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
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Product Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedProduct?.id === 'new' ? 'Agregar Producto' : 'Editar Producto'}
        </DialogTitle>
        <DialogContent dividers>
          {selectedProduct && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Nombre del Producto"
                fullWidth
                value={selectedProduct.name}
                onChange={(e) => setSelectedProduct({
                  ...selectedProduct,
                  name: e.target.value
                })}
              />
              
              <TextField
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                value={selectedProduct.description}
                onChange={(e) => setSelectedProduct({
                  ...selectedProduct,
                  description: e.target.value
                })}
              />
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Precio"
                  type="number"
                  value={selectedProduct.price}
                  onChange={(e) => setSelectedProduct({
                    ...selectedProduct,
                    price: parseFloat(e.target.value) || 0
                  })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
                
                <TextField
                  label="Stock"
                  type="number"
                  value={selectedProduct.stock}
                  onChange={(e) => setSelectedProduct({
                    ...selectedProduct,
                    stock: parseInt(e.target.value) || 0
                  })}
                />
              </Box>
              
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={selectedProduct.category.id}
                  onChange={(e) => {
                    const categoryId = e.target.value as string;
                    const category = categories.find(cat => cat.id === categoryId);
                    if (category) {
                      setSelectedProduct({
                        ...selectedProduct,
                        category
                      });
                    }
                  }}
                  label="Categoría"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                label="URL de Imagen"
                fullWidth
                value={selectedProduct.image}
                onChange={(e) => setSelectedProduct({
                  ...selectedProduct,
                  image: e.target.value
                })}
                placeholder="https://example.com/image.jpg"
              />
              
              {selectedProduct.image && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Vista Previa:
                  </Typography>
                  <Avatar
                    src={selectedProduct.image}
                    variant="rounded"
                    sx={{ width: 120, height: 120 }}
                  >
                    <ImageIcon />
                  </Avatar>
                </Box>
              )}
              
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={selectedProduct.status}
                  onChange={(e) => setSelectedProduct({
                    ...selectedProduct,
                    status: e.target.value as 'active' | 'inactive'
                  })}
                  label="Estado"
                >
                  <MenuItem value="active">Activo</MenuItem>
                  <MenuItem value="inactive">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveProduct}
            variant="contained"
            disabled={!selectedProduct?.name || !selectedProduct?.description}
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

export default AdminProducts;
