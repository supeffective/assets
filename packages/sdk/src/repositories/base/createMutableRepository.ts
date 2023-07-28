import type { z } from 'zod'

import createReadOnlyRepository from './createReadOnlyRepository'
import type { Entity, EntityUpdate, MutableRepository, MutableRepositoryDriver } from './types'

export default function createMutableRepository<R extends Entity>(
  repoId: string,
  driver: MutableRepositoryDriver,
  schema: z.ZodSchema<any>,
  dataFile: string = `data/${repoId}.json`,
  cacheTtl: number = 60 * 15 * 1000 // 15 minutes
): MutableRepository<R> {
  const baseRepo = createReadOnlyRepository<R>(repoId, driver, schema, dataFile, cacheTtl)
  const repo: MutableRepository<R> = {
    ...baseRepo,
    async create(newEntity: R) {
      if (await baseRepo.exists(newEntity.id)) {
        throw new Error(`${repoId} with id ${newEntity.id} already exists`)
      }

      const allEntities = await baseRepo.getAll()
      const updatedEntities = [...allEntities, newEntity]
      await driver.writeFile(dataFile, updatedEntities)

      return newEntity
    },
    async createMany(newEntities: R[]) {
      for (const newEntity of newEntities) {
        if (await baseRepo.exists(newEntity.id)) {
          throw new Error(`${repoId} with id ${newEntity.id} already exists`)
        }
      }

      const allEntities = await baseRepo.getAll()
      const updatedEntities = [...allEntities, ...newEntities]
      await driver.writeFile(dataFile, updatedEntities)

      return newEntities
    },
    async delete(id: string) {
      baseRepo.assureExists(id)

      const allEntities = await baseRepo.getAll()
      const updatedEntities = allEntities.filter(entity => entity.id !== id)
      await driver.writeFile(dataFile, updatedEntities)
    },
    async deleteMany(ids: string[]) {
      ids.forEach(id => baseRepo.assureExists(id))

      const allEntities = await baseRepo.getAll()
      const updatedEntities = allEntities.filter(entity => !ids.includes(entity.id))
      await driver.writeFile(dataFile, updatedEntities)
    },
    async update(updatedEntity: EntityUpdate<R>) {
      baseRepo.assureExists(updatedEntity.id)

      const allEntities = await baseRepo.getAll()
      const updatedEntities = allEntities.map(entity =>
        entity.id === updatedEntity.id ? { ...entity, ...updatedEntity } : entity
      )
      await driver.writeFile(dataFile, updatedEntities)
    },
    async updateMany(updatedEntities: EntityUpdate<R>[]) {
      updatedEntities.forEach(entity => baseRepo.assureExists(entity.id))

      const allEntities = await baseRepo.getAll()
      const updatedEntitiesMap = new Map(updatedEntities.map(entity => [entity.id, entity]))

      const updatedEntitiesResult = allEntities.map(entity =>
        updatedEntitiesMap.has(entity.id)
          ? { ...entity, ...updatedEntitiesMap.get(entity.id) }
          : entity
      )
      await driver.writeFile(dataFile, updatedEntitiesResult)
    },
  }

  return repo
}
