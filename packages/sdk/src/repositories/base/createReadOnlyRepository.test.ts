import { z } from 'zod'

import createReadOnlyRepository from './createReadOnlyRepository'
import { Entity, RepositoryQuery } from './types'

const mockDriver: any = {
  readFile: jest.fn(),
}

const mockSearchEngine: any = {
  isIndexed: jest.fn().mockResolvedValue(true),
  index: jest.fn().mockResolvedValue(undefined),
  search: jest.fn().mockResolvedValue(new Set([])),
  searchWith: jest.fn().mockResolvedValue([]),
}

const mockSchema: any = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string().max(3).optional(),
})

describe('createReadOnlyRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return a valid repository object with default arguments', () => {
    const repoId = 'users'
    const repo = createReadOnlyRepository({
      id: repoId,
      resourcePath: 'data/users.json',
      schema: mockSchema,
      storageDriver: mockDriver,
      textSearchEngine: mockSearchEngine,
      searchInitializer: undefined,
    })

    expect(repo).toBeDefined()
    expect(repo.id).toBe(repoId)
    expect(repo.getAll).toBeInstanceOf(Function)
    expect(repo.getById).toBeInstanceOf(Function)
    expect(repo.findById).toBeInstanceOf(Function)
    expect(repo.getManyByIds).toBeInstanceOf(Function)
    expect(repo.validate).toBeInstanceOf(Function)
    expect(repo.validateMany).toBeInstanceOf(Function)
    expect(repo.search).toBeInstanceOf(Function)
  })

  test('getAll should call driver.readFile with the correct dataFile', async () => {
    const repoId = 'users'
    const dataFile = 'data/users.json'
    const repo = createReadOnlyRepository({
      id: repoId,
      resourcePath: 'data/users.json',
      schema: mockSchema,
      storageDriver: mockDriver,
      textSearchEngine: mockSearchEngine,
      searchInitializer: undefined,
      cacheTtl: 500,
    })

    await repo.getAll()

    expect(mockDriver.readFile).toHaveBeenCalledTimes(1)
    expect(mockDriver.readFile).toHaveBeenCalledWith(dataFile, 500)
  })

  test('getById should return the entity with the given id', async () => {
    const repoId = 'users'
    const dataFile = 'data/users.json'
    const mockData = [
      { id: '1', name: 'John' },
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Bob' },
    ]
    mockDriver.readFile.mockResolvedValue(mockData)

    const repo = createReadOnlyRepository({
      id: repoId,
      resourcePath: dataFile,
      schema: mockSchema,
      storageDriver: mockDriver,
      textSearchEngine: mockSearchEngine,
    })
    const result = await repo.getById('2')

    expect(result).toEqual({ id: '2', name: 'Alice' })
  })

  test('getById should throw an error if the entity with the given id is not found', async () => {
    const repoId = 'users'
    const dataFile = 'data/users.json'
    const mockData = [
      { id: '1', name: 'John' },
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Bob' },
    ]
    mockDriver.readFile.mockResolvedValue(mockData)

    const repo = createReadOnlyRepository({
      id: repoId,
      resourcePath: dataFile,
      schema: mockSchema,
      storageDriver: mockDriver,
      textSearchEngine: mockSearchEngine,
    })

    await expect(repo.getById('4')).rejects.toThrowError(`${repoId} with id 4 not found`)
  })

  test('findById should return the entity with the given id', async () => {
    const repoId = 'users'
    const dataFile = 'data/users.json'
    const mockData = [
      { id: '1', name: 'John' },
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Bob' },
    ]
    mockDriver.readFile.mockResolvedValue(mockData)

    const repo = createReadOnlyRepository({
      id: repoId,
      resourcePath: dataFile,
      schema: mockSchema,
      storageDriver: mockDriver,
      textSearchEngine: mockSearchEngine,
    })
    const result = await repo.findById('2')

    expect(result).toEqual({ id: '2', name: 'Alice' })
  })

  test('getManyByIds should return an array of entities with the given ids', async () => {
    const repoId = 'users'
    const dataFile = 'data/users.json'
    const mockData = [
      { id: '1', name: 'John' },
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Bob' },
    ]
    mockDriver.readFile.mockResolvedValue(mockData)

    const repo = createReadOnlyRepository({
      id: repoId,
      resourcePath: dataFile,
      schema: mockSchema,
      storageDriver: mockDriver,
      textSearchEngine: mockSearchEngine,
    })
    const result = await repo.getManyByIds(['1', '3'])

    expect(result).toEqual([
      { id: '1', name: 'John' },
      { id: '3', name: 'Bob' },
    ])
  })

  test('validate should return success when the data matches the schema', () => {
    const repoId = 'users'
    const dataFile = 'data/users.json'
    const data = { id: '1', name: 'John' }
    const repo = createReadOnlyRepository({
      id: repoId,
      resourcePath: dataFile,
      schema: mockSchema,
      storageDriver: mockDriver,
      textSearchEngine: mockSearchEngine,
    })

    const result = repo.validate(data)

    expect(result).toEqual({ success: true })
  })

  test('validate should return an error when the data does not match the schema', () => {
    const repoId = 'users'
    const dataFile = 'data/users.json'
    const data = { id: '1', name: 'John', country: 'Spain' }
    const repo = createReadOnlyRepository({
      id: repoId,
      resourcePath: dataFile,
      schema: mockSchema,
      storageDriver: mockDriver,
      textSearchEngine: mockSearchEngine,
    })

    const result = repo.validate(data)

    expect(result.success).toBe(false)
    expect(result.error).toBeInstanceOf(Error)
  })

  test('validateMany should return success when the array of data matches the schema', () => {
    const repoId = 'users'
    const dataFile = 'data/users.json'
    const data = [
      { id: '1', name: 'John' },
      { id: '2', name: 'Alice' },
    ]
    const repo = createReadOnlyRepository({
      id: repoId,
      resourcePath: dataFile,
      schema: mockSchema,
      storageDriver: mockDriver,
      textSearchEngine: mockSearchEngine,
    })

    const result = repo.validateMany(data)

    expect(result).toEqual({ success: true })
  })

  test('validateMany should return an error when the array of data does not match the schema', () => {
    const repoId = 'users'
    const dataFile = 'data/users.json'
    const data = [
      { id: '1', name: 'John', country: 'ES' },
      { id: '2', name: 'Alice', country: 'Spain' },
    ]
    const repo = createReadOnlyRepository({
      id: repoId,
      resourcePath: dataFile,
      schema: mockSchema,
      storageDriver: mockDriver,
      textSearchEngine: mockSearchEngine,
    })

    const result = repo.validateMany(data)

    expect(result.success).toBe(false)
    expect(result.error).toBeInstanceOf(Error)
  })
})

describe('createReadOnlyRepository.search', () => {
  const repoId = 'users'
  const dataFile = 'data/users.json'

  const entities: Entity[] = [
    { id: '1', name: 'John' },
    { id: '2', name: 'Alice' },
    { id: '3', name: 'Bob' },
    { id: '4', name: 'Jonas' },
  ]

  const repository = createReadOnlyRepository({
    id: repoId,
    resourcePath: dataFile,
    schema: mockSchema,
    storageDriver: mockDriver,
    textSearchEngine: mockSearchEngine,
  })

  beforeEach(() => {
    jest.clearAllMocks()

    mockDriver.readFile.mockResolvedValue(entities)
  })

  it('should return entities filtered by query', async () => {
    const query: RepositoryQuery<Entity> = [
      [{ field: 'name', value: 'John', operator: 'eq' }],
      [{ field: 'name', value: 'Bob', operator: 'eq' }],
    ]

    const result = await repository.search(query)

    expect(result).toEqual([
      { id: '1', name: 'John' },
      { id: '3', name: 'Bob' },
    ])
  })

  it('should return empty array if no entities match the query', async () => {
    const query: RepositoryQuery<Entity> = [[{ field: 'name', value: 'Unknown', operator: 'eq' }]]

    const result = await repository.search(query)

    expect(result).toEqual([])
  })

  it('should return paginated results', async () => {
    const query: RepositoryQuery<Entity> = [[]] // Empty query will return all entities
    const limit = 2
    const offset = 1

    const result = await repository.search(query, limit, offset)

    expect(result).toEqual([
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Bob' },
    ])
  })

  it('should return sorted results', async () => {
    const query: RepositoryQuery<Entity> = [[]] // Empty query will return all entities
    const sortBy = 'name'
    const sortDir = 'asc'

    const result = await repository.search(query, undefined, undefined, sortBy, sortDir)

    expect(result).toEqual([
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Bob' },
      { id: '1', name: 'John' },
      { id: '4', name: 'Jonas' },
    ])
  })

  it('should return sorted results in reverse order', async () => {
    const query: RepositoryQuery<Entity> = [[]] // Empty query will return all entities
    const sortBy = 'name'
    const sortDir = 'desc'

    const result = await repository.search(query, undefined, undefined, sortBy, sortDir)

    expect(result).toEqual([
      { id: '4', name: 'Jonas' },
      { id: '1', name: 'John' },
      { id: '3', name: 'Bob' },
      { id: '2', name: 'Alice' },
    ])
  })

  it('should throw an error for an invalid operator in the query', async () => {
    const query: RepositoryQuery<Entity> = [
      [{ field: 'name', value: 'John', operator: 'invalidOperator' as any }],
    ]

    await expect(repository.search(query)).rejects.toThrow('Invalid operator: invalidOperator')
  })

  it('should handle "in" operator', async () => {
    const query: RepositoryQuery<Entity> = [
      [{ field: 'name', value: ['John', 'Bob'], operator: 'in' }],
    ]

    const result = await repository.search(query)

    expect(result).toEqual([
      { id: '1', name: 'John' },
      { id: '3', name: 'Bob' },
    ])
  })

  it('should throw an error when value is not an array for the "in" operator', async () => {
    const query: RepositoryQuery<Entity> = [[{ field: 'name', value: 'John', operator: 'in' }]]

    await expect(repository.search(query)).rejects.toThrow("Invalid value for operator 'in': John")
  })

  it('should handle "notin" operator', async () => {
    const query: RepositoryQuery<Entity> = [
      [{ field: 'name', value: ['John', 'Bob'], operator: 'notin' }],
    ]

    const result = await repository.search(query)

    expect(result).toEqual([
      { id: '2', name: 'Alice' },
      { id: '4', name: 'Jonas' },
    ])
  })

  it('should throw an error when value is not an array for the "notin" operator', async () => {
    const query: RepositoryQuery<Entity> = [[{ field: 'name', value: 'John', operator: 'notin' }]]

    await expect(repository.search(query)).rejects.toThrow(
      "Invalid value for operator 'notin': John"
    )
  })

  it('should handle "ends" operator', async () => {
    const query: RepositoryQuery<Entity> = [[{ field: 'name', value: 'onas', operator: 'ends' }]]

    const result = await repository.search(query)

    expect(result).toEqual([{ id: '4', name: 'Jonas' }])
  })

  it('should handle "starts" operator', async () => {
    const query: RepositoryQuery<Entity> = [[{ field: 'name', value: 'Jo', operator: 'starts' }]]

    const result = await repository.search(query)

    expect(result).toEqual([
      { id: '1', name: 'John' },
      { id: '4', name: 'Jonas' },
    ])
  })

  it('should handle "contains" operator', async () => {
    const query: RepositoryQuery<Entity> = [[{ field: 'name', value: 'ona', operator: 'contains' }]]

    const result = await repository.search(query)

    expect(result).toEqual([{ id: '4', name: 'Jonas' }])
  })

  it('should handle "ncontains" operator', async () => {
    const query: RepositoryQuery<Entity> = [
      [{ field: 'name', value: 'ona', operator: 'ncontains' }],
    ]

    const result = await repository.search(query)

    expect(result).toEqual([
      { id: '1', name: 'John' },
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Bob' },
    ])
  })

  it('should handle "isnull" operator', async () => {
    const query: RepositoryQuery<Entity> = [[{ field: 'name', operator: 'isnull' }]]

    const result = await repository.search(query)

    expect(result).toEqual([])
  })

  it('should handle "notnull" operator', async () => {
    const query: RepositoryQuery<Entity> = [[{ field: 'name', operator: 'notnull' }]]

    const result = await repository.search(query)

    expect(result).toEqual(entities)
  })

  it('should handle "neq" operator', async () => {
    const query: RepositoryQuery<Entity> = [[{ field: 'name', value: 'John', operator: 'neq' }]]

    const result = await repository.search(query)

    expect(result).toEqual([
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Bob' },
      { id: '4', name: 'Jonas' },
    ])
  })

  it('should handle "lt" operator', async () => {
    const query: RepositoryQuery<Entity> = [[{ field: 'id', value: '3', operator: 'lt' }]]

    const result = await repository.search(query)

    expect(result).toEqual([
      { id: '1', name: 'John' },
      { id: '2', name: 'Alice' },
    ])
  })

  it('should handle "gt" operator', async () => {
    const query: RepositoryQuery<Entity> = [[{ field: 'id', value: '2', operator: 'gt' }]]

    const result = await repository.search(query)

    expect(result).toEqual([
      { id: '3', name: 'Bob' },
      { id: '4', name: 'Jonas' },
    ])
  })

  it('should handle "lte" operator', async () => {
    const query: RepositoryQuery<Entity> = [[{ field: 'id', value: '3', operator: 'lte' }]]

    const result = await repository.search(query)

    expect(result).toEqual([
      { id: '1', name: 'John' },
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Bob' },
    ])
  })

  it('should handle "gte" operator', async () => {
    const query: RepositoryQuery<Entity> = [[{ field: 'id', value: '2', operator: 'gte' }]]

    const result = await repository.search(query)

    expect(result).toEqual([
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Bob' },
      { id: '4', name: 'Jonas' },
    ])
  })
})
