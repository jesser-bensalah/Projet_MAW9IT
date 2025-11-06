import { Test, TestingModule } from '@nestjs/testing';
import { CasdepartService } from './casdepart.service';

describe('CasdepartService', () => {
  let service: CasdepartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CasdepartService],
    }).compile();

    service = module.get<CasdepartService>(CasdepartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
