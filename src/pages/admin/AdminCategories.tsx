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
  Alert,
  Snackbar,
  CircularProgress,
  Avatar,
  Chip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Category as CategoryIcon,
  Visibility,
  VisibilityOff,
  Image as ImageIcon,
  Sort
} from '@mui/icons-material';
import { categoryApi } from '../../api/products';
import { Category } from '../../types';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{ open: boolean; categoryId: string | null }>({
    open: false,
    categoryId: null
  });

  // Load data from backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await categoryApi.getCategories();
        
        const mappedCategories = categoriesData.map(category => ({
          id: category.id,
          name: category.name,
          description: category.description,
          slug: category.slug || '',
          image: category.image || '',
          isActive: category.isActive ?? true,
          sortOrder: category.sortOrder || 0,
          metadata: category.metadata || {},
          createdAt: new Date(category.createdAt).toISOString().split('T')[0],
          updatedAt: new Date(category.updatedAt || category.createdAt).toISOString().split('T')[0]
        }));

        setCategories(mappedCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
        setSnackbar({ 
          open: true, 
          message: 'Error loading categories from server', 
          severity: 'error' 
        });
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setOpenDialog(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setDeleteConfirmDialog({ open: true, categoryId });
  };

  const confirmDeleteCategory = async () => {
    if (!deleteConfirmDialog.categoryId) return;

    try {
      await categoryApi.deleteCategory(deleteConfirmDialog.categoryId);
      setCategories(categories.filter(category => category.id !== deleteConfirmDialog.categoryId));
      setSnackbar({ open: true, message: 'Categoría eliminada exitosamente', severity: 'success' });
    } catch (error) {
      console.error('Error deleting category:', error);
      setSnackbar({ open: true, message: 'Error eliminando categoría', severity: 'error' });
    }
    
    setDeleteConfirmDialog({ open: false, categoryId: null });
  };

  const handleSaveCategory = async () => {
    if (!selectedCategory) return;

    try {
      if (selectedCategory.id === 'new') {
        // Create new category
        const newCategoryData = {
          name: selectedCategory.name,
          description: selectedCategory.description,
          slug: selectedCategory.slug || selectedCategory.name.toLowerCase().replace(/\s+/g, '-'),
          image: selectedCategory.image || '',
          isActive: selectedCategory.isActive ?? true,
          sortOrder: selectedCategory.sortOrder || categories.length + 1,
          metadata: selectedCategory.metadata || {}
        };
        
        const createdCategory = await categoryApi.createCategory(newCategoryData);
        const mappedCategory = {
          id: createdCategory.id,
          name: createdCategory.name,
          description: createdCategory.description,
          slug: createdCategory.slug || '',
          image: createdCategory.image || '',
          isActive: createdCategory.isActive ?? true,
          sortOrder: createdCategory.sortOrder || 0,
          metadata: createdCategory.metadata || {},
          createdAt: new Date(createdCategory.createdAt).toISOString().split('T')[0],
          updatedAt: new Date(createdCategory.updatedAt || createdCategory.createdAt).toISOString().split('T')[0]
        };
        
        setCategories([...categories, mappedCategory]);
        setSnackbar({ open: true, message: 'Categoría creada exitosamente', severity: 'success' });
      } else {
        // Update existing category
        const updateData = {
          name: selectedCategory.name,
          description: selectedCategory.description,
          slug: selectedCategory.slug || selectedCategory.name.toLowerCase().replace(/\s+/g, '-'),
          image: selectedCategory.image || '',
          isActive: selectedCategory.isActive ?? true,
          sortOrder: selectedCategory.sortOrder || 0,
          metadata: selectedCategory.metadata || {}
        };
        
        const updatedCategory = await categoryApi.updateCategory(selectedCategory.id, updateData);
        const mappedCategory = {
          id: updatedCategory.id,
          name: updatedCategory.name,
          description: updatedCategory.description,
          slug: updatedCategory.slug || '',
          image: updatedCategory.image || '',
          isActive: updatedCategory.isActive ?? true,
          sortOrder: updatedCategory.sortOrder || 0,
          metadata: updatedCategory.metadata || {},
          createdAt: new Date(updatedCategory.createdAt).toISOString().split('T')[0],
          updatedAt: new Date(updatedCategory.updatedAt || updatedCategory.createdAt).toISOString().split('T')[0]
        };
        
        setCategories(categories.map(category => 
          category.id === selectedCategory.id ? mappedCategory : category
        ));
        setSnackbar({ open: true, message: 'Categoría actualizada exitosamente', severity: 'success' });
      }
    } catch (error) {
      console.error('Error saving category:', error);
      setSnackbar({ open: true, message: 'Error guardando categoría', severity: 'error' });
    }
    
    setOpenDialog(false);
    setSelectedCategory(null);
  };

  const handleAddCategory = () => {
    setSelectedCategory({
      id: 'new',
      name: '',
      description: '',
      slug: '',
      image: '',
      isActive: true,
      sortOrder: categories.length + 1,
      metadata: {},
      createdAt: '',
      updatedAt: ''
    });
    setOpenDialog(true);
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
          Categorías
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddCategory}
          >
            Agregar Categoría
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Categoría</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Orden</TableCell>
                <TableCell align="center">Fecha de Creación</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {category.image ? (
                          <Avatar
                            src={category.image}
                            sx={{ width: 40, height: 40 }}
                          >
                            <ImageIcon />
                          </Avatar>
                        ) : (
                          <Avatar
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              bgcolor: category.metadata?.color || 'primary.main' 
                            }}
                          >
                            <CategoryIcon />
                          </Avatar>
                        )}
                        <Box>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {category.name}
                          </Typography>
                          {category.metadata?.featured && (
                            <Chip 
                              label="Destacada" 
                              size="small" 
                              color="secondary" 
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={category.isActive ? 'Activa' : 'Inactiva'}
                        color={category.isActive ? 'success' : 'error'}
                        size="small"
                        icon={category.isActive ? <Visibility /> : <VisibilityOff />}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <Sort fontSize="small" color="action" />
                        <Typography variant="body2">
                          {category.sortOrder}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {category.createdAt}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleEditCategory(category)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCategory(category.id)}
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
          count={categories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Category Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedCategory?.id === 'new' ? 'Agregar Categoría' : 'Editar Categoría'}
        </DialogTitle>
        <DialogContent dividers>
          {selectedCategory && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Nombre de la Categoría"
                fullWidth
                value={selectedCategory.name}
                onChange={(e) => setSelectedCategory({
                  ...selectedCategory,
                  name: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
                })}
              />
              
              <TextField
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                value={selectedCategory.description}
                onChange={(e) => setSelectedCategory({
                  ...selectedCategory,
                  description: e.target.value
                })}
              />

              <TextField
                label="URL de la Imagen"
                fullWidth
                value={selectedCategory.image || ''}
                onChange={(e) => setSelectedCategory({
                  ...selectedCategory,
                  image: e.target.value
                })}
                placeholder="https://ejemplo.com/imagen.jpg"
              />

              <TextField
                label="Orden de Clasificación"
                type="number"
                fullWidth
                value={selectedCategory.sortOrder}
                onChange={(e) => setSelectedCategory({
                  ...selectedCategory,
                  sortOrder: parseInt(e.target.value) || 0
                })}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={selectedCategory.isActive}
                    onChange={(e) => setSelectedCategory({
                      ...selectedCategory,
                      isActive: e.target.checked
                    })}
                  />
                }
                label="Categoría Activa"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={selectedCategory.metadata?.featured || false}
                    onChange={(e) => setSelectedCategory({
                      ...selectedCategory,
                      metadata: {
                        ...selectedCategory.metadata,
                        featured: e.target.checked
                      }
                    })}
                  />
                }
                label="Categoría Destacada"
              />

              <TextField
                label="Color de la Categoría"
                fullWidth
                value={selectedCategory.metadata?.color || ''}
                onChange={(e) => setSelectedCategory({
                  ...selectedCategory,
                  metadata: {
                    ...selectedCategory.metadata,
                    color: e.target.value
                  }
                })}
                placeholder="#1976d2"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveCategory}
            variant="contained"
            disabled={!selectedCategory?.name || !selectedCategory?.description}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmDialog.open}
        onClose={() => setDeleteConfirmDialog({ open: false, categoryId: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmDialog({ open: false, categoryId: null })}>
            Cancelar
          </Button>
          <Button onClick={confirmDeleteCategory} color="error" variant="contained">
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
