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
  Snackbar
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

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'customer';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@email.com',
      role: 'customer',
      status: 'active',
      createdAt: '2024-01-15',
      lastLogin: '2024-01-20'
    },
    {
      id: 2,
      firstName: 'María',
      lastName: 'García',
      email: 'maria.garcia@email.com',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-10',
      lastLogin: '2024-01-21'
    },
    {
      id: 3,
      firstName: 'Carlos',
      lastName: 'López',
      email: 'carlos.lopez@email.com',
      role: 'customer',
      status: 'inactive',
      createdAt: '2024-01-05',
      lastLogin: '2024-01-18'
    }
  ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

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

  const handleDeleteUser = (userId: number) => {
    if (window.confirm(t('confirmDelete'))) {
      setUsers(users.filter(user => user.id !== userId));
      setSnackbar({ open: true, message: t('itemDeleted'), severity: 'success' });
    }
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      if (selectedUser.id) {
        // Update existing user
        setUsers(users.map(user => 
          user.id === selectedUser.id ? selectedUser : user
        ));
        setSnackbar({ open: true, message: t('itemUpdated'), severity: 'success' });
      } else {
        // Create new user
        const newUser = { ...selectedUser, id: Math.max(...users.map(u => u.id)) + 1 };
        setUsers([...users, newUser]);
        setSnackbar({ open: true, message: t('itemCreated'), severity: 'success' });
      }
    }
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleAddUser = () => {
    setSelectedUser({
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      role: 'customer',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    });
    setOpenDialog(true);
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'secondary' : 'default';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'error';
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" color="primary">
          {t('manageUsers')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddUser}
        >
          {t('addUser')}
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
              <TableCell>{t('name')}</TableCell>
              <TableCell>{t('userEmail')}</TableCell>
              <TableCell>{t('role')}</TableCell>
              <TableCell>{t('userStatus')}</TableCell>
              <TableCell>Fecha Creación</TableCell>
              <TableCell>Último Acceso</TableCell>
              <TableCell>{t('actions')}</TableCell>
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
                      label={user.status === 'active' ? t('active') : t('inactive')}
                      color={getStatusColor(user.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>{user.lastLogin || 'Nunca'}</TableCell>
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
          {selectedUser?.id ? t('editUser') : t('addUser')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label={t('firstName')}
              value={selectedUser?.firstName || ''}
              onChange={(e) => setSelectedUser(prev => prev ? { ...prev, firstName: e.target.value } : null)}
              fullWidth
            />
            <TextField
              label={t('lastName')}
              value={selectedUser?.lastName || ''}
              onChange={(e) => setSelectedUser(prev => prev ? { ...prev, lastName: e.target.value } : null)}
              fullWidth
            />
            <TextField
              label={t('userEmail')}
              type="email"
              value={selectedUser?.email || ''}
              onChange={(e) => setSelectedUser(prev => prev ? { ...prev, email: e.target.value } : null)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>{t('userRole')}</InputLabel>
              <Select
                value={selectedUser?.role || 'customer'}
                onChange={(e) => setSelectedUser(prev => prev ? { ...prev, role: e.target.value as 'admin' | 'customer' } : null)}
              >
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>{t('userStatus')}</InputLabel>
              <Select
                value={selectedUser?.status || 'active'}
                onChange={(e) => setSelectedUser(prev => prev ? { ...prev, status: e.target.value as 'active' | 'inactive' } : null)}
              >
                <MenuItem value="active">{t('active')}</MenuItem>
                <MenuItem value="inactive">{t('inactive')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>{t('cancel')}</Button>
          <Button onClick={handleSaveUser} variant="contained">{t('save')}</Button>
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
