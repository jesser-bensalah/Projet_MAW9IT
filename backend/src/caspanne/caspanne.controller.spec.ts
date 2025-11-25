import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CaspanneController } from './caspanne.controller';
import { CaspanneService } from './caspanne.service';
import { Caspanne } from './entities/caspanne.entity';

describe('CaspanneController', () => {
  let controller: CaspanneController;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaspanneController],
      providers: [
        CaspanneService,
        {
          provide: getRepositoryToken(Caspanne),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<CaspanneController>(CaspanneController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
