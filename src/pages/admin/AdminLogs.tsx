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
  DialogActions,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  Download,
  Refresh,
  Add,
  Edit,
  Delete
} from '@mui/icons-material';
import { t } from '../../utils';
import { logApi, Log as BackendLog, LogLevel, LogCategory } from '../../api/logs';

const AdminLogs: React.FC = () => {
  const [logs, setLogs] = useState<BackendLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<BackendLog | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [formLog, setFormLog] = useState<Partial<BackendLog>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Load logs from backend
  useEffect(() => {
    const loadLogs = async () => {
      try {
        setLoading(true);
        const response = await logApi.getLogs();
        
        // Backend returns {success: true, data: [...]}
        const logsData = (response as any).data || response;
        
        // Map backend logs to our interface
        const mappedLogs: BackendLog[] = (Array.isArray(logsData) ? logsData : []).map((log: any) => ({
          id: log._id,
          level: log.level,
          category: log.category,
          message: log.message,
          userId: log.userId,
          endpoint: log.metadata?.endpoint,
          method: log.metadata?.method,
          statusCode: log.metadata?.statusCode,
          responseTime: log.metadata?.responseTime,
          requestData: log.metadata?.requestData,
          responseData: log.metadata?.responseData,
          ipAddress: log.metadata?.ip,
          userAgent: log.metadata?.userAgent,
          errorDetails: log.metadata?.errorDetails,
          createdAt: log.createdAt,
          updatedAt: log.updatedAt
        }));
        
        setLogs(mappedLogs);
      } catch (error) {
        console.error('Error loading logs:', error);
        setSnackbar({ 
          open: true, 
          message: 'Error cargando logs', 
          severity: 'error' 
        });
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.userId || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewLog = (log: BackendLog) => {
    setSelectedLog(log);
    setOpenDialog(true);
  };

  const handleCreateLog = () => {
    setFormLog({
      level: LogLevel.INFO,
      category: 'system' as LogCategory,
      message: '',
      userId: '',
      ipAddress: '',
      userAgent: ''
    });
    setOpenFormDialog(true);
  };

  const handleEditLog = (log: BackendLog) => {
    setFormLog({
      id: log.id,
      level: log.level,
      category: log.category,
      message: log.message,
      userId: log.userId,
      endpoint: log.endpoint,
      method: log.method,
      statusCode: log.statusCode,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent
    });
    setOpenFormDialog(true);
  };

  const handleSaveLog = async () => {
    try {
      if (formLog.id) {
        // Update existing log
        const response = await logApi.updateLog(formLog.id, {
          level: formLog.level!,
          category: formLog.category!,
          message: formLog.message!,
          userId: formLog.userId,
          endpoint: formLog.endpoint,
          method: formLog.method,
          statusCode: formLog.statusCode,
          ipAddress: formLog.ipAddress,
          userAgent: formLog.userAgent
        });
        
        // Map the response data
        const updatedLog: BackendLog = {
          id: (response as any).data?._id || (response as any)._id,
          level: (response as any).data?.level || (response as any).level,
          category: (response as any).data?.category || (response as any).category,
          message: (response as any).data?.message || (response as any).message,
          userId: (response as any).data?.userId || (response as any).userId,
          endpoint: (response as any).data?.metadata?.endpoint || (response as any).metadata?.endpoint,
          method: (response as any).data?.metadata?.method || (response as any).metadata?.method,
          statusCode: (response as any).data?.metadata?.statusCode || (response as any).metadata?.statusCode,
          responseTime: (response as any).data?.metadata?.responseTime || (response as any).metadata?.responseTime,
          requestData: (response as any).data?.metadata?.requestData || (response as any).metadata?.requestData,
          responseData: (response as any).data?.metadata?.responseData || (response as any).metadata?.responseData,
          ipAddress: (response as any).data?.metadata?.ip || (response as any).metadata?.ip,
          userAgent: (response as any).data?.metadata?.userAgent || (response as any).metadata?.userAgent,
          errorDetails: (response as any).data?.metadata?.errorDetails || (response as any).metadata?.errorDetails,
          createdAt: (response as any).data?.createdAt || (response as any).createdAt,
          updatedAt: (response as any).data?.updatedAt || (response as any).updatedAt
        };
        
        setLogs(logs.map(log =>
          log.id === formLog.id ? updatedLog : log
        ));
        setSnackbar({ open: true, message: 'Log actualizado exitosamente', severity: 'success' });
      } else {
        // Create new log
        const newLogData = {
          level: formLog.level!,
          category: formLog.category!,
          message: formLog.message!,
          userId: formLog.userId,
          endpoint: formLog.endpoint,
          method: formLog.method,
          statusCode: formLog.statusCode,
          ipAddress: formLog.ipAddress,
          userAgent: formLog.userAgent
        };
        
        const response = await logApi.createLog(newLogData);
        
        // Map the response data
        const createdLog: BackendLog = {
          id: (response as any).data?._id || (response as any)._id,
          level: (response as any).data?.level || (response as any).level,
          category: (response as any).data?.category || (response as any).category,
          message: (response as any).data?.message || (response as any).message,
          userId: (response as any).data?.userId || (response as any).userId,
          endpoint: (response as any).data?.metadata?.endpoint || (response as any).metadata?.endpoint,
          method: (response as any).data?.metadata?.method || (response as any).metadata?.method,
          statusCode: (response as any).data?.metadata?.statusCode || (response as any).metadata?.statusCode,
          responseTime: (response as any).data?.metadata?.responseTime || (response as any).metadata?.responseTime,
          requestData: (response as any).data?.metadata?.requestData || (response as any).metadata?.requestData,
          responseData: (response as any).data?.metadata?.responseData || (response as any).metadata?.responseData,
          ipAddress: (response as any).data?.metadata?.ip || (response as any).metadata?.ip,
          userAgent: (response as any).data?.metadata?.userAgent || (response as any).metadata?.userAgent,
          errorDetails: (response as any).data?.metadata?.errorDetails || (response as any).metadata?.errorDetails,
          createdAt: (response as any).data?.createdAt || (response as any).createdAt,
          updatedAt: (response as any).data?.updatedAt || (response as any).updatedAt
        };
        
        setLogs([...logs, createdLog]);
        setSnackbar({ open: true, message: 'Log creado exitosamente', severity: 'success' });
      }
      
      setOpenFormDialog(false);
      setFormLog({});
    } catch (error) {
      console.error('Error saving log:', error);
      setSnackbar({ open: true, message: 'Error guardando log', severity: 'error' });
    }
  };

  const handleDeleteLog = async (logId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este log?')) {
      try {
        const response = await logApi.deleteLog(logId);
        // Check if deletion was successful (backend returns {data: true})
        if ((response as any).data === true || response === true) {
          setLogs(logs.filter(log => log.id !== logId));
          setSnackbar({ open: true, message: 'Log eliminado', severity: 'success' });
        } else {
          throw new Error('Delete operation failed');
        }
      } catch (error) {
        console.error('Error deleting log:', error);
        setSnackbar({ open: true, message: 'Error eliminando log', severity: 'error' });
      }
    }
  };

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case LogLevel.ERROR: return 'error';
      case LogLevel.WARN: return 'warning';
      case LogLevel.INFO: return 'info';
      case LogLevel.DEBUG: return 'default';
      default: return 'default';
    }
  };

  const getLevelText = (level: LogLevel) => {
    switch (level) {
      case LogLevel.ERROR: return 'Error';
      case LogLevel.WARN: return 'Advertencia';
      case LogLevel.INFO: return 'Información';
      case LogLevel.DEBUG: return 'Debug';
      default: return level;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'api_request': return 'API Request';
      case 'error': return 'Error';
      case 'authentication': return 'Autenticación';
      case 'user_action': return 'Acción Usuario';
      case 'database': return 'Base de Datos';
      case 'system': return 'Sistema';
      case 'payment': return 'Pago';
      default: return category;
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const response = await logApi.getLogs();
      
      // Backend returns {success: true, data: [...]}
      const logsData = (response as any).data || response;
      
      // Map backend logs to our interface
      const mappedLogs: BackendLog[] = (Array.isArray(logsData) ? logsData : []).map((log: any) => ({
        id: log._id,
        level: log.level,
        category: log.category,
        message: log.message,
        userId: log.userId,
        endpoint: log.metadata?.endpoint,
        method: log.metadata?.method,
        statusCode: log.metadata?.statusCode,
        responseTime: log.metadata?.responseTime,
        requestData: log.metadata?.requestData,
        responseData: log.metadata?.responseData,
        ipAddress: log.metadata?.ip,
        userAgent: log.metadata?.userAgent,
        errorDetails: log.metadata?.errorDetails,
        createdAt: log.createdAt,
        updatedAt: log.updatedAt
      }));
      
      setLogs(mappedLogs);
      setSnackbar({ open: true, message: 'Logs actualizados', severity: 'success' });
    } catch (error) {
      console.error('Error refreshing logs:', error);
      setSnackbar({ open: true, message: 'Error actualizando logs', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(filteredLogs, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `logs_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setSnackbar({ open: true, message: 'Logs exportados exitosamente', severity: 'success' });
    } catch (error) {
      console.error('Error exporting logs:', error);
      setSnackbar({ open: true, message: 'Error exportando logs', severity: 'error' });
    }
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
          {t('manageLogs')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateLog}
          >
            Crear Log
          </Button>
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
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>{t('logLevel')}</InputLabel>
            <Select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value={LogLevel.ERROR}>Error</MenuItem>
              <MenuItem value={LogLevel.WARN}>Advertencia</MenuItem>
              <MenuItem value={LogLevel.INFO}>Información</MenuItem>
              <MenuItem value={LogLevel.DEBUG}>Debug</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="all">Todas</MenuItem>
              <MenuItem value="api_request">API Request</MenuItem>
              <MenuItem value="error">Error</MenuItem>
              <MenuItem value="authentication">Autenticación</MenuItem>
              <MenuItem value="user_action">Acción Usuario</MenuItem>
              <MenuItem value="database">Base de Datos</MenuItem>
              <MenuItem value="system">Sistema</MenuItem>
              <MenuItem value="payment">Pago</MenuItem>
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
              <TableCell>Categoría</TableCell>
              <TableCell>{t('logMessage')}</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.id ? log.id.slice(-6) : 'N/A'}</TableCell>
                  <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={getLevelText(log.level)}
                      color={getLevelColor(log.level) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getCategoryText(log.category)}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography noWrap>
                      {log.message}
                    </Typography>
                  </TableCell>
                  <TableCell>{log.userId || 'Sistema'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={() => handleViewLog(log)} size="small">
                        <Visibility />
                      </IconButton>
                      <IconButton onClick={() => handleEditLog(log)} size="small" color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDeleteLog(log.id)} 
                        size="small" 
                        color="error"
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
          Detalles del Log #{selectedLog?.id ? selectedLog.id.slice(-6) : 'N/A'}
        </DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Fecha y Hora:
                </Typography>
                <Typography variant="body1">
                  {new Date(selectedLog.createdAt).toLocaleString()}
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
                  Categoría:
                </Typography>
                <Chip
                  label={getCategoryText(selectedLog.category)}
                  variant="outlined"
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
              {selectedLog.userId && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Usuario ID:
                  </Typography>
                  <Typography variant="body1">
                    {selectedLog.userId}
                  </Typography>
                </Box>
              )}
              {selectedLog.endpoint && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Endpoint:
                  </Typography>
                  <Typography variant="body1">
                    {selectedLog.method} {selectedLog.endpoint}
                  </Typography>
                </Box>
              )}
              {selectedLog.statusCode && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Código de Estado:
                  </Typography>
                  <Typography variant="body1">
                    {selectedLog.statusCode}
                  </Typography>
                </Box>
              )}
              {selectedLog.responseTime && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Tiempo de Respuesta:
                  </Typography>
                  <Typography variant="body1">
                    {selectedLog.responseTime}ms
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
              {selectedLog.errorDetails && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Detalles del Error:
                  </Typography>
                  <Typography variant="body2" component="pre" sx={{ fontSize: '0.875rem', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                    {JSON.stringify(selectedLog.errorDetails, null, 2)}
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

      {/* Create/Edit Log Form Dialog */}
      <Dialog open={openFormDialog} onClose={() => setOpenFormDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {formLog.id ? 'Editar Log' : 'Crear Nuevo Log'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Nivel</InputLabel>
              <Select
                value={formLog.level || LogLevel.INFO}
                onChange={(e) => setFormLog({...formLog, level: e.target.value as LogLevel})}
              >
                <MenuItem value={LogLevel.DEBUG}>Debug</MenuItem>
                <MenuItem value={LogLevel.INFO}>Información</MenuItem>
                <MenuItem value={LogLevel.WARN}>Advertencia</MenuItem>
                <MenuItem value={LogLevel.ERROR}>Error</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={formLog.category || 'system'}
                onChange={(e) => setFormLog({...formLog, category: e.target.value as LogCategory})}
              >
                <MenuItem value="system">Sistema</MenuItem>
                <MenuItem value="api_request">API Request</MenuItem>
                <MenuItem value="authentication">Autenticación</MenuItem>
                <MenuItem value="user_action">Acción Usuario</MenuItem>
                <MenuItem value="database">Base de Datos</MenuItem>
                <MenuItem value="error">Error</MenuItem>
                <MenuItem value="payment">Pago</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Mensaje"
              value={formLog.message || ''}
              onChange={(e) => setFormLog({...formLog, message: e.target.value})}
              multiline
              rows={3}
              fullWidth
              required
            />

            <TextField
              label="Usuario ID"
              value={formLog.userId || ''}
              onChange={(e) => setFormLog({...formLog, userId: e.target.value})}
              fullWidth
            />

            <TextField
              label="Endpoint"
              value={formLog.endpoint || ''}
              onChange={(e) => setFormLog({...formLog, endpoint: e.target.value})}
              fullWidth
            />

            <TextField
              label="Método HTTP"
              value={formLog.method || ''}
              onChange={(e) => setFormLog({...formLog, method: e.target.value})}
              fullWidth
            />

            <TextField
              label="Código de Estado"
              type="number"
              value={formLog.statusCode || ''}
              onChange={(e) => setFormLog({...formLog, statusCode: parseInt(e.target.value) || undefined})}
              fullWidth
            />

            <TextField
              label="Dirección IP"
              value={formLog.ipAddress || ''}
              onChange={(e) => setFormLog({...formLog, ipAddress: e.target.value})}
              fullWidth
            />

            <TextField
              label="User Agent"
              value={formLog.userAgent || ''}
              onChange={(e) => setFormLog({...formLog, userAgent: e.target.value})}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenFormDialog(false);
            setFormLog({});
          }}>
            Cancelar
          </Button>
          <Button onClick={handleSaveLog} variant="contained">
            {formLog.id ? 'Actualizar' : 'Crear'}
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

export default AdminLogs;
