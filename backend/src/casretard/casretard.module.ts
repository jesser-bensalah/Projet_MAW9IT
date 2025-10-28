import { Module } from '@nestjs/common';
import { CasretardService } from './casretard.service';
import { CasretardController } from './casretard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Casretard } from './entities/casretard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Casretard])],
  controllers: [CasretardController],
  providers: [CasretardService],
})
export class CasretardModule {}
