import { z } from 'zod'

import {
  Entity,
  RepositoryConfig,
  RepositoryQuery,
  type Repository,
  type RepositoryFilter,
} from './types'

function applyFilter<R extends Entity>(entity: R, filter: RepositoryFilter<R>): boolean {
  const { field, value, operator } = filter
  const fieldValue = entity[field]
  const strFieldVal = String(fieldValue).toLowerCase()
  const strVal = String(value).toLowerCase()

  switch (operator) {
    case 'eq':
      return fieldValue === value
    case 'neq':
      return fieldValue !== value
    case 'gt':
      if (value === undefined) {
        return false
      }

      return fieldValue > value
    case 'lt':
      if (value === undefined) {
        return false
      }

      return fieldValue < value
    case 'gte':
      if (value === undefined) {
        return false
      }

      return fieldValue >= value
    case 'lte':
      if (value === undefined) {
        return false
      }

      return fieldValue <= value
    case 'in':
      if (!Array.isArray(value)) {
        throw new Error(`Invalid value for operator 'in': ${value}`)
      }

      return (value as Array<string | number>).includes(fieldValue)
    case 'notin':
      if (!Array.isArray(value)) {
        throw new Error(`Invalid value for operator 'notin': ${value}`)
      }

      return !(value as Array<string | number>).includes(fieldValue)
    case 'ends':
      return typeof fieldValue === 'string' && strFieldVal.endsWith(strVal)
    case 'starts':
      return typeof fieldValue === 'string' && strFieldVal.startsWith(strVal)
    case 'contains':
      return typeof fieldValue === 'string' && strFieldVal.includes(strVal)
    case 'ncontains':
      return typeof fieldValue === 'string' && !strFieldVal.includes(strVal)
    case 'isnull':
      return fieldValue === null || fieldValue === undefined
    case 'notnull':
      return fieldValue !== null && fieldValue !== undefined
    default:
      throw new Error(`Invalid operator: ${operator}`)
  }
}

function applyQuery<R extends Entity>(entities: R[], query: RepositoryQuery<R>): R[] {
  return entities.filter(entity => {
    return query.some(filterGroup => {
      // For each group of filters, check if any of them (OR) pass for the entity
      return filterGroup.every(filter => applyFilter(entity, filter))
    })
  })
}

export default function createReadOnlyRepository<R extends Entity>({
  id: repoId,
  resourcePath,
  schema,
  storageDriver,
  textSearchEngine,
  searchInitializer,
  cacheTtl = 60 * 15 * 1000, // 15 minutes
}: RepositoryConfig<R>): Repository<R> {
  const getAll = async () => {
    return await storageDriver.readFile<R>(resourcePath, cacheTtl)
  }

  const repo: Repository<R> = {
    id: repoId,
    async getAll() {
      return await getAll()
    },
    async getById(id) {
      const data = await getAll()
      const found = data.find(item => item.id === id)

      if (!found) {
        throw new Error(`${repoId} with id ${id} not found`)
      }

      return found
    },
    async exists(id) {
      return this.findById(id).then(Boolean)
    },
    async assureExists(id) {
      this.getById(id)
    },
    async findById(id) {
      return getAll().then(data => data.find(item => item.id === id))
    },
    async getManyByIds(ids) {
      return getAll().then(data => data.filter(item => ids.includes(item.id)))
    },
    validate(data) {
      const result = schema.safeParse(data)
      if (!result.success) {
        return { success: false, error: new Error(result.error.message) }
      }

      return { success: true }
    },
    validateMany(data) {
      const result = z.array(schema).safeParse(data)
      if (!result.success) {
        return { success: false, error: new Error(result.error.message) }
      }

      return { success: true }
    },
    async search(
      q: string | RepositoryQuery<R>,
      limit: number = 0,
      offset: number = 0,
      sortBy?: keyof R,
      sortDir: 'asc' | 'desc' = 'asc'
    ): Promise<R[]> {
      const allEntities = await this.getAll()
      if (!(await textSearchEngine.isIndexed()) && searchInitializer) {
        await searchInitializer(allEntities, textSearchEngine, this)
      }
      let filteredEntities =
        typeof q === 'string'
          ? await textSearchEngine.searchWith(allEntities, q)
          : applyQuery<R>(allEntities, q)

      // Sort the filtered entities if sortBy is provided
      if (sortBy) {
        filteredEntities = [...filteredEntities].sort((a, b) => {
          const aValue = String(a[sortBy] ?? '')
          const bValue = String(b[sortBy] ?? '')

          if (sortDir === 'asc') {
            return aValue.toLowerCase().localeCompare(bValue.toLowerCase())
          } else {
            return bValue.toLowerCase().localeCompare(aValue.toLowerCase())
          }
        })
      }

      // Apply pagination
      const paginatedEntities =
        limit > 0 ? filteredEntities.slice(offset, offset + limit) : filteredEntities.slice(offset)

      return paginatedEntities
    },
  }

  return repo
}
