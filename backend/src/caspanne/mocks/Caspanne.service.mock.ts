import { caspanneMock } from "./caspanne.mock"

export class CaspanneServiceMock {
  findAll = jest.fn().mockResolvedValue(caspanneMock)
  index = jest.fn().mockResolvedValue(caspanneMock)
  findOne = jest.fn().mockImplementation((id : number) => {
    return Promise.resolve(caspanneMock.find(p => p.idCasPanne === id))
  })
  show = jest.fn().mockImplementation((id : number) => {
    return Promise.resolve(caspanneMock.find(p => p.idCasPanne === id))
  })
  create = jest.fn().mockResolvedValue({message: "Cas de panne crée avec succés"})
  store = jest.fn().mockResolvedValue({message: "Cas de panne crée avec succés"})
  update = jest.fn().mockResolvedValue({message: "Cas de panne modifiée avec succés"})
  remove = jest.fn().mockResolvedValue({message: "Cas de panne supprimée avec succés"})
  destroy = jest.fn().mockResolvedValue({message: "Cas de panne supprimée avec succés"})
}