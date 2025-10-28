import { Test, TestingModule } from '@nestjs/testing';
import { FormulairemécanicienController } from './formulairemécanicien.controller';
import { FormulairemécanicienService } from './formulairemécanicien.service';

describe('FormulairemécanicienController', () => {
  let controller: FormulairemécanicienController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormulairemécanicienController],
      providers: [FormulairemécanicienService],
    }).compile();

    controller = module.get<FormulairemécanicienController>(FormulairemécanicienController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
