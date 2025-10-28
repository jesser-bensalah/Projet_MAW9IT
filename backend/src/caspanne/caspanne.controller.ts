import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CaspanneService } from './caspanne.service';
import { CreateCaspanneDto } from './dto/create-caspanne.dto';
import { UpdateCaspanneDto } from './dto/update-caspanne.dto';

@Controller('caspanne')
export class CaspanneController {
  constructor(private readonly caspanneService: CaspanneService) {}

  @Post()
  create(@Body() createCaspanneDto: CreateCaspanneDto) {
    return this.caspanneService.create(createCaspanneDto);
  }

  @Get()
  findAll() {
    return this.caspanneService.findAll();
  }

  @Get(':idCasPanne')
  findOne(@Param('idCasPanne') idCasPanne: string) {
    return this.caspanneService.findOne(+idCasPanne);
  }

  @Patch(':idCasPanne')
  update(@Param('idCasPanne') idCasPanne: string, @Body() updateCaspanneDto: UpdateCaspanneDto) {
    return this.caspanneService.update(+idCasPanne, updateCaspanneDto);
  }

  @Delete(':idCasPanne')
  remove(@Param('idCasPanne') idCasPanne: string) {
    return this.caspanneService.remove(+idCasPanne);
  }
}
