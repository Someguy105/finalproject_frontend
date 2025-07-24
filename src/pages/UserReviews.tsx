import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Rating,
  Chip,
  Button,
  Stack,
  Alert,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Avatar,
} from '@mui/material';
import {
  EditOutlined,
  DeleteOutlined,
  MoreVertOutlined,
  ShoppingBagOutlined,
  CheckCircleOutlined,
  StarOutlined,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { Review } from '../types';
import { formatCurrency } from '../utils';
import ReviewForm from '../components/ReviewForm';
import { useUserReviews } from '../hooks/useReviews';

const UserReviews: React.FC = () => {
  const { user } = useAuth();
  const { 
    reviews, 
    products, 
    loading, 
    error, 
    updateReview, 
    deleteReview: removeReview, 
    refetch 
  } = useUserReviews();
  
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<Review | null>(null);
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

  const handleMenuOpen = (reviewId: string, event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(prev => ({ ...prev, [reviewId]: event.currentTarget }));
  };

  const handleMenuClose = (reviewId: string) => {
    setAnchorEl(prev => ({ ...prev, [reviewId]: null }));
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    handleMenuClose(review.id);
  };

  const handleDeleteReview = async (review: Review) => {
    try {
      await removeReview(review.id);
      setDeleteDialogOpen(null);
    } catch (err) {
      console.error('Error al eliminar reseña:', err);
    }
  };

  const onReviewUpdated = async () => {
    // Refresh reviews after update
    setEditingReview(null);
    await refetch();
  };

  // Helper function to format dates in Spanish
  const formatSpanishDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Please log in to view your reviews.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your reviews...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
            Mis Reseñas
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gestiona tus valoraciones y experiencias de compra
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          color="secondary"
          startIcon={<StarOutlined />}
          href="/products"
        >
          Escribir Nueva Reseña
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Estadísticas de reseñas */}
      {!loading && reviews.length > 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
          <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
            <Typography variant="h4" fontWeight="bold">
              {reviews.length}
            </Typography>
            <Typography variant="body2">Total de Reseñas</Typography>
          </Card>
          <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'secondary.main', color: 'white', borderRadius: 2 }}>
            <Typography variant="h4" fontWeight="bold">
              {reviews.filter(r => r.rating >= 4).length}
            </Typography>
            <Typography variant="body2">Valoraciones Positivas</Typography>
          </Card>
          <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'success.main', color: 'white', borderRadius: 2 }}>
            <Typography variant="h4" fontWeight="bold">
              {reviews.reduce((total, review) => total + (review.helpfulCount || 0), 0)}
            </Typography>
            <Typography variant="body2">Votos Útiles Recibidos</Typography>
          </Card>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Cargando tus reseñas...
          </Typography>
        </Box>
      ) : reviews.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center', borderRadius: 3, boxShadow: 3 }}>
          <StarOutlined sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.7 }} />
          <Typography variant="h5" gutterBottom fontWeight="medium">
            No has escrito ninguna reseña todavía
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            ¡Comparte tu opinión sobre los productos que has comprado y ayuda a otros clientes!
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            href="/products"
            startIcon={<ShoppingBagOutlined />}
            sx={{ px: 4, py: 1.2 }}
          >
            Explorar Productos
          </Button>
        </Card>
      ) : (
        <Stack spacing={3}>
          {reviews.map((review) => {
            const product = products[review.productId.toString()];
            return (
              <Card 
                key={review.id} 
                elevation={2}
                sx={{ 
                  borderRadius: 2, 
                  overflow: 'visible',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    boxShadow: 6,
                    transform: 'translateY(-3px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Cabecera con imagen del producto */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flex: 1 }}>
                      {product && (
                        <Box
                          component="img"
                          src={product.images?.[0] || '/placeholder-product.jpg'}
                          alt={product.name}
                          sx={{
                            width: 100,
                            height: 100,
                            objectFit: 'cover',
                            borderRadius: 2,
                            boxShadow: 2,
                            border: '2px solid white'
                          }}
                        />
                      )}
                      <Box>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                          {product?.name || 'Producto no disponible'}
                        </Typography>
                        {product && (
                          <Typography variant="body1" color="primary" fontWeight="medium">
                            {formatCurrency(product.price)}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Valorado el {formatSpanishDate(review.createdAt)}
                          </Typography>
                          {review.isVerified && (
                            <Chip
                              label="Compra Verificada"
                              size="small"
                              color="success"
                              variant="outlined"
                              icon={<CheckCircleOutlined fontSize="small" />}
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                    
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(review.id, e)}
                      sx={{ 
                        bgcolor: 'grey.100',
                        '&:hover': { bgcolor: 'grey.200' }
                      }}
                    >
                      <MoreVertOutlined />
                    </IconButton>
                    
                    <Menu
                      anchorEl={anchorEl[review.id]}
                      open={Boolean(anchorEl[review.id])}
                      onClose={() => handleMenuClose(review.id)}
                    >
                      <MenuItem onClick={() => handleEditReview(review)}>
                        <EditOutlined sx={{ mr: 1 }} />
                        Editar Reseña
                      </MenuItem>
                      <MenuItem onClick={() => setDeleteDialogOpen(review)}>
                        <DeleteOutlined sx={{ mr: 1 }} />
                        Eliminar Reseña
                      </MenuItem>
                    </Menu>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Contenido de la reseña */}
                  <Box sx={{ ml: { xs: 0, sm: 2 } }}>
                    {/* Calificación con estrellas */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Rating 
                        value={review.rating} 
                        readOnly 
                        precision={0.5}
                        size="large"
                        sx={{ color: 'secondary.main' }}
                      />
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          color: review.rating >= 4 ? 'success.main' : 
                                 review.rating >= 3 ? 'warning.main' : 
                                 'error.main',
                          fontWeight: 'bold'
                        }}
                      >
                        {review.rating}/5
                      </Typography>
                    </Box>
                    
                    {/* Título de la reseña */}
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      gutterBottom
                      sx={{ color: 'text.primary', mb: 1 }}
                    >
                      {review.title}
                    </Typography>
                    
                    {/* Contenido de la reseña */}
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        lineHeight: 1.7, 
                        letterSpacing: 0.2,
                        mb: 2,
                        fontStyle: review.comment.length > 200 ? 'normal' : 'italic'
                      }}
                    >
                      {review.comment}
                    </Typography>

                    {/* Estadísticas */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 2,
                        pt: 2,
                        borderTop: '1px dashed rgba(0,0,0,0.1)'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            bgcolor: 'primary.light',
                            fontSize: '0.8rem',
                            mr: 1
                          }}
                        >
                          {user?.firstName?.charAt(0) || 'U'}
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                          {user?.firstName} {user?.lastName}
                        </Typography>
                      </Box>
                      
                      {(review.helpfulCount || 0) > 0 && (
                        <Chip
                          label={`${review.helpfulCount} ${review.helpfulCount === 1 ? 'persona encontró' : 'personas encontraron'} útil esta reseña`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* Edit Review Dialog */}
      {editingReview && (
        <Dialog 
          open={true} 
          onClose={() => setEditingReview(null)} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Editar mi reseña
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <ReviewForm
              productId={editingReview.productId.toString()}
              existingReview={editingReview}
              onReviewSubmitted={onReviewUpdated}
              onCancel={() => setEditingReview(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <Dialog 
          open={true} 
          onClose={() => setDeleteDialogOpen(null)}
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ bgcolor: 'error.main', color: 'white', py: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Eliminar Reseña
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
            <Typography variant="subtitle1" sx={{ mt: 1, mb: 2 }}>
              ¿Estás seguro que deseas eliminar tu reseña para el producto "{products[deleteDialogOpen.productId.toString()]?.name || 'seleccionado'}"?
            </Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Esta acción no se puede deshacer. La reseña se eliminará permanentemente.
            </Alert>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={() => setDeleteDialogOpen(null)}
              variant="outlined"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => handleDeleteReview(deleteDialogOpen)}
              color="error"
              variant="contained"
              startIcon={<DeleteOutlined />}
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      )}
      
      {/* Botón para escribir nuevas reseñas */}
      {!loading && reviews.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<StarOutlined />}
            href="/products"
            sx={{ px: 4, py: 1.2, borderRadius: 2 }}
          >
            Escribir más reseñas
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default UserReviews;
