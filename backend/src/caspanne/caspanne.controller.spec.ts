import { Test, TestingModule } from '@nestjs/testing';
import { CaspanneController } from './caspanne.controller';
import { CaspanneService } from './caspanne.service';
import { CaspanneServiceMock } from './mocks/Caspanne.service.mock';
import { caspanneMock } from './mocks/caspanne.mock';

describe('CaspanneController', () => {
  let controller: CaspanneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaspanneController],
      providers: [{provide: CaspanneService, useClass: CaspanneServiceMock}],
    }).compile();

    controller = module.get<CaspanneController>(CaspanneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("index", () => {
    it("should return an array of panne", () => {
      expect(controller.index()).resolves.toEqual(caspanneMock)
    })
  })

 describe("show", () => {
  it("should return a single of panne", () => {
    const id = "1"
    const p = caspanneMock.find(p => p.idCasPanne === +id)
    expect(controller.findOne(id)).resolves.toEqual(p);
  });
});

 describe("store", () => {
  it('should return {message: "Cas de panne crée avec succés"}', () => {
    expect(controller.create(caspanneMock[0])).resolves.toEqual({message: "Cas de panne crée avec succés"});
  });
});

 describe("update", () => {
  it('should return {message: "Cas de panne modifiée avec succés"}', () => {
    expect(controller.update("1", caspanneMock[0])).resolves.toEqual({message: "Cas de panne modifiée avec succés"});
  });
});

 describe("destroy", () => {
  it('should return {message: "Cas de panne supprimée avec succés"}', () => {
    expect(controller.remove("1")).resolves.toEqual({message: "Cas de panne supprimée avec succés"});
  });
});
});
