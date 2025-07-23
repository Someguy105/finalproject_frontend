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
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Cancel,
  FilterList,
  Add,
  Schedule
} from '@mui/icons-material';
import { t } from '../../utils';
import { reviewApi } from '../../api/reviews';
import { Review } from '../../types';

interface BackendReview {
  _id: string;
  userId: string;
  productId: number;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  isHelpful: boolean;
  helpfulCount: number;
  images: string[];
  metadata?: {
    userName: string;
    userEmail: string;
  };
  createdAt: string;
  updatedAt: string;
  moderatedBy?: string;
  moderatedAt?: string;
}

const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<BackendReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState<BackendReview | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [formReview, setFormReview] = useState<Partial<BackendReview>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Load reviews from backend
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const response = await reviewApi.getReviews();
        
        // Map backend reviews to our interface
        const mappedReviews: BackendReview[] = (response as any).map((review: any) => ({
          _id: review._id,
          userId: review.userId,
          productId: review.productId,
          rating: review.rating,
          title: review.title || 'Sin título',
          comment: review.comment,
          isVerified: review.isVerified,
          isHelpful: review.isHelpful,
          helpfulCount: review.helpfulCount,
          images: review.images || [],
          metadata: {
            userName: review.metadata?.userName || 'Usuario desconocido',
            userEmail: review.metadata?.userEmail || 'email@desconocido.com'
          },
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
          moderatedBy: review.moderatedBy,
          moderatedAt: review.moderatedAt
        }));
        
        setReviews(mappedReviews);
      } catch (error) {
        console.error('Error loading reviews:', error);
        setSnackbar({ 
          open: true, 
          message: 'Error cargando reseñas', 
          severity: 'error' 
        });
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (review.metadata?.userName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'approved' && review.isVerified) ||
                         (statusFilter === 'rejected' && !review.isVerified);
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    return matchesSearch && matchesStatus && matchesRating;
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewReview = (review: BackendReview) => {
    setSelectedReview(review);
    setOpenDialog(true);
  };

  const handleApproveReview = async (reviewId: string) => {
    try {
      // Update review status in backend
      await reviewApi.updateReview(reviewId, { isVerified: true });
      
      setReviews(reviews.map(review =>
        review._id === reviewId
          ? { ...review, isVerified: true, moderatedBy: 'admin@email.com', moderatedAt: new Date().toISOString() }
          : review
      ));
      setSnackbar({ open: true, message: 'Reseña aprobada exitosamente', severity: 'success' });
    } catch (error) {
      console.error('Error approving review:', error);
      setSnackbar({ open: true, message: 'Error aprobando reseña', severity: 'error' });
    }
  };

  const handleRejectReview = async (reviewId: string) => {
    try {
      // Update review status in backend
      await reviewApi.updateReview(reviewId, { isVerified: false });
      
      setReviews(reviews.map(review =>
        review._id === reviewId
          ? { ...review, isVerified: false, moderatedBy: 'admin@email.com', moderatedAt: new Date().toISOString() }
          : review
      ));
      setSnackbar({ open: true, message: 'Reseña rechazada exitosamente', severity: 'success' });
    } catch (error) {
      console.error('Error rejecting review:', error);
      setSnackbar({ open: true, message: 'Error rechazando reseña', severity: 'error' });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta reseña?')) {
      try {
        await reviewApi.deleteReview(reviewId);
        setReviews(reviews.filter(review => review._id !== reviewId));
        setSnackbar({ open: true, message: 'Reseña eliminada', severity: 'success' });
      } catch (error) {
        console.error('Error deleting review:', error);
        setSnackbar({ open: true, message: 'Error eliminando reseña', severity: 'error' });
      }
    }
  };

  const handleCreateReview = () => {
    setFormReview({
      userId: '',
      productId: 1,
      rating: 5,
      title: '',
      comment: '',
      isVerified: false,
      metadata: {
        userName: '',
        userEmail: ''
      }
    });
    setOpenFormDialog(true);
  };

  const handleEditReview = (review: BackendReview) => {
    setFormReview({
      _id: review._id,
      userId: review.userId,
      productId: review.productId,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      isVerified: review.isVerified,
      metadata: {
        userName: review.metadata?.userName || 'Usuario desconocido',
        userEmail: review.metadata?.userEmail || 'email@desconocido.com'
      }
    });
    setOpenFormDialog(true);
  };

  const handleSaveReview = async () => {
    try {
      if (formReview._id) {
        // Update existing review
        const updatedReview = await reviewApi.updateReview(formReview._id, {
          rating: formReview.rating,
          title: formReview.title,
          comment: formReview.comment,
          isVerified: formReview.isVerified
        } as any);
        
        // Update the review in local state
        setReviews(reviews.map(review =>
          review._id === formReview._id ? {
            ...review,
            rating: formReview.rating!,
            title: formReview.title!,
            comment: formReview.comment!,
            isVerified: formReview.isVerified!,
            updatedAt: new Date().toISOString()
          } : review
        ));
        setSnackbar({ open: true, message: 'Reseña actualizada exitosamente', severity: 'success' });
      } else {
        // Create new review
        const newReviewData = {
          userId: formReview.userId!,
          productId: formReview.productId!,
          rating: formReview.rating!,
          title: formReview.title!,
          comment: formReview.comment!,
          isVerified: formReview.isVerified!
        };
        
        const createdReview = await reviewApi.createReview(newReviewData as any);
        
        // Add to local state with proper mapping
        const mappedReview: BackendReview = {
          _id: (createdReview as any)._id || Date.now().toString(),
          userId: formReview.userId!,
          productId: formReview.productId!,
          rating: formReview.rating!,
          title: formReview.title!,
          comment: formReview.comment!,
          isVerified: formReview.isVerified!,
          isHelpful: false,
          helpfulCount: 0,
          images: [],
          metadata: formReview.metadata!,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setReviews([...reviews, mappedReview]);
        setSnackbar({ open: true, message: 'Reseña creada exitosamente', severity: 'success' });
      }
      
      setOpenFormDialog(false);
      setFormReview({});
    } catch (error) {
      console.error('Error saving review:', error);
      setSnackbar({ open: true, message: 'Error guardando reseña', severity: 'error' });
    }
  };

  const getStatusColor = (isVerified: boolean) => {
    return isVerified ? 'success' : 'error';
  };

  const getStatusText = (isVerified: boolean) => {
    return isVerified ? 'Aprobada' : 'Rechazada';
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" color="primary">
          Gestión de Reseñas
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateReview}
        >
          Crear Reseña
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="approved">Aprobada</MenuItem>
              <MenuItem value="rejected">Rechazada</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Calificación</InputLabel>
            <Select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <MenuItem value="all">Todas</MenuItem>
              <MenuItem value="5">5 estrellas</MenuItem>
              <MenuItem value="4">4 estrellas</MenuItem>
              <MenuItem value="3">3 estrellas</MenuItem>
              <MenuItem value="2">2 estrellas</MenuItem>
              <MenuItem value="1">1 estrella</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>{t('reviewUser')}</TableCell>
              <TableCell>{t('reviewProduct')}</TableCell>
              <TableCell>{t('reviewRating')}</TableCell>
              <TableCell>{t('reviewComment')}</TableCell>
              <TableCell>{t('reviewDate')}</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReviews
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((review) => (
                <TableRow key={review._id}>
                  <TableCell>{review._id.slice(-6)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {(review.metadata?.userName || 'U').charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {review.metadata?.userName || 'Usuario desconocido'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {review.metadata?.userEmail || 'email@desconocido.com'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>Producto #{review.productId}</TableCell>
                  <TableCell>
                    <Rating value={review.rating} readOnly size="small" />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography noWrap>
                      {review.comment}
                    </Typography>
                  </TableCell>
                  <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(review.isVerified)}
                      color={getStatusColor(review.isVerified) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={() => handleViewReview(review)} size="small">
                        <Visibility />
                      </IconButton>
                      <IconButton onClick={() => handleEditReview(review)} size="small" color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleApproveReview(review._id)} 
                        size="small" 
                        color="success"
                        title="Aprobar reseña"
                      >
                        <CheckCircle />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleRejectReview(review._id)} 
                        size="small" 
                        color="error"
                        title="Rechazar reseña"
                      >
                        <Cancel />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDeleteReview(review._id)} 
                        size="small" 
                        color="error"
                        title="Eliminar reseña"
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
          count={filteredReviews.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Create/Edit Review Form Dialog */}
      <Dialog open={openFormDialog} onClose={() => setOpenFormDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {formReview._id ? 'Editar Reseña' : 'Crear Nueva Reseña'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            {!formReview._id && (
              <>
                <TextField
                  label="ID del Usuario"
                  value={formReview.userId || ''}
                  onChange={(e) => setFormReview({...formReview, userId: e.target.value})}
                  fullWidth
                  required
                />
                <TextField
                  label="Nombre del Usuario"
                  value={formReview.metadata?.userName || ''}
                  onChange={(e) => setFormReview({
                    ...formReview, 
                    metadata: {
                      userName: e.target.value,
                      userEmail: formReview.metadata?.userEmail || ''
                    }
                  })}
                  fullWidth
                  required
                />
                <TextField
                  label="Email del Usuario"
                  type="email"
                  value={formReview.metadata?.userEmail || ''}
                  onChange={(e) => setFormReview({
                    ...formReview, 
                    metadata: {
                      userName: formReview.metadata?.userName || '',
                      userEmail: e.target.value
                    }
                  })}
                  fullWidth
                  required
                />
              </>
            )}
            
            <TextField
              label="ID del Producto"
              type="number"
              value={formReview.productId || ''}
              onChange={(e) => setFormReview({...formReview, productId: parseInt(e.target.value) || 1})}
              fullWidth
              disabled={!!formReview._id}
              required
            />
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Calificación
              </Typography>
              <Rating
                value={formReview.rating || 5}
                onChange={(event, newValue) => {
                  setFormReview({...formReview, rating: newValue || 5});
                }}
                size="large"
              />
            </Box>
            
            <TextField
              label="Título de la Reseña"
              value={formReview.title || ''}
              onChange={(e) => setFormReview({...formReview, title: e.target.value})}
              fullWidth
              required
            />
            
            <TextField
              label="Comentario"
              value={formReview.comment || ''}
              onChange={(e) => setFormReview({...formReview, comment: e.target.value})}
              multiline
              rows={4}
              fullWidth
              required
            />
            
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={formReview.isVerified ? 'approved' : 'rejected'}
                onChange={(e) => setFormReview({...formReview, isVerified: e.target.value === 'approved'})}
              >
                <MenuItem value="approved">Aprobada</MenuItem>
                <MenuItem value="rejected">Rechazada</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenFormDialog(false);
            setFormReview({});
          }}>
            Cancelar
          </Button>
          <Button onClick={handleSaveReview} variant="contained">
            {formReview._id ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Detail Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Detalles de la Reseña #{selectedReview?._id.slice(-6)}
        </DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Usuario:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 40, height: 40 }}>
                    {(selectedReview.metadata?.userName || 'U').charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedReview.metadata?.userName || 'Usuario desconocido'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedReview.metadata?.userEmail || 'email@desconocido.com'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Producto:
                </Typography>
                <Typography variant="body1">
                  Producto #{selectedReview.productId}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Calificación:
                </Typography>
                <Rating value={selectedReview.rating} readOnly />
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Título:
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedReview.title}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Comentario:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body1">
                    {selectedReview.comment}
                  </Typography>
                </Paper>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Fecha de Creación:
                </Typography>
                <Typography variant="body1">
                  {new Date(selectedReview.createdAt).toLocaleDateString()}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Estado:
                </Typography>
                <Chip
                  label={getStatusText(selectedReview.isVerified)}
                  color={getStatusColor(selectedReview.isVerified) as any}
                />
              </Box>

              {selectedReview.moderatedBy && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Moderado por:
                  </Typography>
                  <Typography variant="body1">
                    {selectedReview.moderatedBy} el {selectedReview.moderatedAt ? new Date(selectedReview.moderatedAt).toLocaleDateString() : ''}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={() => {
                    handleApproveReview(selectedReview._id);
                    setOpenDialog(false);
                  }}
                >
                  Aprobar
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => {
                    handleRejectReview(selectedReview._id);
                    setOpenDialog(false);
                  }}
                >
                  Rechazar
                </Button>
              </Box>
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

export default AdminReviews;
