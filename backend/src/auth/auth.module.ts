import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtSecretService } from './jwt-secret.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule, 
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtSecretService, JwtAuthGuard],
  exports: [AuthService, JwtSecretService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
