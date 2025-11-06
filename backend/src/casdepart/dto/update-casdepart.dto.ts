import { PartialType } from '@nestjs/swagger';
import { CreateCasdepartDto } from './create-casdepart.dto';

export class UpdateCasdepartDto extends PartialType(CreateCasdepartDto) {}
