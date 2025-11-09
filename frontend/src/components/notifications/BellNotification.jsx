import React, { useState, useEffect, useRef } from 'react';
import { notificationsService } from '../../services/notificationsService';
import './BellNotification.css';

const BellNotification = ({ userId, userRole }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (userId && userRole === 'mecanicien') {
      loadUnreadCount();
      loadUnreadNotifications();
    }
  }, [userId, userRole]);

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

  const loadUnreadCount = async () => {
    try {
      const response = await notificationsService.getUnreadCount(userId);
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Erreur lors du chargement du compteur:', error);
    }
  };

  const loadUnreadNotifications = async () => {
    try {
      const response = await notificationsService.getUnreadMechanicNotifications(userId);
      setNotifications(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    }
  };

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown && unreadCount > 0) {
      markAllAsRead();
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead(userId);
      setUnreadCount(0);
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      await notificationsService.markAsRead(notificationId);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'breakdown':
        return '🚨';
      case 'acceptance':
        return '✅';
      case 'rejection':
        return '❌';
      default:
        return '🔔';
    }
  };

  const getNotificationClass = (type) => {
    switch (type) {
      case 'breakdown':
        return 'notification-breakdown';
      case 'acceptance':
        return 'notification-accepted';
      case 'rejection':
        return 'notification-rejected';
      default:
        return 'notification-default';
    }
  };

  if (userRole !== 'mecanicien') {
    return null;
  }

  return (
    <div className="bell-notification-container" ref={dropdownRef}>
      <div className="bell-icon" onClick={handleBellClick}>
        <span className="bell">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      {showDropdown && (
        <div className="notifications-dropdown">
          <div className="dropdown-header">
            <h3>Notifications ({unreadCount})</h3>
            {unreadCount > 0 && (
              <button className="mark-all-read" onClick={markAllAsRead}>
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                Aucune nouvelle notification
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${getNotificationClass(notification.type)} ${
                    notification.isRead ? 'read' : 'unread'
                  }`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-meta">
                      De: {notification.driver?.prenom} {notification.driver?.nom}
                    </div>
                    <div className="notification-time">
                      {new Date(notification.createdAt).toLocaleString('fr-FR')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="dropdown-footer">
            <a href="/mechanic/breakdowns" className="view-all-link">
              Voir toutes les alertes
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default BellNotification;