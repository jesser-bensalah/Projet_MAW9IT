import { Injectable } from '@nestjs/common';
import { CreateCasretardDto } from './dto/create-casretard.dto';
import { UpdateCasretardDto } from './dto/update-casretard.dto';
import { Casretard } from './entities/casretard.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CasretardService {
   constructor(
      @InjectRepository(Casretard) private readonly casRetardRepository: Repository<Casretard>,
    ) {}
    async create(createCasretardDto: CreateCasretardDto) {
      const casRetard = this.casRetardRepository.create(createCasretardDto);
  
      return await this.casRetardRepository.save(casRetard);
    }

  findAll() {
    return this.casRetardRepository.find();
  }

  findOne(idCasRetard: number) {
    return this.casRetardRepository.find({ where: { idCasRetard }});
  }

  async update(idCasRetard: number, updateCasretardDto: UpdateCasretardDto) {
  
    const retard = await this.casRetardRepository.findOne({ where: { idCasRetard } });
    if (!retard) {
      throw new Error('Cas de retard non trouvé');
    }
    Object.assign(retard, updateCasretardDto);
    return this.casRetardRepository.save(retard);
  }

    remove(idCasRetard: number) {
  return this.casRetardRepository.delete(idCasRetard);
}
}
