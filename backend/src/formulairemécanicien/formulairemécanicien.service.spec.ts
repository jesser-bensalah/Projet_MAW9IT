import { Test, TestingModule } from '@nestjs/testing';
import { FormulairemécanicienService } from './formulairemécanicien.service';

describe('FormulairemécanicienService', () => {
  let service: FormulairemécanicienService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormulairemécanicienService],
    }).compile();

    service = module.get<FormulairemécanicienService>(FormulairemécanicienService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
