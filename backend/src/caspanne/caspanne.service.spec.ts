import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaspanneService } from './caspanne.service';
import { Caspanne } from './entities/caspanne.entity';
import { CreateCaspanneDto } from './dto/create-caspanne.dto';
import { UpdateCaspanneDto } from './dto/update-caspanne.dto';
import { NotFoundException } from '@nestjs/common';
describe('CaspanneService', () => {
  let service: CaspanneService;
  let repository: Repository<Caspanne>;

  const mockCaspanne: Caspanne = {
    idCasPanne: 1,
    nom: 'Test Voiture',
    marque: 'Test Marque',
    modele: 'Test Modele',
    matricule: '1234TUN',
    typepanne: 'Moteur',
  };

  const mockCreateDto: CreateCaspanneDto = {
    nom: 'Test Voiture',
    marque: 'Test Marque',
    modele: 'Test Modele',
    matricule: '1234TUN',
    typepanne: 'Moteur',
  };

  const mockUpdateDto: UpdateCaspanneDto = {
    typepanne: 'Freinage',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaspanneService,
        {
          provide: getRepositoryToken(Caspanne),
          useValue: {
            create: jest.fn().mockReturnValue(mockCaspanne),
            save: jest.fn().mockResolvedValue(mockCaspanne),
            find: jest.fn().mockResolvedValue([mockCaspanne]),
            findOneBy: jest.fn().mockResolvedValue(mockCaspanne),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<CaspanneService>(CaspanneService);
    repository = module.get<Repository<Caspanne>>(getRepositoryToken(Caspanne));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new caspanne', async () => {
      const result = await service.create(mockCreateDto);
      expect(repository.create).toHaveBeenCalledWith(mockCreateDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockCaspanne);
    });
  });

  describe('findAll', () => {
    it('should return an array of caspannes', async () => {
      const result = await service.findAll();
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([mockCaspanne]);
    });
  });

  describe('findOne', () => {
    it('should return a single caspanne', async () => {
      const result = await service.findOne(1);
      expect(repository.findOneBy).toHaveBeenCalledWith({ idCasPanne: 1 });
      expect(result).toEqual(mockCaspanne);
    });

    it('should throw NotFoundException if caspanne not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow('Cas de panne avec l\'ID 999 non trouvé');
    });
  });

  describe('update', () => {
    it('should update a caspanne', async () => {
      const result = await service.update(1, mockUpdateDto);
      expect(repository.findOneBy).toHaveBeenCalledWith({ idCasPanne: 1 });
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining(mockUpdateDto));
      expect(result).toEqual(mockCaspanne);
    });

    it('should throw NotFoundException if caspanne to update not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);
      await expect(service.update(999, mockUpdateDto)).rejects.toThrow(
        'Cas de panne avec l\'ID 999 non trouvé',
      );
    });
  });

  describe('remove', () => {
    it('should delete a caspanne', async () => {
      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });

  it(' lance NotFoundException si panne inexistante', async () => {

    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);


    await expect(service.update(999, { nom: 'Test' }))
      .rejects
      .toThrow(NotFoundException);
    expect(repository.findOneBy).toHaveBeenCalledWith({ idCasPanne: 999 });
  });

});


