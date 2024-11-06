import api from '../utils/axios';

export const userApi = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  assignRole: (userId, roleId) => api.post(`/users/${userId}/roles`, { roleId }),
  removeRole: (userId, roleId) => api.delete(`/users/${userId}/roles/${roleId}`),
  getUserRoles: (userId) => api.get(`/users/${userId}/roles`),
  assignPermission: (userId, permissionId) => 
    api.post(`/users/${userId}/permissions`, { permissionId }),
  removePermission: (userId, permissionId) => 
    api.delete(`/users/${userId}/permissions/${permissionId}`),
  getUserPermissions: (userId) => api.get(`/users/${userId}/permissions`),
}; 