import api from './api';

export const usersService = {
  getAllUsers: () => api.get('/users'),
  
  getUserById: (id) => api.get(`/users/${id}`),
  
  createUser: (userData) => api.post('/users', userData),
  
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  
  deleteUser: (id) => api.delete(`/users/${id}`),
  
  getUsersByRole: (role) => api.get(`/users/role/${role}`),
  
  getDrivers: () => api.get('/users/role/chauffeur'),
  getMechanics: () => api.get('/users/role/mecanicien'),
  // getPassengers: () => api.get('/users/role/passager'),
  getAdmins: () => api.get('/users/role/admin'),
};