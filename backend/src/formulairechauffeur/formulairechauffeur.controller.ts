import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FormulairechauffeurService } from './formulairechauffeur.service';
import { CreateFormulairechauffeurDto } from './dto/create-formulairechauffeur.dto';
import { UpdateFormulairechauffeurDto } from './dto/update-formulairechauffeur.dto';

@Controller('formulaireschauffeurs')
export class FormulairechauffeurController {
  constructor(private readonly formulairechauffeurService: FormulairechauffeurService) {}

  @Post()
  create(@Body() createFormulairechauffeurDto: CreateFormulairechauffeurDto) {
    return this.formulairechauffeurService.create(createFormulairechauffeurDto);
  }

  @Get()
  findAll() {
    return this.formulairechauffeurService.findAll();
  }

  @Get(':idchauffeur')
  findOne(@Param('idchauffeur') idchauffeur: string) {
    return this.formulairechauffeurService.findOne(+idchauffeur);
  }

  @Patch(':idchauffeur')
  update(@Param('idchauffeur') idchauffeur: string, @Body() updateFormulairechauffeurDto: UpdateFormulairechauffeurDto) {
    return this.formulairechauffeurService.update(+idchauffeur, updateFormulairechauffeurDto);
  }

  @Delete(':idchauffeur')
  remove(@Param('idchauffeur') idchauffeur: string) {
    return this.formulairechauffeurService.remove(+idchauffeur);
  }
}
