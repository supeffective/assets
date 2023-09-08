import { z } from 'zod'

import { Entity, RepositoryConfig, type Repository } from './types'

export function createReadOnlyRepository<R extends Entity>(
  config: RepositoryConfig<R>,
): Repository<R> {
  const getAll = async () => {
    return await config.dataProvider.readFile<R>(config.resourcePath)
  }

  const repo: Repository<R> = {
    id: config.id,
    async getAll() {
      return await getAll()
    },
    async getById(id) {
      const data = await getAll()
      const found = data.find(item => item.id === id)

      if (!found) {
        throw new Error(`${config.id} with id ${id} not found`)
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
      const result = config.schema.safeParse(data)
      if (!result.success) {
        return { success: false, error: new Error(result.error.message) }
      }

      return { success: true }
    },
    validateMany(data) {
      const result = z.array(config.schema).safeParse(data)
      if (!result.success) {
        return { success: false, error: new Error(result.error.message) }
      }

      return { success: true }
    },
  }

  return repo
}
