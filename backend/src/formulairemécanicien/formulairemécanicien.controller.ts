import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FormulairemécanicienService } from './formulairemécanicien.service';
import { CreateFormulairemécanicienDto } from './dto/create-formulairemécanicien.dto';
import { UpdateFormulairemécanicienDto } from './dto/update-formulairemécanicien.dto';

@Controller('formulairesmecaniciens')
export class FormulairemécanicienController {
  constructor(private readonly formulairemécanicienService: FormulairemécanicienService) {}

  @Post()
  create(@Body() createFormulairemécanicienDto: CreateFormulairemécanicienDto) {
    return this.formulairemécanicienService.create(createFormulairemécanicienDto);
  }

  @Get()
  findAll() {
    return this.formulairemécanicienService.findAll();
  }

  @Get(':idMecanicien')
  findOne(@Param('idMecanicien') idMecanicien: string) {
    return this.formulairemécanicienService.findOne(+idMecanicien);
  }

  @Patch(':idMecanicien')
  update(@Param('idMecanicien') idMecanicien: string, @Body() updateFormulairemécanicienDto: UpdateFormulairemécanicienDto) {
    return this.formulairemécanicienService.update(+idMecanicien, updateFormulairemécanicienDto);
  }

  @Delete(':idMecanicien')
  remove(@Param('idMecanicien') idMecanicien: string) {
    return this.formulairemécanicienService.remove(+idMecanicien);
  }
}
