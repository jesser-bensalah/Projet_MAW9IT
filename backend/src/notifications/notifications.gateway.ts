import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JwtSecretService } from '../auth/jwt-secret.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3000'], // vos URLs frontend
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<number, string>(); // userId -> socketId

  constructor(
    private jwtService: JwtService,
    private jwtSecretService: JwtSecretService,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        console.log('❌ Connexion WebSocket refusée: token manquant');
        socket.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecretService.getSecret(),
      });

      // Stocker la connexion utilisateur
      this.connectedUsers.set(payload.sub, socket.id);
      console.log(`🔌 Utilisateur ${payload.sub} (${payload.role}) connecté (socket: ${socket.id})`);

      // Rejoindre une room spécifique à l'utilisateur
      socket.join(`user_${payload.sub}`);
      
      // Informer l'utilisateur de sa connexion réussie
      socket.emit('connected', { 
        message: 'Connecté au service de notifications en temps réel',
        userId: payload.sub 
      });
      
    } catch (error) {
      console.error('❌ Erreur de connexion WebSocket:', error.message);
      socket.emit('connection_error', { message: 'Token invalide' });
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    // Retirer l'utilisateur de la liste des connectés
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === socket.id) {
        this.connectedUsers.delete(userId);
        console.log(`🔌 Utilisateur ${userId} déconnecté`);
        break;
      }
    }
  }

  // Envoyer une notification à un chauffeur spécifique
  sendToDriver(driverId: number, notification: any) {
    const socketId = this.connectedUsers.get(driverId);
    if (socketId) {
      this.server.to(socketId).emit('new_notification', notification);
      console.log(`📨 Notification envoyée au chauffeur ${driverId}`);
    } else {
      console.log(`⚠️ Chauffeur ${driverId} non connecté - notification stockée en base`);
    }
    
    // Émettre aussi dans la room de l'utilisateur pour les multiples connexions
    this.server.to(`user_${driverId}`).emit('new_notification', notification);
  }

  // Envoyer une notification à un mécanicien spécifique
  sendToMechanic(mechanicId: number, notification: any) {
    const socketId = this.connectedUsers.get(mechanicId);
    if (socketId) {
      this.server.to(socketId).emit('new_notification', notification);
      console.log(`📨 Notification envoyée au mécanicien ${mechanicId}`);
    } else {
      console.log(`⚠️ Mécanicien ${mechanicId} non connecté - notification stockée en base`);
    }
    
    // Émettre aussi dans la room de l'utilisateur
    this.server.to(`user_${mechanicId}`).emit('new_notification', notification);
  }

  // Notifier qu'une notification a été lue
  notifyNotificationRead(userId: number, notificationId: number) {
    this.server.to(`user_${userId}`).emit('notification_read', { 
      notificationId,
      readAt: new Date()
    });
  }

  // Écouter les événements du client
  @SubscribeMessage('join_user_room')
  handleJoinUserRoom(@ConnectedSocket() socket: Socket, @MessageBody() userId: number) {
    socket.join(`user_${userId}`);
    console.log(`🚪 Socket ${socket.id} a rejoint la room user_${userId}`);
  }

  @SubscribeMessage('mark_notification_read')
  handleMarkNotificationRead(@ConnectedSocket() socket: Socket, @MessageBody() notificationId: number) {
    console.log(`📖 Notification ${notificationId} marquée comme lue par ${socket.id}`);
    // Émettre un événement pour mettre à jour les autres clients
    this.server.emit('notification_read', { 
      notificationId, 
      socketId: socket.id,
      readAt: new Date()
    });
  }

  @SubscribeMessage('get_online_users')
  handleGetOnlineUsers(@ConnectedSocket() socket: Socket) {
    const onlineUsers = Array.from(this.connectedUsers.keys());
    socket.emit('online_users', onlineUsers);
    console.log(`👥 Utilisateurs en ligne: ${onlineUsers.length}`);
  }

  // Méthode utilitaire pour vérifier si un utilisateur est en ligne
  isUserOnline(userId: number): boolean {
    return this.connectedUsers.has(userId);
  }

  // Obtenir le socket ID d'un utilisateur
  getUserSocketId(userId: number): string | undefined {
    return this.connectedUsers.get(userId);
  }
}