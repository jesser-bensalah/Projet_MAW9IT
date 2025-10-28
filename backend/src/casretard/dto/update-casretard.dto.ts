import { PartialType } from '@nestjs/mapped-types';
import { CreateCasretardDto } from './create-casretard.dto';

export class UpdateCasretardDto extends PartialType(CreateCasretardDto) {}
