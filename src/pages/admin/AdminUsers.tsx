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
  CircularProgress
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Add,
  Visibility,
  MoreVert
} from '@mui/icons-material';
import { t } from '../../utils';
import { userApi } from '../../api/users';
import { User } from '../../types';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [tempPassword, setTempPassword] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Load users from backend
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await userApi.getAdminUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Error loading users:', error);
        setSnackbar({ 
          open: true, 
          message: 'Error cargando usuarios', 
          severity: 'error' 
        });
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      try {
        await userApi.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
        setSnackbar({ open: true, message: 'Usuario eliminado', severity: 'success' });
      } catch (error) {
        console.error('Error deleting user:', error);
        setSnackbar({ open: true, message: 'Error eliminando usuario', severity: 'error' });
      }
    }
  };

  const handleSaveUser = async () => {
    if (selectedUser) {
      try {
        if (selectedUser.id && selectedUser.id !== 'new') {
          // Update existing user
          const updatedUser = await userApi.updateUser(selectedUser.id, {
            firstName: selectedUser.firstName,
            lastName: selectedUser.lastName,
            email: selectedUser.email,
            role: selectedUser.role,
            isActive: selectedUser.isActive
          });
          setUsers(users.map(user => 
            user.id === selectedUser.id ? updatedUser : user
          ));
          setSnackbar({ open: true, message: 'Usuario actualizado', severity: 'success' });
        } else {
          // Create new user - validate password
          if (!tempPassword.trim()) {
            setSnackbar({ open: true, message: 'La contraseña es requerida para nuevos usuarios', severity: 'error' });
            return;
          }
          
          const createData = {
            firstName: selectedUser.firstName,
            lastName: selectedUser.lastName,
            email: selectedUser.email,
            password: tempPassword,
            role: selectedUser.role,
            isActive: selectedUser.isActive
          };
          
          const newUser = await userApi.createUser(createData as any);
          setUsers([...users, newUser]);
          setSnackbar({ open: true, message: 'Usuario creado', severity: 'success' });
        }
      } catch (error) {
        console.error('Error saving user:', error);
        setSnackbar({ open: true, message: 'Error guardando usuario', severity: 'error' });
      }
    }
    setOpenDialog(false);
    setSelectedUser(null);
    setTempPassword('');
  };

  const handleAddUser = () => {
    setSelectedUser({
      id: 'new',
      firstName: '',
      lastName: '',
      email: '',
      role: 'customer',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setTempPassword('');
    setOpenDialog(true);
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'secondary' : 'default';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'error';
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
          Gestión de Usuarios
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddUser}
        >
          Agregar Usuario
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha Creación</TableCell>
              <TableCell>Última Actualización</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={getRoleColor(user.role) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? 'Activo' : 'Inactivo'}
                      color={getStatusColor(user.isActive) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(user.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditUser(user)} size="small">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteUser(user.id)} size="small" color="error">
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
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Edit/Add User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser?.id && selectedUser.id !== 'new' ? 'Editar Usuario' : 'Agregar Usuario'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Nombre"
              value={selectedUser?.firstName || ''}
              onChange={(e) => setSelectedUser(prev => prev ? { ...prev, firstName: e.target.value } : null)}
              fullWidth
            />
            <TextField
              label="Apellido"
              value={selectedUser?.lastName || ''}
              onChange={(e) => setSelectedUser(prev => prev ? { ...prev, lastName: e.target.value } : null)}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={selectedUser?.email || ''}
              onChange={(e) => setSelectedUser(prev => prev ? { ...prev, email: e.target.value } : null)}
              fullWidth
            />
            {selectedUser?.id === 'new' && (
              <TextField
                label="Contraseña"
                type="password"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                fullWidth
                required
                helperText="Requerido para nuevos usuarios"
              />
            )}
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select
                value={selectedUser?.role || 'customer'}
                onChange={(e) => setSelectedUser(prev => prev ? { ...prev, role: e.target.value as 'admin' | 'customer' } : null)}
              >
                <MenuItem value="customer">Cliente</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={selectedUser?.isActive ? 'active' : 'inactive'}
                onChange={(e) => setSelectedUser(prev => prev ? { ...prev, isActive: e.target.value === 'active' } : null)}
              >
                <MenuItem value="active">Activo</MenuItem>
                <MenuItem value="inactive">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenDialog(false);
            setTempPassword('');
          }}>Cancelar</Button>
          <Button onClick={handleSaveUser} variant="contained">Guardar</Button>
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

export default AdminUsers;
