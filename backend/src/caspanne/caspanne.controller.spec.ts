import { Test, TestingModule } from '@nestjs/testing';
import { CaspanneController } from './caspanne.controller';
import { CaspanneService } from './caspanne.service';

describe('CaspanneController', () => {
  let controller: CaspanneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaspanneController],
      providers: [CaspanneService],
    }).compile();

    controller = module.get<CaspanneController>(CaspanneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
