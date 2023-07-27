import { z } from 'zod'

import { cachedResult } from '../../utils/cachedResource'
import type { Entity, Repository, RepositoryDriver } from './types'

export default function createReadOnlyRepository<R extends Entity>(
  repoId: string,
  driver: RepositoryDriver,
  schema: z.ZodSchema<any>,
  dataFile: string = `data/${repoId}.json`,
  cacheTtl: number = 600
): Repository<R> {
  const getAll = cachedResult<R[]>(cacheTtl, async () => {
    return await driver.readFile<R>(dataFile)
  })

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
    search() {
      throw new Error('Not implemented')
    },
    query() {
      throw new Error('Not implemented')
    },
  }

  return repo
}
