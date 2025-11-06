// src/map/map.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Map } from './entities/map.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(Map) private readonly mapRepository: Repository<Map>,
  ) {}

  create(createMapDto: CreateMapDto): Promise<Map> {
    const map = this.mapRepository.create(createMapDto);
    return this.mapRepository.save(map);
  }

  findAll(): Promise<Map[]> {
    return this.mapRepository.find();
  }

  async findOne(idMap: number): Promise<Map> {
    const map = await this.mapRepository.findOne({ where: { idMap } });
    if (!map) {
      throw new NotFoundException(`Map with ID ${idMap} not found`);
    }
    return map;
  }

  async update(idMap: number, updateMapDto: UpdateMapDto): Promise<Map> {
    const map = await this.findOne(idMap);
    const updatedMap = this.mapRepository.merge(map, updateMapDto);
    return this.mapRepository.save(updatedMap);
  }

  async remove(idMap: number): Promise<void> {
    const result = await this.mapRepository.delete(idMap);
    if (result.affected === 0) {
      throw new NotFoundException(`Map with ID ${idMap} not found`);
    }
  }
}