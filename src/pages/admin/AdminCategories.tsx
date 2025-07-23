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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Avatar,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Add,
  Category as CategoryIcon
} from '@mui/icons-material';
import { t } from '../../utils';

interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  image?: string;
  productCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: 'Electronics',
      description: 'Electronic devices, gadgets, and accessories',
      slug: 'electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
      productCount: 2,
      isActive: true,
      createdAt: '2025-01-15',
      updatedAt: '2025-01-20'
    },
    {
      id: 2,
      name: 'Clothing',
      description: 'Fashion apparel and accessories for all ages',
      slug: 'clothing',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
      productCount: 1,
      isActive: true,
      createdAt: '2025-01-16',
      updatedAt: '2025-01-19'
    },
    {
      id: 3,
      name: 'Books',
      description: 'Physical and digital books, magazines, and educational materials',
      slug: 'books',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
      productCount: 1,
      isActive: true,
      createdAt: '2025-01-17',
      updatedAt: '2025-01-18'
    },
    {
      id: 4,
      name: 'Home & Garden',
      description: 'Home improvement, furniture, and gardening supplies',
      slug: 'home-garden',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
      productCount: 0,
      isActive: true,
      createdAt: '2025-01-18',
      updatedAt: '2025-01-21'
    }
  ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    image: '',
    isActive: true
  });

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', slug: '', image: '', isActive: true });
    setOpenDialog(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      slug: category.slug,
      image: category.image || '',
      isActive: category.isActive
    });
    setOpenDialog(true);
  };

  const handleDeleteCategory = (categoryId: number) => {
    const categoryToDelete = categories.find(c => c.id === categoryId);
    if (categoryToDelete) {
      setCategoryToDelete(categoryToDelete);
      setOpenDeleteDialog(true);
    }
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(category => category.id !== categoryToDelete.id));
      setSnackbar({ 
        open: true, 
        message: `Categoría "${categoryToDelete.name}" eliminada exitosamente`, 
        severity: 'success' 
      });
    }
    setOpenDeleteDialog(false);
    setCategoryToDelete(null);
  };

  const cancelDeleteCategory = () => {
    setOpenDeleteDialog(false);
    setCategoryToDelete(null);
  };

  const handleSaveCategory = () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      setSnackbar({ open: true, message: 'Nombre y descripción son obligatorios', severity: 'error' });
      return;
    }

    // Generate slug if not provided
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(category =>
        category.id === editingCategory.id
          ? {
              ...category,
              name: formData.name,
              description: formData.description,
              slug: slug,
              image: formData.image,
              isActive: formData.isActive,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : category
      ));
      setSnackbar({ open: true, message: 'Categoría actualizada exitosamente', severity: 'success' });
    } else {
      // Add new category
      const newCategory: Category = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        name: formData.name,
        description: formData.description,
        slug: slug,
        image: formData.image,
        productCount: 0,
        isActive: formData.isActive,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setCategories([...categories, newCategory]);
      setSnackbar({ open: true, message: 'Categoría creada exitosamente', severity: 'success' });
    }

    setOpenDialog(false);
  };

  const toggleCategoryStatus = (categoryId: number) => {
    setCategories(categories.map(category =>
      category.id === categoryId
        ? { ...category, isActive: !category.isActive, updatedAt: new Date().toISOString().split('T')[0] }
        : category
    ));
    setSnackbar({ open: true, message: 'Estado de categoría actualizado', severity: 'success' });
  };

  const renderTableView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Imagen</TableCell>
            <TableCell>{t('categoryName')}</TableCell>
            <TableCell>{t('description')}</TableCell>
            <TableCell>Slug</TableCell>
            <TableCell>Productos</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>{t('actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCategories
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>
                  <Avatar
                    src={category.image}
                    sx={{ width: 40, height: 40 }}
                  >
                    <CategoryIcon />
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {category.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                    {category.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {category.slug}
                  </Typography>
                </TableCell>
                <TableCell>{category.productCount}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    color={category.isActive ? 'success' : 'error'}
                    onClick={() => toggleCategoryStatus(category.id)}
                  >
                    {category.isActive ? 'Activa' : 'Inactiva'}
                  </Button>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={() => handleEditCategory(category)} size="small" title="Editar categoría">
                      <Edit />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteCategory(category.id)} 
                      size="small" 
                      color="error"
                      title="Eliminar categoría"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCategories.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );

  const renderCardView = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
      {filteredCategories
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((category) => (
          <Card key={category.id}>
            <Box sx={{ position: 'relative' }}>
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  style={{ width: '100%', height: 200, objectFit: 'cover' }}
                />
              ) : (
                <Box
                  sx={{
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.200'
                  }}
                >
                  <CategoryIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                </Box>
              )}
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: category.isActive ? 'success.main' : 'error.main',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.75rem'
                }}
              >
                {category.isActive ? 'Activa' : 'Inactiva'}
              </Box>
            </Box>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {category.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {category.description}
              </Typography>
              <Typography variant="caption" display="block" gutterBottom>
                Slug: {category.slug}
              </Typography>
              <Typography variant="caption" color="primary">
                {category.productCount} productos
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleEditCategory(category)}>
                <Edit sx={{ mr: 1 }} /> Editar
              </Button>
              <Button 
                size="small" 
                color="error" 
                onClick={() => handleDeleteCategory(category.id)}
              >
                <Delete sx={{ mr: 1 }} /> Eliminar
              </Button>
            </CardActions>
          </Card>
        ))}
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
        {t('manageCategories')}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
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
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddCategory}
          >
            {t('addCategory')}
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={viewMode === 'table' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setViewMode('table')}
          >
            Tabla
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setViewMode('cards')}
          >
            Tarjetas
          </Button>
        </Box>
      </Paper>

      {viewMode === 'table' ? renderTableView() : renderCardView()}

      {/* Category Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Nombre de la Categoría"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
              required
            />
            <TextField
              label="Slug (URL amigable)"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              fullWidth
              placeholder="Se genera automáticamente si se deja vacío"
            />
            <TextField
              label="URL de Imagen"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              fullWidth
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>Estado:</Typography>
              <Button
                variant={formData.isActive ? 'contained' : 'outlined'}
                color={formData.isActive ? 'success' : 'error'}
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
              >
                {formData.isActive ? 'Activa' : 'Inactiva'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveCategory} variant="contained">
            {editingCategory ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={cancelDeleteCategory}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          {categoryToDelete && (
            <Box>
              <Typography gutterBottom>
                ¿Está seguro de que desea eliminar la categoría <strong>"{categoryToDelete.name}"</strong>?
              </Typography>
              {categoryToDelete.productCount > 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Atención:</strong> Esta categoría tiene <strong>{categoryToDelete.productCount} producto(s)</strong> asociado(s). 
                    Al eliminarla, estos productos quedarán sin categoría asignada.
                  </Typography>
                </Alert>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Esta acción no se puede deshacer.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteCategory}>
            Cancelar
          </Button>
          <Button 
            onClick={confirmDeleteCategory} 
            color="error" 
            variant="contained"
            startIcon={<Delete />}
          >
            Eliminar
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

export default AdminCategories;
