import { Test, TestingModule } from '@nestjs/testing';
import { CasretardController } from './casretard.controller';
import { CasretardService } from './casretard.service';

describe('CasretardController', () => {
  let controller: CasretardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CasretardController],
      providers: [CasretardService],
    }).compile();

    controller = module.get<CasretardController>(CasretardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
