import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationsService } from '../../services/notificationsService';
import { socketService } from '../../services/socketService';
import './DriverBellNotification.css';

const DriverBellNotification = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      // Charger les notifications initiales
      loadNotifications();
      
      // Configurer WebSocket
      setupWebSocket();
      
      return () => {
        // Nettoyer les listeners WebSocket à la destruction du composant
        socketService.removeAllListeners();
      };
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

  const setupWebSocket = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Se connecter au WebSocket
        const socket = socketService.connect(token);
        
        // Écouter les événements de connexion
        socket.on('connected', (data) => {
          console.log('🔌 Connecté au service de notifications en temps réel');
          setIsConnected(true);
        });

        // Écouter les nouvelles notifications en temps réel
        socketService.onNotification((newNotification) => {
          console.log('📨 Nouvelle notification reçue en temps réel:', newNotification);
          
          // Vérifier que c'est une notification pour cet utilisateur
          if (newNotification.driverId === userId) {
            handleNewNotification(newNotification);
          }
        });

        // Écouter les notifications marquées comme lues
        socketService.onNotificationRead((data) => {
          console.log('📖 Notification marquée comme lue:', data);
        });

        // Écouter les erreurs de connexion
        socket.on('connect_error', (error) => {
          console.error('❌ Erreur de connexion WebSocket:', error);
          setIsConnected(false);
        });

        // Écouter la déconnexion
        socket.on('disconnect', (reason) => {
          console.log('🔌 Déconnecté du WebSocket:', reason);
          setIsConnected(false);
        });

      } catch (error) {
        console.error('❌ Erreur lors de la configuration WebSocket:', error);
      }
    } else {
      console.warn('⚠️ Token non trouvé, WebSocket non initialisé');
    }
  };

  const handleNewNotification = (newNotification) => {
    // Vérifier que c'est une notification de type réponse (acceptance, rejection, resolved)
    const isResponseNotification = 
      newNotification.type === 'acceptance' || 
      newNotification.type === 'rejection' || 
      newNotification.type === 'resolved';

    if (isResponseNotification) {
      setNotifications(prev => {
        // Éviter les doublons
        const exists = prev.find(n => n.id === newNotification.id);
        if (exists) return prev;
        
        // Ajouter la nouvelle notification en haut de la liste
        return [newNotification, ...prev];
      });
      
      // Incrémenter le compteur de notifications non lues
      setUnreadCount(prev => prev + 1);
      
      // Jouer un son de notification (optionnel)
      playNotificationSound();
      
      // Afficher une notification toast (optionnel)
      showToastNotification(newNotification);
    }
  };

  const playNotificationSound = () => {
    // Créer un son de notification simple
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('🔇 Audio non supporté');
    }
  };

  const showToastNotification = (notification) => {
    // Créer une notification toast native du navigateur
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(getNotificationTitle(notification), {
        body: getNotificationMessage(notification),
        icon: '/favicon.ico',
        tag: 'maw9it-notification'
      });
    }
    
    // Demander la permission si ce n'est pas déjà fait
    else if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(getNotificationTitle(notification), {
            body: getNotificationMessage(notification),
            icon: '/favicon.ico'
          });
        }
      });
    }
  };

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      
      // Charger toutes les notifications du chauffeur
      const response = await notificationsService.getDriverNotifications(userId);
      
      // Filtrer pour ne garder que les notifications d'acceptation, rejet et résolution
      const filteredNotifications = response.data.filter(
        notif => notif.type === 'acceptance' || notif.type === 'rejection' || notif.type === 'resolved'
      );
      
      // Trier les notifications par date (les plus récentes en premier)
      const sortedNotifications = filteredNotifications.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setNotifications(sortedNotifications);
      
      // Calculer le nombre de notifications non lues
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
    
    // Si on ouvre le dropdown et qu'il y a des notifications non lues, on peut optionnellement les marquer comme lues
    if (!showDropdown && unreadCount > 0) {
      // Option: Marquer automatiquement comme lues quand on ouvre
      // markAllAsRead();
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsReadForDriver(userId);
      setUnreadCount(0);
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      
      // Notifier via WebSocket que toutes les notifications ont été lues
      notifications.forEach(notification => {
        if (!notification.isRead) {
          socketService.markNotificationRead(notification.id);
        }
      });
      
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Marquer comme lue si ce n'est pas déjà fait
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
        
        // Notifier via WebSocket
        socketService.markNotificationRead(notification.id);
      }
      
      // Fermer le dropdown après un court délai
      setTimeout(() => setShowDropdown(false), 300);
      
      // Rediriger vers la page appropriée selon le type de notification
      if (notification.type === 'acceptance' || notification.type === 'rejection' || notification.type === 'resolved') {
        navigate('/liste-cas-panne'); // Rediriger vers la liste des pannes
      }
    } catch (error) {
      console.error('Erreur lors du traitement de la notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'acceptance':
        return '✅';
      case 'rejection':
        return '❌';
      case 'resolved':
        return '✔️';
      default:
        return '🔔';
    }
  };
  
  const getNotificationTitle = (notification) => {
    switch (notification.type) {
      case 'acceptance':
        return 'Panne Acceptée ✅';
      case 'rejection':
        return 'Panne Refusée ❌';
      case 'resolved':
        return 'Panne Résolue ✔️';
      default:
        return notification.title || 'Réponse du mécanicien';
    }
  };
  
  const getNotificationMessage = (notification) => {
    if (notification.message) return notification.message;
    
    switch (notification.type) {
      case 'acceptance':
        return `Votre panne a été acceptée par le mécanicien. Il interviendra rapidement.`;
      case 'rejection':
        return `Votre panne a été refusée par le mécanicien. Veuillez contacter un autre mécanicien.`;
      case 'resolved':
        return `Votre panne a été marquée comme résolue par le mécanicien.`;
      default:
        return 'Réponse concernant votre panne';
    }
  };

  const getStatusText = (type) => {
    switch (type) {
      case 'acceptance':
        return 'Acceptée';
      case 'rejection':
        return 'Refusée';
      case 'resolved':
        return 'Résolue';
      default:
        return 'Traitée';
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

  const handleReloadNotifications = () => {
    loadNotifications();
  };

  return (
    <div className="bell-notification-container" ref={dropdownRef}>
      <div className="bell-icon" onClick={handleBellClick}>
        <span className={`bell ${unreadCount > 0 ? 'bell-ring bell-pulse' : ''} ${isConnected ? 'connected' : 'disconnected'}`}>
          {unreadCount > 0 ? '🔔' : '🔕'}
        </span>
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {!isConnected && (
          <span className="connection-indicator" title="Déconnecté">
            🔴
          </span>
        )}
      </div>

      {showDropdown && (
        <div className="notifications-dropdown">
          <div className="dropdown-header">
            <div className="header-top">
              <h3>Réponses Mécaniciens ({unreadCount})</h3>
              <div className="header-actions">
                <button 
                  className="reload-btn"
                  onClick={handleReloadNotifications}
                  title="Rafraîchir"
                  disabled={isLoading}
                >
                  🔄
                </button>
                {!isConnected && (
                  <span className="ws-status" title="Connexion WebSocket perdue">
                    🔴
                  </span>
                )}
              </div>
            </div>
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
                <p>Chargement des réponses...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="no-notifications">
                <p>Aucune réponse de mécanicien</p>
                <small>Les réponses à vos pannes apparaîtront ici</small>
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
                        <strong>Mécanicien :</strong> {notification.mechanic.prenom} {notification.mechanic.nom}
                      </div>
                    )}
                    <div className="notification-status">
                      <strong>Statut :</strong> {getStatusText(notification.type)}
                    </div>
                    <div className="notification-time">
                      {formatDate(notification.createdAt)}
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="dropdown-footer">
              <button 
                className="view-all-breakdowns"
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/liste-cas-panne');
                }}
              >
                Voir toutes mes pannes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DriverBellNotification;