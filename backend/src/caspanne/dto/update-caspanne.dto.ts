import { PartialType } from '@nestjs/mapped-types';
import { CreateCaspanneDto } from './create-caspanne.dto';

export class UpdateCaspanneDto extends PartialType(CreateCaspanneDto) {}
