import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io('http://localhost:3000', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    this.socket.on('connect', () => {
      console.log('🔌 Connecté au serveur WebSocket');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Rejoindre la room de l'utilisateur
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.id) {
        this.socket.emit('join_user_room', user.id);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Déconnecté du serveur WebSocket:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Erreur de connexion WebSocket:', error);
      this.isConnected = false;
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.warn('⚠️ Nombre maximum de tentatives de reconnexion atteint');
      }
    });

    this.socket.on('reconnect_attempt', (attempt) => {
      console.log(`🔄 Tentative de reconnexion ${attempt}/${this.maxReconnectAttempts}`);
    });

    this.socket.on('reconnect', (attempt) => {
      console.log('✅ Reconnexion réussie après', attempt, 'tentatives');
      this.isConnected = true;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.reconnectAttempts = 0;
    }
  }

  onNotification(callback) {
    if (this.socket) {
      this.socket.on('new_notification', callback);
    }
  }

  onNotificationRead(callback) {
    if (this.socket) {
      this.socket.on('notification_read', callback);
    }
  }

  markNotificationRead(notificationId) {
    if (this.socket) {
      this.socket.emit('mark_notification_read', notificationId);
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners('new_notification');
      this.socket.removeAllListeners('notification_read');
      this.socket.removeAllListeners('connected');
      this.socket.removeAllListeners('connect_error');
      this.socket.removeAllListeners('disconnect');
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }

  // Méthode pour forcer une reconnexion
  reconnect(token) {
    this.disconnect();
    setTimeout(() => this.connect(token), 1000);
  }
}

export const socketService = new SocketService();