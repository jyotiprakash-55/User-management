import api from './axiosConfig';

export const permissionApi = {
  getAll: () => api.get('/permissions'),
  getById: (id) => api.get(`/permissions/${id}`),
  create: (data) => api.post('/permissions', { name: data.name }),
  update: (id, data) => api.put(`/permissions/${id}`, { name: data.name }),
  delete: (id) => api.delete(`/permissions/${id}`),
}; 