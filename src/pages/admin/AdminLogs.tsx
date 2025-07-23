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
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  Download,
  Refresh
} from '@mui/icons-material';
import { t } from '../../utils';

interface Log {
  id: number;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  user?: string;
  action?: string;
  ipAddress?: string;
  userAgent?: string;
}

const AdminLogs: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([
    {
      id: 1,
      timestamp: '2024-01-21 10:30:15',
      level: 'info',
      message: 'Usuario juan.perez@email.com inició sesión exitosamente',
      user: 'juan.perez@email.com',
      action: 'LOGIN_SUCCESS',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 2,
      timestamp: '2024-01-21 10:25:42',
      level: 'warning',
      message: 'Intento de acceso con credenciales incorrectas',
      user: 'unknown@email.com',
      action: 'LOGIN_FAILED',
      ipAddress: '192.168.1.50',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 3,
      timestamp: '2024-01-21 10:20:33',
      level: 'error',
      message: 'Error en el servidor de base de datos - Timeout de conexión',
      action: 'DATABASE_ERROR',
      ipAddress: 'localhost',
      userAgent: 'server'
    },
    {
      id: 4,
      timestamp: '2024-01-21 10:15:21',
      level: 'info',
      message: 'Producto actualizado: Laptop Gaming Pro',
      user: 'admin@email.com',
      action: 'PRODUCT_UPDATE',
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
    },
    {
      id: 5,
      timestamp: '2024-01-21 10:10:18',
      level: 'debug',
      message: 'Cache limpiado automáticamente',
      action: 'CACHE_CLEAR',
      ipAddress: 'localhost',
      userAgent: 'system'
    },
    {
      id: 6,
      timestamp: '2024-01-21 10:05:55',
      level: 'info',
      message: 'Nueva orden creada #ORD-1234',
      user: 'maria.garcia@email.com',
      action: 'ORDER_CREATE',
      ipAddress: '192.168.1.75',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
    }
  ]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewLog = (log: Log) => {
    setSelectedLog(log);
    setOpenDialog(true);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'debug': return 'default';
      default: return 'default';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'error': return 'Error';
      case 'warning': return 'Advertencia';
      case 'info': return 'Información';
      case 'debug': return 'Debug';
      default: return level;
    }
  };

  const handleRefresh = () => {
    // En una aplicación real, esto haría una llamada a la API para obtener nuevos logs
    console.log('Refrescando logs...');
  };

  const handleExport = () => {
    // En una aplicación real, esto exportaría los logs filtrados
    console.log('Exportando logs...');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" color="primary">
          {t('manageLogs')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
          >
            Actualizar
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExport}
          >
            Exportar
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
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
            <InputLabel>{t('logLevel')}</InputLabel>
            <Select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              startAdornment={<FilterList />}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="error">Error</MenuItem>
              <MenuItem value="warning">Advertencia</MenuItem>
              <MenuItem value="info">Información</MenuItem>
              <MenuItem value="debug">Debug</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>{t('logDate')}</TableCell>
              <TableCell>{t('logLevel')}</TableCell>
              <TableCell>{t('logMessage')}</TableCell>
              <TableCell>{t('logUser')}</TableCell>
              <TableCell>Acción</TableCell>
              <TableCell>{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.id}</TableCell>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>
                    <Chip
                      label={getLevelText(log.level)}
                      color={getLevelColor(log.level) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography noWrap>
                      {log.message}
                    </Typography>
                  </TableCell>
                  <TableCell>{log.user || 'Sistema'}</TableCell>
                  <TableCell>{log.action || 'N/A'}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleViewLog(log)}
                    >
                      {t('view')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredLogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Log Detail Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Detalles del Log #{selectedLog?.id}
        </DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Fecha y Hora:
                </Typography>
                <Typography variant="body1">
                  {selectedLog.timestamp}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Nivel:
                </Typography>
                <Chip
                  label={getLevelText(selectedLog.level)}
                  color={getLevelColor(selectedLog.level) as any}
                  size="small"
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Mensaje:
                </Typography>
                <Typography variant="body1">
                  {selectedLog.message}
                </Typography>
              </Box>
              {selectedLog.user && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Usuario:
                  </Typography>
                  <Typography variant="body1">
                    {selectedLog.user}
                  </Typography>
                </Box>
              )}
              {selectedLog.action && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Acción:
                  </Typography>
                  <Typography variant="body1">
                    {selectedLog.action}
                  </Typography>
                </Box>
              )}
              {selectedLog.ipAddress && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Dirección IP:
                  </Typography>
                  <Typography variant="body1">
                    {selectedLog.ipAddress}
                  </Typography>
                </Box>
              )}
              {selectedLog.userAgent && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    User Agent:
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                    {selectedLog.userAgent}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminLogs;
