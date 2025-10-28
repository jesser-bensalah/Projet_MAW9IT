import { Test, TestingModule } from '@nestjs/testing';
import { CasretardService } from './casretard.service';

describe('CasretardService', () => {
  let service: CasretardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CasretardService],
    }).compile();

    service = module.get<CasretardService>(CasretardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
