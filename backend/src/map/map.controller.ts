// src/map/map.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { MapService } from './map.service';
import { Map } from './entities/map.entity';
import { CreateMapDto } from './dto/create-map.dto'; // ← AJOUTER CET IMPORT

@Controller('maps')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get()
  findAll(): Promise<Map[]> {
    return this.mapService.findAll();
  }

  @Get(':idMap')
  findOne(@Param('idMap') idMap: string): Promise<Map> {
    return this.mapService.findOne(+idMap);
  }

  @Post()
  create(@Body() createMapDto: CreateMapDto): Promise<Map> { // ← CHANGER LE TYPE
    return this.mapService.create(createMapDto);
  }

  @Put(':idMap')
  update(@Param('idMap') idMap: string, @Body() updateMapDto: CreateMapDto): Promise<Map> {
    return this.mapService.update(+idMap, updateMapDto);
  }

  @Delete(':idMap')
  remove(@Param('idMap') idMap: string): Promise<void> {
    return this.mapService.remove(+idMap);
  }
}