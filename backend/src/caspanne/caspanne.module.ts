import { Module } from '@nestjs/common';
import { CaspanneService } from './caspanne.service';
import { CaspanneController } from './caspanne.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caspanne } from './entities/caspanne.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Caspanne])],
  controllers: [CaspanneController],
  providers: [CaspanneService],
})
export class CaspanneModule {}
