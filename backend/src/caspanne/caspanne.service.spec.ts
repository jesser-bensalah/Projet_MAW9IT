import { Test, TestingModule } from '@nestjs/testing';
import { CaspanneService } from './caspanne.service';

describe('CaspanneService', () => {
  let service: CaspanneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaspanneService],
    }).compile();

    service = module.get<CaspanneService>(CaspanneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
