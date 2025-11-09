import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationsService } from '../../services/notificationsService';
import './DriverBellNotification.css';

const DriverBellNotification = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      loadNotifications();
      
      // Configurer le polling pour les mises à jour en temps réel
      const interval = setInterval(() => {
        loadNotifications();
      }, 30000); // Mise à jour toutes les 30 secondes
      
      return () => clearInterval(interval);
    }
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      
      // Charger toutes les notifications du chauffeur (y compris les réponses)
      const response = await notificationsService.getDriverNotifications(userId);
      
      // Filtrer pour ne garder que les notifications d'acceptation et de rejet
      const filteredNotifications = response.data.filter(
        notif => notif.type === 'acceptance' || notif.type === 'rejection' || notif.type === 'resolved'
      );
      
      // Trier les notifications par date (les plus récentes en premier)
      const sortedNotifications = filteredNotifications.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setNotifications(sortedNotifications);
      
      // Calculer le nombre de notifications non lues parmi les notifications filtrées
      const unread = sortedNotifications.filter(notif => !notif.isRead).length;
      setUnreadCount(unread);
      
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
  };

  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsReadForDriver(userId);
      setUnreadCount(0);
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Marquer comme lue
      if (!notification.isRead) {
        await notificationsService.markAsRead(notification.id);
        
        // Mettre à jour l'état local
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notification.id ? { ...notif, isRead: true } : notif
          )
        );
        
        // Mettre à jour le compteur
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      // Fermer le dropdown après un court délai
      setTimeout(() => setShowDropdown(false), 300);
      
      // Rediriger si c'est une réponse de panne
      if (notification.type === 'acceptance' || notification.type === 'rejection') {
        navigate('/cas-panne'); // Rediriger vers la page des pannes
      }
    } catch (error) {
      console.error('Erreur lors du traitement de la notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'breakdown':
        return '🔧';
      case 'acceptance':
        return '✅';
      case 'rejection':
        return '❌';
      case 'resolved':
        return '✔️';
      case 'delay':
        return '⏱️';
      case 'departure':
        return '🚗';
      default:
        return '🔔';
    }
  };
  
  const getNotificationTitle = (notification) => {
    switch (notification.type) {
      case 'breakdown':
        return 'Panne signalée';
      case 'acceptance':
        return 'Panne acceptée';
      case 'rejection':
        return 'Panne refusée';
      case 'resolved':
        return 'Panne résolue';
      case 'delay':
        return 'Retard signalé';
      case 'departure':
        return 'Départ signalé';
      default:
        return notification.title || 'Nouvelle notification';
    }
  };
  
  const getNotificationMessage = (notification) => {
    if (notification.message) return notification.message;
    
    switch (notification.type) {
      case 'acceptance':
        return `Le mécanicien ${notification.mechanic?.prenom || 'a accepté'} votre demande d'intervention.`;
      case 'rejection':
        return `Le mécanicien ${notification.mechanic?.prenom || 'a refusé'} votre demande d'intervention.`;
      case 'resolved':
        return `La panne a été marquée comme résolue par le mécanicien ${notification.mechanic?.prenom || ''}.`;
      default:
        return 'Vous avez une nouvelle notification';
    }
  };

  const getNotificationClass = (notification) => {
    const baseClass = `notification-item ${notification.type || ''}`;
    return notification.isRead ? baseClass : `${baseClass} unread`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays < 7) return `Il y a ${diffDays} j`;
    
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="bell-notification-container" ref={dropdownRef}>
      <div className="bell-icon" onClick={handleBellClick}>
        <span className={`bell ${unreadCount > 0 ? 'bell-ring' : ''}`}>🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>

      {showDropdown && (
        <div className="notifications-dropdown">
          <div className="dropdown-header">
            <h3>Notifications ({unreadCount})</h3>
            {unreadCount > 0 && (
              <button 
                className="mark-all-read" 
                onClick={markAllAsRead}
                disabled={isLoading}
              >
                {isLoading ? '...' : 'Tout marquer comme lu'}
              </button>
            )}
          </div>

          <div className="notifications-list">
            {isLoading ? (
              <div className="loading-notifications">
                <div className="loading-spinner"></div>
                <p>Chargement des notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="no-notifications">
                Aucune notification
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={getNotificationClass(notification)}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">
                      {getNotificationTitle(notification)}
                    </div>
                    <div className="notification-message">
                      {getNotificationMessage(notification)}
                    </div>
                    {notification.mechanic && (
                      <div className="notification-sender">
                        Mécanicien : {notification.mechanic.prenom} {notification.mechanic.nom}
                      </div>
                    )}
                    <div className="notification-time">
                      {formatDate(notification.createdAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverBellNotification;