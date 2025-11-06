import { Test, TestingModule } from '@nestjs/testing';
import { CasdepartController } from './casdepart.controller';
import { CasdepartService } from './casdepart.service';

describe('CasdepartController', () => {
  let controller: CasdepartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CasdepartController],
      providers: [CasdepartService],
    }).compile();

    controller = module.get<CasdepartController>(CasdepartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
