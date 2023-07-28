import { createMutablePokemonRepository, createPokemonRepository } from './pokemon'

const mockRepositoryDriver: any = {
  readFile: jest.fn(),
}

const mockMutableRepositoryDriver: any = {
  readFile: jest.fn(),
  writeFile: jest.fn(),
}

describe('createPokemonRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should create a read-only repository with the correct arguments', () => {
    const cacheTtl = 600
    const repository = createPokemonRepository(mockRepositoryDriver, cacheTtl)

    expect(repository).toBeDefined()
    expect(repository.id).toBe('pokemon')
    expect(repository.getAll).toBeInstanceOf(Function)
    expect(repository.getById).toBeInstanceOf(Function)
    expect(repository.findById).toBeInstanceOf(Function)
    expect(repository.getManyByIds).toBeInstanceOf(Function)
    expect(repository.validate).toBeInstanceOf(Function)
    expect(repository.validateMany).toBeInstanceOf(Function)
    expect(repository.search).toBeInstanceOf(Function)
    expect(repository.query).toBeInstanceOf(Function)
  })

  test('should create a read-only repository with the default arguments', () => {
    const repository = createPokemonRepository(mockRepositoryDriver)

    expect(repository).toBeDefined()
    expect(repository.id).toBe('pokemon')
    expect(repository.getAll).toBeInstanceOf(Function)
    expect(repository.getById).toBeInstanceOf(Function)
    expect(repository.findById).toBeInstanceOf(Function)
    expect(repository.getManyByIds).toBeInstanceOf(Function)
    expect(repository.validate).toBeInstanceOf(Function)
    expect(repository.validateMany).toBeInstanceOf(Function)
    expect(repository.search).toBeInstanceOf(Function)
    expect(repository.query).toBeInstanceOf(Function)
  })
})

describe('createMutablePokemonRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should create a mutable repository with the correct arguments', () => {
    const repository = createMutablePokemonRepository(mockMutableRepositoryDriver)

    expect(repository).toBeDefined()
    expect(repository.id).toBe('pokemon')
    expect(repository.getAll).toBeInstanceOf(Function)
    expect(repository.getById).toBeInstanceOf(Function)
    expect(repository.findById).toBeInstanceOf(Function)
    expect(repository.getManyByIds).toBeInstanceOf(Function)
    expect(repository.validate).toBeInstanceOf(Function)
    expect(repository.validateMany).toBeInstanceOf(Function)
    expect(repository.create).toBeInstanceOf(Function)
    expect(repository.createMany).toBeInstanceOf(Function)
    expect(repository.delete).toBeInstanceOf(Function)
    expect(repository.deleteMany).toBeInstanceOf(Function)
    expect(repository.update).toBeInstanceOf(Function)
    expect(repository.updateMany).toBeInstanceOf(Function)
  })
})
