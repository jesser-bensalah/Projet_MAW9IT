import { Injectable } from '@nestjs/common';
import { CreateFormulairemécanicienDto } from './dto/create-formulairemécanicien.dto';
import { UpdateFormulairemécanicienDto } from './dto/update-formulairemécanicien.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Formulairemécanicien } from './entities/formulairemécanicien.entity';
@Injectable()
export class FormulairemécanicienService {
  constructor(@InjectRepository(Formulairemécanicien) private readonly formulaireMécanicienRepository: Repository<Formulairemécanicien>,) {}
    async create(createFormulairemécanicienDto: CreateFormulairemécanicienDto) {
      const formulaireMécanicien = this.formulaireMécanicienRepository.create(createFormulairemécanicienDto);
  
      return await this.formulaireMécanicienRepository.save(formulaireMécanicien);
    }

  findAll() {
    return this.formulaireMécanicienRepository.find();
  }

  findOne(idMecanicien: number) {
    return this.formulaireMécanicienRepository.find({ where : { idMecanicien }});
  }

  async update(idMecanicien: number, updateFormulairemécanicienDto: UpdateFormulairemécanicienDto) {
  
    const mécanicien = await this.formulaireMécanicienRepository.findOne({ where: { idMecanicien } });
    if (!mécanicien) {
      throw new Error('Chauffeur non trouvé');
    }
    Object.assign(mécanicien, updateFormulairemécanicienDto);
    return this.formulaireMécanicienRepository.save(mécanicien);
  }
    remove(idMecanicien: number) {
  return this.formulaireMécanicienRepository.delete(idMecanicien);
}
}
