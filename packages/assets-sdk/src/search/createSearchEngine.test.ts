import { Entity } from '../core'
import createSearchEngine from './createSearchEngine'
import { SearchQuery } from './types'

const mockRepository: any = {
  id: 'mockRepository',
  getAll: jest.fn(),
}

const mockSearchIndex: any = {
  search: jest.fn(),
  // size: jest.fn().mockResolvedValue(0),
}

describe('createSearchEngine.search', () => {
  const entities: Entity[] = [
    { id: '1', name: 'John' },
    { id: '2', name: 'Alice' },
    { id: '3', name: 'Bob' },
    { id: '4', name: 'Jonas' },
  ]

  const engine = createSearchEngine(mockRepository, mockSearchIndex)

  beforeEach(() => {
    jest.clearAllMocks()

    mockRepository.getAll.mockResolvedValue(entities)
  })

  it('should return entities filtered by query', async () => {
    const query: SearchQuery<Entity> = [
      [{ field: 'name', value: 'John', operator: 'eq' }],
      [{ field: 'name', value: 'Bob', operator: 'eq' }],
    ]

    const result = await engine.search(query)

    expect(result).toEqual([
      { id: '1', name: 'John' },
      { id: '3', name: 'Bob' },
    ])
  })

  it('should return empty array if no entities match the query', async () => {
    const query: SearchQuery<Entity> = [[{ field: 'name', value: 'Unknown', operator: 'eq' }]]

    const result = await engine.search(query)

    expect(result).toEqual([])
  })

  it('should return paginated results', async () => {
    const query: SearchQuery<Entity> = [[]] // Empty query will return all entities
    const limit = 2
    const offset = 1

    const result = await engine.search(query, limit, offset)

    expect(result).toEqual([
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Bob' },
    ])
  })

  it('should return sorted results', async () => {
    const query: SearchQuery<Entity> = [[]] // Empty query will return all entities
    const sortBy = 'name'
    const sortDir = 'asc'

    const result = await engine.search(query, undefined, undefined, sortBy, sortDir)

    expect(result).toEqual([
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Bob' },
      { id: '1', name: 'John' },
      { id: '4', name: 'Jonas' },
    ])
  })

  it('should return sorted results in reverse order', async () => {
    const query: SearchQuery<Entity> = [[]] // Empty query will return all entities
    const sortBy = 'name'
    const sortDir = 'desc'

    const result = await engine.search(query, undefined, undefined, sortBy, sortDir)

    expect(result).toEqual([
      { id: '4', name: 'Jonas' },
      { id: '1', name: 'John' },
      { id: '3', name: 'Bob' },
      { id: '2', name: 'Alice' },
    ])
  })

  it('should throw an error for an invalid operator in the query', async () => {
    const query: SearchQuery<Entity> = [
      [{ field: 'name', value: 'John', operator: 'invalidOperator' as any }],
    ]

    await expect(engine.search(query)).rejects.toThrow('Invalid operator: invalidOperator')
  })

  it('should handle "in" operator', async () => {
    const query: SearchQuery<Entity> = [[{ field: 'name', value: ['John', 'Bob'], operator: 'in' }]]

    const result = await engine.search(query)

    expect(result).toEqual([
      { id: '1', name: 'John' },
      { id: '3', name: 'Bob' },
    ])
  })

  it('should throw an error when value is not an array for the "in" operator', async () => {
    const query: SearchQuery<Entity> = [[{ field: 'name', value: 'John', operator: 'in' }]]

    await expect(engine.search(query)).rejects.toThrow("Invalid value for operator 'in': John")
  })

  it('should handle "notin" operator', async () => {
    const query: SearchQuery<Entity> = [
      [{ field: 'name', value: ['John', 'Bob'], operator: 'notin' }],
    ]

    const result = await engine.search(query)

    expect(result).toEqual([
      { id: '2', name: 'Alice' },
      { id: '4', name: 'Jonas' },
    ])
  })

  it('should throw an error when value is not an array for the "notin" operator', async () => {
    const query: SearchQuery<Entity> = [[{ field: 'name', value: 'John', operator: 'notin' }]]

    await expect(engine.search(query)).rejects.toThrow("Invalid value for operator 'notin': John")
  })

  it('should handle "ends" operator', async () => {
    const query: SearchQuery<Entity> = [[{ field: 'name', value: 'onas', operator: 'ends' }]]

    const result = await engine.search(query)

    expect(result).toEqual([{ id: '4', name: 'Jonas' }])
  })

  it('should handle "starts" operator', async () => {
    const query: SearchQuery<Entity> = [[{ field: 'name', value: 'Jo', operator: 'starts' }]]

    const result = await engine.search(query)

    expect(result).toEqual([
      { id: '1', name: 'John' },
      { id: '4', name: 'Jonas' },
    ])
  })

  it('should handle "contains" operator', async () => {
    const query: SearchQuery<Entity> = [[{ field: 'name', value: 'ona', operator: 'contains' }]]

    const result = await engine.search(query)

    expect(result).toEqual([{ id: '4', name: 'Jonas' }])
  })

  it('should handle "ncontains" operator', async () => {
    const query: SearchQuery<Entity> = [[{ field: 'name', value: 'ona', operator: 'ncontains' }]]

    const result = await engine.search(query)

    expect(result).toEqual([
      { id: '1', name: 'John' },
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Bob' },
    ])
  })

  it('should handle "isnull" operator', async () => {
    const query: SearchQuery<Entity> = [[{ field: 'name', operator: 'isnull' }]]

    const result = await engine.search(query)

    expect(result).toEqual([])
  })

  it('should handle "notnull" operator', async () => {
    const query: SearchQuery<Entity> = [[{ field: 'name', operator: 'notnull' }]]

    const result = await engine.search(query)

    expect(result).toEqual(entities)
  })

  it('should handle "neq" operator', async () => {
    const query: SearchQuery<Entity> = [[{ field: 'name', value: 'John', operator: 'neq' }]]

    const result = await engine.search(query)

    expect(result).toEqual([
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Bob' },
      { id: '4', name: 'Jonas' },
    ])
  })

  it('should handle "lt" operator', async () => {
    const query: SearchQuery<Entity> = [[{ field: 'id', value: '3', operator: 'lt' }]]

    const result = await engine.search(query)

    expect(result).toEqual([
      { id: '1', name: 'John' },
      { id: '2', name: 'Alice' },
    ])
  })

  it('should handle "gt" operator', async () => {
    const query: SearchQuery<Entity> = [[{ field: 'id', value: '2', operator: 'gt' }]]

    const result = await engine.search(query)

    expect(result).toEqual([
      { id: '3', name: 'Bob' },
      { id: '4', name: 'Jonas' },
    ])
  })

  it('should handle "lte" operator', async () => {
    const query: SearchQuery<Entity> = [[{ field: 'id', value: '3', operator: 'lte' }]]

    const result = await engine.search(query)

    expect(result).toEqual([
      { id: '1', name: 'John' },
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Bob' },
    ])
  })

  it('should handle "gte" operator', async () => {
    const query: SearchQuery<Entity> = [[{ field: 'id', value: '2', operator: 'gte' }]]

    const result = await engine.search(query)

    expect(result).toEqual([
      { id: '2', name: 'Alice' },
      { id: '3', name: 'Bob' },
      { id: '4', name: 'Jonas' },
    ])
  })
})
