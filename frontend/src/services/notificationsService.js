import api from './api';

export const notificationsService = {
  // Récupérer toutes les notifications
  getAllNotifications: () => api.get('/notifications'),
  
  // Récupérer les notifications d'un mécanicien
  getMechanicNotifications: (mechanicId) => api.get(`/notifications/mechanic/${mechanicId}`),
  
  // Récupérer les notifications d'un chauffeur
  //getDriverNotifications: (driverId) => api.get(`/notifications/driver/${driverId}`),

getDriverNotifications: async (driverId) => {
  return await api.get(`/notifications/driver/${driverId}`);
},
  // Récupérer les notifications non lues d'un mécanicien
  getUnreadMechanicNotifications: (mechanicId) => api.get(`/notifications/unread/mechanic/${mechanicId}`),
  
  // Récupérer le nombre de notifications non lues
  getUnreadCount: (mechanicId) => api.get(`/notifications/unread-count/mechanic/${mechanicId}`),
  
  // Créer une nouvelle notification
  createNotification: (notificationData) => api.post('/notifications', notificationData),
  
  // Marquer une notification comme lue
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  
  // Marquer toutes les notifications comme lues
  markAllAsRead: (mechanicId) => api.put(`/notifications/mark-all-read/mechanic/${mechanicId}`),
  
  // Accepter une panne
  acceptBreakdown: (id) => api.put(`/notifications/${id}/accept`),
  
  // Refuser une panne
  rejectBreakdown: (id) => api.put(`/notifications/${id}/reject`),
  
  // Résoudre une panne
  resolveBreakdown: (id) => api.put(`/notifications/${id}/resolve`),
  
  // Supprimer une notification
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  
  // Récupérer les notifications non lues d'un chauffeur
  getUnreadDriverNotifications: (driverId) => api.get(`/notifications/unread/driver/${driverId}`),
  
  // Récupérer le nombre de notifications non lues pour un chauffeur
  getUnreadDriverNotificationsCount: (driverId) => api.get(`/notifications/unread-count/driver/${driverId}`),
  
  // Marquer toutes les notifications comme lues pour un chauffeur
  markAllAsReadForDriver: (driverId) => api.put(`/notifications/mark-all-read/driver/${driverId}`),
  
  // Récupérer les réponses aux pannes pour un chauffeur
  getBreakdownResponses: (driverId) => api.get(`/notifications/breakdown-responses/${driverId}`),
  
  // Marquer une réponse de panne comme lue
  markBreakdownResponseAsRead: (notificationId) => api.put(`/notifications/breakdown-response/${notificationId}/read`)
};