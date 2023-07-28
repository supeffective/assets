import { z } from 'zod'

import type { Entity, Repository, RepositoryDriver } from './types'

export default function createReadOnlyRepository<R extends Entity>(
  repoId: string,
  driver: RepositoryDriver,
  schema: z.ZodSchema<any>,
  dataFile: string = `data/${repoId}.json`,
  cacheTtl: number = 60 * 15 * 1000 // 15 minutes
): Repository<R> {
  const getAll = async () => {
    return await driver.readFile<R>(dataFile, cacheTtl)
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
    async search() {
      return Promise.reject(new Error('Not implemented'))
    },
    async query() {
      return Promise.reject(new Error('Not implemented'))
    },
  }

  return repo
}
