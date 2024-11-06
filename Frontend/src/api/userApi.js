import api from './axiosConfig';

export const userApi = {
  // User CRUD
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  
  // Role management
  getUserRoles: (userId) => api.get(`/users/${userId}/roles`),
  assignRole: (userId, roleId) => api.post(`/users/${userId}/roles`, { roleId }),
  removeRole: (userId, roleId) => api.delete(`/users/${userId}/roles/${roleId}`),
  
  // Permission management
  getUserPermissions: (userId) => api.get(`/users/${userId}/permissions`),
  getAllUserPermissions: (userId) => api.get(`/users/${userId}/all-permissions`),
  assignPermission: (userId, permissionIds) => api.post(`/users/${userId}/permissions/batch`, { permissionIds }),
  removePermission: (userId, permissionIds) => api.delete(`/users/${userId}/permissions/batch`, { data: { permissionIds } }),
  
  // Add this method to userApi
  assignRoles: (userId, roleIds) => 
    api.post(`/users/${userId}/roles/batch`, { roleIds }),
}; 