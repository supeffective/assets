import { z } from 'zod'

import { createMutableRepository } from './createMutableRepository'

const mockDriver: any = {
  readFile: jest.fn().mockResolvedValue([]),
  writeFile: jest.fn(),
}

const mockSchema: any = z.object({
  id: z.string(),
})

describe('createMutableRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDriver.readFile.mockResolvedValue([])
  })

  test('should return a valid mutable repository object with default arguments', () => {
    const repoId = 'users'
    const repo = createMutableRepository({
      id: repoId,
      resourcePath: 'data/users.json',
      schema: mockSchema,
      dataProvider: mockDriver,
    })

    expect(repo).toBeDefined()
    expect(repo.id).toBe(repoId)

    // inherited repository functions
    expect(repo.getAll).toBeInstanceOf(Function)
    expect(repo.getById).toBeInstanceOf(Function)
    expect(repo.findById).toBeInstanceOf(Function)
    expect(repo.getManyByIds).toBeInstanceOf(Function)
    expect(repo.validate).toBeInstanceOf(Function)
    expect(repo.validateMany).toBeInstanceOf(Function)

    // mutable repository functions
    expect(repo.create).toBeInstanceOf(Function)
    expect(repo.createMany).toBeInstanceOf(Function)
    expect(repo.delete).toBeInstanceOf(Function)
    expect(repo.deleteMany).toBeInstanceOf(Function)
    expect(repo.update).toBeInstanceOf(Function)
    expect(repo.updateMany).toBeInstanceOf(Function)
  })

  test('create should add new row', async () => {
    const repoId = 'users'
    const dataFile = 'data/users.json'
    const repo = createMutableRepository({
      id: repoId,
      resourcePath: dataFile,
      schema: mockSchema,
      dataProvider: mockDriver,
    })

    const newData = { id: '3', name: 'Jane' }
    await repo.create(newData)

    expect(mockDriver.writeFile).toHaveBeenCalledTimes(1)
    expect(mockDriver.writeFile).toHaveBeenCalledWith(dataFile, [newData])
  })

  test('create should reject with "already exists" error', async () => {
    const repoId = 'users'
    const dataFile = 'data/users.json'
    const repo = createMutableRepository({
      id: repoId,
      resourcePath: dataFile,
      schema: mockSchema,
      dataProvider: mockDriver,
    })

    const newData = { id: '3', name: 'Jane' }
    mockDriver.readFile.mockResolvedValue([newData])

    expect(repo.create(newData)).rejects.toThrowError(
      `${repoId} with id ${newData.id} already exists`,
    )
  })

  test('createMany should add many rows', async () => {
    const repoId = 'users'
    const dataFile = 'data/users.json'
    const repo = createMutableRepository({
      id: repoId,
      resourcePath: dataFile,
      schema: mockSchema,
      dataProvider: mockDriver,
    })

    const newData = [
      { id: '3', name: 'Jane' },
      { id: '4', name: 'Kate' },
    ]
    await repo.createMany(newData)

    expect(mockDriver.writeFile).toHaveBeenCalledTimes(1)
    expect(mockDriver.writeFile).toHaveBeenCalledWith(dataFile, newData)
  })

  test('createMany should reject with "already exists" error', async () => {
    const repoId = 'users'
    const dataFile = 'data/users.json'
    const repo = createMutableRepository({
      id: repoId,
      resourcePath: dataFile,
      schema: mockSchema,
      dataProvider: mockDriver,
    })

    const newData = [
      { id: '3', name: 'Jane' },
      { id: '4', name: 'Kate' },
    ]
    mockDriver.readFile.mockResolvedValue(newData)
    expect(repo.createMany(newData)).rejects.toThrowError(`${repoId} with id 3 already exists`)
  })

  test('delete should call the driver.writeFile function without the specified entity', async () => {
    const repoId = 'users'
    const dataFile = 'data/users.json'
    const mockData = [
      { id: '1', name: 'John' },
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Jane' },
    ]
    mockDriver.readFile.mockResolvedValue(mockData)

    const repo = createMutableRepository({
      id: repoId,
      resourcePath: dataFile,
      schema: mockSchema,
      dataProvider: mockDriver,
    })
    await repo.delete('2')

    expect(mockDriver.writeFile).toHaveBeenCalledTimes(1)
    expect(mockDriver.writeFile).toHaveBeenCalledWith(dataFile, [
      { id: '1', name: 'John' },
      { id: '3', name: 'Jane' },
    ])
  })

  test('deleteMany should call the driver.writeFile function without the specified entities', async () => {
    const repoId = 'users'
    const dataFile = 'data/users.json'
    const mockData = [
      { id: '1', name: 'John' },
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Jane' },
      { id: '4', name: 'Kate' },
    ]
    mockDriver.readFile.mockResolvedValue(mockData)

    const repo = createMutableRepository({
      id: repoId,
      resourcePath: dataFile,
      schema: mockSchema,
      dataProvider: mockDriver,
    })
    await repo.deleteMany(['2', '4'])

    expect(mockDriver.writeFile).toHaveBeenCalledTimes(1)
    expect(mockDriver.writeFile).toHaveBeenCalledWith(dataFile, [
      { id: '1', name: 'John' },
      { id: '3', name: 'Jane' },
    ])
  })

  test('update should call the driver.writeFile function with the updated entity', async () => {
    const repoId = 'users'
    const dataFile = 'data/users.json'
    const mockData = [
      { id: '1', name: 'John' },
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Jane' },
    ]
    mockDriver.readFile.mockResolvedValue(mockData)

    const repo = createMutableRepository({
      id: repoId,
      resourcePath: dataFile,
      schema: mockSchema,
      dataProvider: mockDriver,
    })
    await repo.update({ id: '2', name: 'Alicia' })

    expect(mockDriver.writeFile).toHaveBeenCalledTimes(1)
    expect(mockDriver.writeFile).toHaveBeenCalledWith(dataFile, [
      { id: '1', name: 'John' },
      { id: '2', name: 'Alicia' },
      { id: '3', name: 'Jane' },
    ])
  })

  test('updateMany should call the driver.writeFile function with the updated entities', async () => {
    const repoId = 'users'
    const dataFile = 'data/users.json'
    const mockData = [
      { id: '1', name: 'John' },
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Jane' },
    ]
    mockDriver.readFile.mockResolvedValue(mockData)

    const repo = createMutableRepository({
      id: repoId,
      resourcePath: dataFile,
      schema: mockSchema,
      dataProvider: mockDriver,
    })
    await repo.updateMany([
      { id: '1', name: 'Johnny' },
      { id: '3', name: 'Janet' },
    ])

    expect(mockDriver.writeFile).toHaveBeenCalledTimes(1)
    expect(mockDriver.writeFile).toHaveBeenCalledWith(dataFile, [
      { id: '1', name: 'Johnny' },
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Janet' },
    ])
  })
})
