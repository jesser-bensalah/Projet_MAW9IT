import { Module } from '@nestjs/common';
import { FormulairemécanicienService } from './formulairemécanicien.service';
import { FormulairemécanicienController } from './formulairemécanicien.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Formulairemécanicien } from './entities/formulairemécanicien.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Formulairemécanicien])],
  controllers: [FormulairemécanicienController],
  providers: [FormulairemécanicienService],
})
export class FormulairemécanicienModule {}
