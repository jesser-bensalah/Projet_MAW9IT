import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapService } from './map.service';
import { MapController } from './map.controller';
import { Map } from './entities/map.entity'; // ← IMPORT IMPORTANT

@Module({
  imports: [TypeOrmModule.forFeature([Map])], // ← AJOUTEZ CETTE LIGNE
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}