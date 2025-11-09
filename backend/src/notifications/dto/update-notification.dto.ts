import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsDate } from 'class-validator';
import { CreateNotificationDto } from './create-notification.dto';
import { NotificationStatus } from '../notification.entity';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  @IsOptional()
  isRead?: boolean;
  
  @IsOptional()
  @IsDate()
  respondedAt?: Date;
}