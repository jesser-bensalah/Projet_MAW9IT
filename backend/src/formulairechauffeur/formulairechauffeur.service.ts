import { Injectable } from '@nestjs/common';
import { CreateFormulairechauffeurDto } from './dto/create-formulairechauffeur.dto';
import { UpdateFormulairechauffeurDto } from './dto/update-formulairechauffeur.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Formulairechauffeur } from './entities/formulairechauffeur.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FormulairechauffeurService {
  constructor(
    @InjectRepository(Formulairechauffeur) private readonly formulaireChauffeurRepository: Repository<Formulairechauffeur>,
  ) {}
  async create(createFormulairechauffeurDto: CreateFormulairechauffeurDto) {
    const formulaireChauffeur = this.formulaireChauffeurRepository.create(createFormulairechauffeurDto);

    return await this.formulaireChauffeurRepository.save(formulaireChauffeur);
  }

  findAll() {
    return this.formulaireChauffeurRepository.find();
  }

  findOne(idchauffeur: number) {
    return this.formulaireChauffeurRepository.find({ where : { idchauffeur }});
  }

async update(idchauffeur: number, updateFormulairechauffeurDto: UpdateFormulairechauffeurDto) {

  const chauffeur = await this.formulaireChauffeurRepository.findOne({ where: { idchauffeur } });
  if (!chauffeur) {
    throw new Error('Chauffeur non trouvé');
  }
  Object.assign(chauffeur, updateFormulairechauffeurDto);
  return this.formulaireChauffeurRepository.save(chauffeur);
}

  remove(idchauffeur: number) {
  return this.formulaireChauffeurRepository.delete(idchauffeur);
}
}
