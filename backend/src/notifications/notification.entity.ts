import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum NotificationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  RESOLVED = 'resolved'
}

export enum NotificationType {
  BREAKDOWN = 'breakdown',
  ACCEPTANCE = 'acceptance',
  REJECTION = 'rejection'
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.BREAKDOWN
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING
  })
  status: NotificationStatus;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column({ default: false })
  isRead: boolean;

  // Chauffeur qui envoie la notification
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'driverId' })
  driver: User;

  @Column()
  driverId: number;

  // Mécanicien qui reçoit la notification
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'mechanicId' })
  mechanic: User;

  @Column()
  mechanicId: number;

  @Column({ nullable: true })
  vehicleInfo: string;

  @Column({ nullable: true })
  location: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  respondedAt: Date;
}