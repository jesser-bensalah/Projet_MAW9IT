import { PartialType } from '@nestjs/mapped-types';
import { CreateFormulairemécanicienDto } from './create-formulairemécanicien.dto';

export class UpdateFormulairemécanicienDto extends PartialType(CreateFormulairemécanicienDto) {}
