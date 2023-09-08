import { z } from 'zod'

import { createReadOnlyRepository } from './createReadOnlyRepository'

const mockDriver: any = {
  readFile: jest.fn(),
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
      dataProvider: mockDriver,
    })

    expect(repo).toBeDefined()
    expect(repo.id).toBe(repoId)
    expect(repo.getAll).toBeInstanceOf(Function)
    expect(repo.getById).toBeInstanceOf(Function)
    expect(repo.findById).toBeInstanceOf(Function)
    expect(repo.getManyByIds).toBeInstanceOf(Function)
    expect(repo.validate).toBeInstanceOf(Function)
    expect(repo.validateMany).toBeInstanceOf(Function)
  })

  test('getAll should call driver.readFile with the correct dataFile', async () => {
    const repoId = 'users'
    const dataFile = 'data/users.json'
    const repo = createReadOnlyRepository({
      id: repoId,
      resourcePath: 'data/users.json',
      schema: mockSchema,
      dataProvider: mockDriver,
    })

    await repo.getAll()

    expect(mockDriver.readFile).toHaveBeenCalledTimes(1)
    expect(mockDriver.readFile).toHaveBeenCalledWith(dataFile)
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
      dataProvider: mockDriver,
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
      dataProvider: mockDriver,
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
      dataProvider: mockDriver,
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
      dataProvider: mockDriver,
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
      dataProvider: mockDriver,
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
      dataProvider: mockDriver,
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
      dataProvider: mockDriver,
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
      dataProvider: mockDriver,
    })

    const result = repo.validateMany(data)

    expect(result.success).toBe(false)
    expect(result.error).toBeInstanceOf(Error)
  })
})
