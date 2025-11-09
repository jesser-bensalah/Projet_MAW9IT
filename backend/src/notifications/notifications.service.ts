import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationStatus, NotificationType } from './notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create(createNotificationDto);
    const savedNotification = await this.notificationRepository.save(notification);

    // Envoyer la notification en temps réel via WebSocket
    if (createNotificationDto.type === NotificationType.BREAKDOWN) {
      // Envoyer au mécanicien
      this.notificationsGateway.sendToMechanic(
        createNotificationDto.mechanicId, 
        savedNotification
      );
      console.log(`📨 Notification de panne envoyée au mécanicien ${createNotificationDto.mechanicId}`);
    }

    return savedNotification;
  }

  async findAll(): Promise<Notification[]> {
    return await this.notificationRepository.find({
      relations: ['driver', 'mechanic'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['driver', 'mechanic']
    });
    
    if (!notification) {
      throw new NotFoundException('Notification non trouvée');
    }
    
    return notification;
  }

  async findByMechanic(mechanicId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { mechanicId },
      relations: ['driver', 'mechanic'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByDriver(driverId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { driverId },
      relations: ['driver', 'mechanic'],
      order: { createdAt: 'DESC' }
    });
  }

  async findUnreadByMechanic(mechanicId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { 
        mechanicId,
        isRead: false,
        status: NotificationStatus.PENDING
      },
      relations: ['driver'],
      order: { createdAt: 'DESC' }
    });
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const notification = await this.findOne(id);
    
    if (updateNotificationDto.status && updateNotificationDto.status !== notification.status) {
      updateNotificationDto.respondedAt = new Date();
    }

    await this.notificationRepository.update(id, updateNotificationDto);
    return await this.findOne(id);
  }

  async markAsRead(id: number): Promise<Notification> {
    const notification = await this.findOne(id);
    notification.isRead = true;
    const updatedNotification = await this.notificationRepository.save(notification);
    
    // Notifier via WebSocket que la notification a été lue
    this.notificationsGateway.notifyNotificationRead(notification.driverId, id);
    
    return updatedNotification;
  }

  async markAllAsRead(mechanicId: number): Promise<void> {
    await this.notificationRepository.update(
      { mechanicId, isRead: false },
      { isRead: true }
    );
  }

  async markAllAsReadForDriver(driverId: number): Promise<void> {
    await this.notificationRepository.update(
      { driverId, isRead: false },
      { isRead: true }
    );
  }

  async acceptBreakdown(id: number): Promise<Notification> {
    const notification = await this.findOne(id);
    
    if (notification.type !== NotificationType.BREAKDOWN) {
      throw new Error('Seules les pannes peuvent être acceptées');
    }

    notification.status = NotificationStatus.ACCEPTED;
    notification.respondedAt = new Date();
    
    // Créer une notification d'acceptation pour le chauffeur
    const acceptanceNotification = this.notificationRepository.create({
      type: NotificationType.ACCEPTANCE,
      title: 'Panne acceptée',
      message: `Votre panne a été acceptée par le mécanicien`,
      driverId: notification.driverId,
      mechanicId: notification.mechanicId,
      status: NotificationStatus.ACCEPTED,
      isRead: false,
      vehicleInfo: notification.vehicleInfo,
      location: notification.location
    });

    const savedAcceptanceNotification = await this.notificationRepository.save(acceptanceNotification);

    // Envoyer la notification d'acceptation au chauffeur via WebSocket
    this.notificationsGateway.sendToDriver(
      notification.driverId,
      savedAcceptanceNotification
    );

    console.log(`✅ Notification d'acceptation envoyée au chauffeur ${notification.driverId}`);

    return await this.notificationRepository.save(notification);
  }

  async rejectBreakdown(id: number): Promise<Notification> {
    const notification = await this.findOne(id);
    
    if (notification.type !== NotificationType.BREAKDOWN) {
      throw new Error('Seules les pannes peuvent être refusées');
    }

    notification.status = NotificationStatus.REJECTED;
    notification.respondedAt = new Date();

    // Créer une notification de rejet pour le chauffeur
    const rejectionNotification = this.notificationRepository.create({
      type: NotificationType.REJECTION,
      title: 'Panne refusée',
      message: `Votre panne a été refusée par le mécanicien`,
      driverId: notification.driverId,
      mechanicId: notification.mechanicId,
      status: NotificationStatus.REJECTED,
      isRead: false,
      vehicleInfo: notification.vehicleInfo,
      location: notification.location
    });

    const savedRejectionNotification = await this.notificationRepository.save(rejectionNotification);

    // Envoyer la notification de rejet au chauffeur via WebSocket
    this.notificationsGateway.sendToDriver(
      notification.driverId,
      savedRejectionNotification
    );

    console.log(`❌ Notification de rejet envoyée au chauffeur ${notification.driverId}`);

    return await this.notificationRepository.save(notification);
  }

  async resolveBreakdown(id: number): Promise<Notification> {
    const notification = await this.findOne(id);
    
    if (notification.type !== NotificationType.BREAKDOWN) {
      throw new Error('Seules les pannes peuvent être résolues');
    }

    notification.status = NotificationStatus.RESOLVED;
    notification.respondedAt = new Date();

    // Créer une notification de résolution pour le chauffeur
    const resolvedNotification = this.notificationRepository.create({
      type: NotificationType.ACCEPTANCE,
      title: 'Panne résolue',
      message: `Votre panne a été résolue par le mécanicien`,
      driverId: notification.driverId,
      mechanicId: notification.mechanicId,
      status: NotificationStatus.RESOLVED,
      isRead: false,
      vehicleInfo: notification.vehicleInfo,
      location: notification.location
    });

    const savedResolvedNotification = await this.notificationRepository.save(resolvedNotification);

    // Envoyer la notification de résolution au chauffeur via WebSocket
    this.notificationsGateway.sendToDriver(
      notification.driverId,
      savedResolvedNotification
    );

    console.log(`✔️ Notification de résolution envoyée au chauffeur ${notification.driverId}`);

    return await this.notificationRepository.save(notification);
  }

  async getUnreadCount(mechanicId: number): Promise<number> {
    return await this.notificationRepository.count({
      where: { 
        mechanicId,
        isRead: false,
        status: NotificationStatus.PENDING
      }
    });
  }

  async getUnreadCountForDriver(driverId: number): Promise<number> {
    return await this.notificationRepository.count({
      where: { 
        driverId,
        isRead: false,
        type: NotificationType.ACCEPTANCE || NotificationType.REJECTION
      }
    });
  }

  async findUnreadByDriver(driverId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { 
        driverId,
        isRead: false,
        type: NotificationType.ACCEPTANCE || NotificationType.REJECTION
      },
      relations: ['driver', 'mechanic'],
      order: { createdAt: 'DESC' }
    });
  }

  async remove(id: number): Promise<void> {
    const notification = await this.findOne(id);
    await this.notificationRepository.remove(notification);
  }

  // Méthode pour créer une notification de panne
  async createBreakdownNotification(
    driverId: number, 
    mechanicId: number, 
    vehicleInfo: string, 
    location: string
  ): Promise<Notification> {
    const breakdownNotification = this.notificationRepository.create({
      type: NotificationType.BREAKDOWN,
      title: 'Nouvelle panne signalée',
      message: `Une nouvelle panne a été signalée pour le véhicule: ${vehicleInfo}`,
      driverId: driverId,
      mechanicId: mechanicId,
      vehicleInfo: vehicleInfo,
      location: location,
      status: NotificationStatus.PENDING,
      isRead: false
    });

    return await this.create(breakdownNotification);
  }
}