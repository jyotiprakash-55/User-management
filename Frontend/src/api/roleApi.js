import api from './axiosConfig';

export const roleApi = {
  // Role CRUD
  getAll: () => api.get('/roles'),
  getById: (id) => api.get(`/roles/${id}`),
  create: (data) => api.post('/roles', { name: data.name }),
  update: (id, data) => api.put(`/roles/${id}`, { name: data.name }),
  delete: (id) => api.delete(`/roles/${id}`),
  
  // Permission management
  getRolePermissions: (roleId) => api.get(`/roles/${roleId}/permissions`),
  assignPermission: (roleId, permissionId) => 
    api.post(`/roles/${roleId}/permissions`, { permissionId }),
  removePermission: (roleId, permissionId) => 
    api.delete(`/roles/${roleId}/permissions/${permissionId}`),
  
  // Batch operations for permissions
  assignPermissions: (roleId, permissionIds) => 
    api.post(`/roles/${roleId}/permissions/batch`, { permissionIds }),
  removePermissions: (roleId, permissionIds) => 
    api.delete(`/roles/${roleId}/permissions/batch`, { 
      data: { permissionIds } 
    })
}; 