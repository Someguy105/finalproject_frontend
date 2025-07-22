import { get, post, put, del } from './client';

// Define Log types since they're not in main types
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export enum LogCategory {
  API_REQUEST = 'api_request',
  ERROR = 'error',
  AUTHENTICATION = 'authentication',
  DATABASE = 'database',
  SYSTEM = 'system',
}

export interface Log {
  id: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  userId?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  responseTime?: number;
  requestData?: any;
  responseData?: any;
  ipAddress?: string;
  userAgent?: string;
  errorDetails?: any;
  createdAt: Date;
  updatedAt: Date;
}

export const logApi = {
  // Get all logs with optional limit
  getLogs: (limit?: number): Promise<Log[]> => {
    const query = limit ? `?limit=${limit}` : '';
    return get<Log[]>(`/logs${query}`);
  },

  // Get single log by ID
  getLog: (id: string): Promise<Log> => {
    return get<Log>(`/logs/${id}`);
  },

  // Get logs by level
  getLogsByLevel: (level: LogLevel, limit?: number): Promise<Log[]> => {
    const query = limit ? `?limit=${limit}` : '';
    return get<Log[]>(`/logs/level/${level}${query}`);
  },

  // Get logs by category
  getLogsByCategory: (category: LogCategory, limit?: number): Promise<Log[]> => {
    const query = limit ? `?limit=${limit}` : '';
    return get<Log[]>(`/logs/category/${category}${query}`);
  },

  // Get logs by user ID
  getLogsByUser: (userId: string, limit?: number): Promise<Log[]> => {
    const query = limit ? `?limit=${limit}` : '';
    return get<Log[]>(`/logs/user/${userId}${query}`);
  },

  // Create new log (admin only)
  createLog: (logData: Omit<Log, 'id' | 'createdAt' | 'updatedAt'>): Promise<Log> => {
    return post<Log>('/admin/logs', logData);
  },

  // Update log (admin only)
  updateLog: (id: string, logData: Partial<Log>): Promise<Log> => {
    return put<Log>(`/admin/logs/${id}`, logData);
  },

  // Delete log (admin only)
  deleteLog: (id: string): Promise<boolean> => {
    return del<boolean>(`/admin/logs/${id}`);
  },
};
