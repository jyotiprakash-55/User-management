import api from '../utils/axios';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  getUserPermissions: () => api.get('/auth/permissions'),
}; 