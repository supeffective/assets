import { createPokemonRepository } from './pokemon'

const mockRepositoryDriver: any = {
  readFile: jest.fn(),
}

describe('createPokemonRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should create a read-only repository with the correct arguments', () => {
    const repository = createPokemonRepository(mockRepositoryDriver)

    expect(repository).toBeDefined()
    expect(repository.id).toBe('pokemon')
    expect(repository.getAll).toBeInstanceOf(Function)
    expect(repository.getById).toBeInstanceOf(Function)
    expect(repository.findById).toBeInstanceOf(Function)
    expect(repository.getManyByIds).toBeInstanceOf(Function)
    expect(repository.validate).toBeInstanceOf(Function)
    expect(repository.validateMany).toBeInstanceOf(Function)
  })
})
