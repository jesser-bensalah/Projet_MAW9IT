import { Injectable } from '@nestjs/common';
import { CreateCaspanneDto } from './dto/create-caspanne.dto';
import { UpdateCaspanneDto } from './dto/update-caspanne.dto';
import { Caspanne } from './entities/caspanne.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CaspanneService {
   constructor(
        @InjectRepository(Caspanne) private readonly casPanneRepository: Repository<Caspanne>,
      ) {}
      async create(createCaspanneDto: CreateCaspanneDto) {
        const casPanne = this.casPanneRepository.create(createCaspanneDto);
    
        return await this.casPanneRepository.save(casPanne);
      }

  findAll() {
    return this.casPanneRepository.find();
  }

  findOne(idCasPanne: number) {
    return this.casPanneRepository.find({ where : {idCasPanne}});
  }

  async update(idCasPanne: number, updateCaspanneDto: UpdateCaspanneDto) {
    
      const panne = await this.casPanneRepository.findOne({ where: { idCasPanne } });
      if (!panne) {
        throw new Error('Cas de panne non trouvé');
      }
      Object.assign(panne, updateCaspanneDto);
      return this.casPanneRepository.save(panne);
    }

  remove(idCasPanne: number) {
    return this.casPanneRepository.delete(idCasPanne);
  }
}
