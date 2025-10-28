import { Test, TestingModule } from '@nestjs/testing';
import { FormulairechauffeurService } from './formulairechauffeur.service';

describe('FormulairechauffeurService', () => {
  let service: FormulairechauffeurService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormulairechauffeurService],
    }).compile();

    service = module.get<FormulairechauffeurService>(FormulairechauffeurService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
