// src/caspanne/caspanne.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCaspanneDto } from './dto/create-caspanne.dto';
import { UpdateCaspanneDto } from './dto/update-caspanne.dto';
import { Caspanne } from './entities/caspanne.entity';

@Injectable()
export class CaspanneService {
  constructor(
    @InjectRepository(Caspanne)
    private readonly casPanneRepository: Repository<Caspanne>,
  ) { }

 
  async create(createCaspanneDto: CreateCaspanneDto): Promise<Caspanne> {
    const casPanne = this.casPanneRepository.create(createCaspanneDto);
    return await this.casPanneRepository.save(casPanne);
  }

 
  async findAll(): Promise<Caspanne[]> {
    return await this.casPanneRepository.find();
  }

  
  async findOne(idCasPanne: number): Promise<Caspanne> {
    const caspanne = await this.casPanneRepository.findOneBy({ idCasPanne });
    if (!caspanne) {
      throw new NotFoundException(`Cas de panne avec l'ID ${idCasPanne} non trouvé`);
    }
    return caspanne;
  }

 
  async update(idCasPanne: number, updateCaspanneDto: UpdateCaspanneDto): Promise<Caspanne> {
    const panne = await this.casPanneRepository.findOneBy({ idCasPanne });
    if (!panne) {
      throw new NotFoundException(`Cas de panne avec l'ID ${idCasPanne} non trouvé`);
    }
    Object.assign(panne, updateCaspanneDto);
    return await this.casPanneRepository.save(panne);
  }

  
  async remove(idCasPanne: number): Promise<void> {
    await this.casPanneRepository.delete(idCasPanne);
  }
}

