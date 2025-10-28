import { Test, TestingModule } from '@nestjs/testing';
import { FormulairechauffeurController } from './formulairechauffeur.controller';
import { FormulairechauffeurService } from './formulairechauffeur.service';

describe('FormulairechauffeurController', () => {
  let controller: FormulairechauffeurController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormulairechauffeurController],
      providers: [FormulairechauffeurService],
    }).compile();

    controller = module.get<FormulairechauffeurController>(FormulairechauffeurController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
