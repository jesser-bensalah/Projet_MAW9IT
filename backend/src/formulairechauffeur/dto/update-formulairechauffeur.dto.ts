import { PartialType } from '@nestjs/mapped-types';
import { CreateFormulairechauffeurDto } from './create-formulairechauffeur.dto';

export class UpdateFormulairechauffeurDto extends PartialType(CreateFormulairechauffeurDto) {}
