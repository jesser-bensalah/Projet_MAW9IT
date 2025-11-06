import { Injectable } from '@nestjs/common';
import { CreateCasdepartDto } from './dto/create-casdepart.dto';
import { UpdateCasdepartDto } from './dto/update-casdepart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Casdepart } from './entities/casdepart.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CasdepartService {
  constructor(
          @InjectRepository(Casdepart) private readonly casDepartRepository: Repository<Casdepart>,
        ) {}
  async create(createCasdepartDto: CreateCasdepartDto) {
    const casDepart = this.casDepartRepository.create(createCasdepartDto);

    return await this.casDepartRepository.save(casDepart);
  }

  findAll() {
    return this.casDepartRepository.find();
  }

  findOne(idCasDepart: number) {
    return this.casDepartRepository.find({ where : {idCasDepart}});
  }

  async update(idCasDepart: number, updateCasdepartDto: UpdateCasdepartDto) {
      
        const depart = await this.casDepartRepository.findOne({ where: { idCasDepart } });
        if (!depart) {
          throw new Error('Cas de départ non trouvé');
        }
        Object.assign(depart, updateCasdepartDto);
        return this.casDepartRepository.save(depart);
      }

  remove(idCasDepart: number) {
    return this.casDepartRepository.delete(idCasDepart);
  }
}
