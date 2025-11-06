import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CasdepartService } from './casdepart.service';
import { CreateCasdepartDto } from './dto/create-casdepart.dto';
import { UpdateCasdepartDto } from './dto/update-casdepart.dto';

@Controller('casdepart')
export class CasdepartController {
  constructor(private readonly casdepartService: CasdepartService) {}

  @Post()
  create(@Body() createCasdepartDto: CreateCasdepartDto) {
    return this.casdepartService.create(createCasdepartDto);
  }

  @Get()
  findAll() {
    return this.casdepartService.findAll();
  }

  @Get(':idCasDepart')
  findOne(@Param('idCasDepart') idCasDepart: string) {
    return this.casdepartService.findOne(+idCasDepart);
  }

  @Patch(':idCasDepart')
  update(@Param('idCasDepart') idCasDepart: string, @Body() updateCasdepartDto: UpdateCasdepartDto) {
    return this.casdepartService.update(+idCasDepart, updateCasdepartDto);
  }

  @Delete(':idCasDepart')
  remove(@Param('idCasDepart') idCasDepart: string) {
    return this.casdepartService.remove(+idCasDepart);
  }
}
