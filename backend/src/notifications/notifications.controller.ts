import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  UseGuards,
  ParseIntPipe,
  ValidationPipe
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from './notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(@Body(ValidationPipe) createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  async findAll(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  @Get('mechanic/:mechanicId')
  async findByMechanic(@Param('mechanicId', ParseIntPipe) mechanicId: number): Promise<Notification[]> {
    return this.notificationsService.findByMechanic(mechanicId);
  }

  @Get('driver/:driverId')
  async findByDriver(@Param('driverId', ParseIntPipe) driverId: number): Promise<Notification[]> {
    return this.notificationsService.findByDriver(driverId);
  }

  @Get('unread/mechanic/:mechanicId')
  async findUnreadByMechanic(@Param('mechanicId', ParseIntPipe) mechanicId: number): Promise<Notification[]> {
    return this.notificationsService.findUnreadByMechanic(mechanicId);
  }

  @Get('unread-count/mechanic/:mechanicId')
  async getUnreadCount(@Param('mechanicId', ParseIntPipe) mechanicId: number): Promise<{ count: number }> {
    const count = await this.notificationsService.getUnreadCount(mechanicId);
    return { count };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Notification> {
    return this.notificationsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Put(':id/read')
  async markAsRead(@Param('id', ParseIntPipe) id: number): Promise<Notification> {
    return this.notificationsService.markAsRead(id);
  }

  @Put('mark-all-read/mechanic/:mechanicId')
  async markAllAsRead(@Param('mechanicId', ParseIntPipe) mechanicId: number): Promise<{ message: string }> {
    await this.notificationsService.markAllAsRead(mechanicId);
    return { message: 'Toutes les notifications ont été marquées comme lues' };
  }

  @Put(':id/accept')
  async acceptBreakdown(@Param('id', ParseIntPipe) id: number): Promise<Notification> {
    return this.notificationsService.acceptBreakdown(id);
  }

  @Put(':id/reject')
  async rejectBreakdown(@Param('id', ParseIntPipe) id: number): Promise<Notification> {
    return this.notificationsService.rejectBreakdown(id);
  }

  @Put(':id/resolve')
  async resolveBreakdown(@Param('id', ParseIntPipe) id: number): Promise<Notification> {
    return this.notificationsService.resolveBreakdown(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.notificationsService.remove(id);
    return { message: 'Notification supprimée avec succès' };
  }
}