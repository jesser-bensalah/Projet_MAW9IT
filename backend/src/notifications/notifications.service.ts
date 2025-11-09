import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationStatus, NotificationType } from './notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create(createNotificationDto);
    return await this.notificationRepository.save(notification);
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
    return await this.notificationRepository.save(notification);
  }

  async markAllAsRead(mechanicId: number): Promise<void> {
    await this.notificationRepository.update(
      { mechanicId, isRead: false },
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
      status: NotificationStatus.ACCEPTED
    });

    await this.notificationRepository.save(acceptanceNotification);
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
      status: NotificationStatus.REJECTED
    });

    await this.notificationRepository.save(rejectionNotification);
    return await this.notificationRepository.save(notification);
  }

  async resolveBreakdown(id: number): Promise<Notification> {
    const notification = await this.findOne(id);
    notification.status = NotificationStatus.RESOLVED;
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

  async remove(id: number): Promise<void> {
    const notification = await this.findOne(id);
    await this.notificationRepository.remove(notification);
  }
}