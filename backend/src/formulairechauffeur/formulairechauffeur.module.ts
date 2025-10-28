import { Module } from '@nestjs/common';
import { FormulairechauffeurService } from './formulairechauffeur.service';
import { FormulairechauffeurController } from './formulairechauffeur.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Formulairechauffeur } from './entities/formulairechauffeur.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Formulairechauffeur])],
  controllers: [FormulairechauffeurController],
  providers: [FormulairechauffeurService],
})
export class FormulairechauffeurModule {}
