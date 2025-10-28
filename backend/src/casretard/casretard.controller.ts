import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CasretardService } from './casretard.service';
import { CreateCasretardDto } from './dto/create-casretard.dto';
import { UpdateCasretardDto } from './dto/update-casretard.dto';

@Controller('casretard')
export class CasretardController {
  constructor(private readonly casretardService: CasretardService) {}

  @Post()
  create(@Body() createCasretardDto: CreateCasretardDto) {
    return this.casretardService.create(createCasretardDto);
  }

  @Get()
  findAll() {
    return this.casretardService.findAll();
  }

  @Get(':idCasRetard')
  findOne(@Param('idCasRetard') idCasRetard: string) {
    return this.casretardService.findOne(+idCasRetard);
  }

  @Patch(':idCasRetard')
  update(@Param('idCasRetard') idCasRetard: string, @Body() updateCasretardDto: UpdateCasretardDto) {
    return this.casretardService.update(+idCasRetard, updateCasretardDto);
  }

  @Delete(':idCasRetard')
  remove(@Param('idCasRetard') idCasRetard: string) {
    return this.casretardService.remove(+idCasRetard);
  }
}
