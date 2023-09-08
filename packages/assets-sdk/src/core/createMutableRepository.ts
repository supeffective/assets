import { createReadOnlyRepository } from './createReadOnlyRepository'
import type {
  Entity,
  EntityUpdate,
  MutableRepository,
  MutableRepositoryDataProvider,
  RepositoryConfig,
} from './types'

export function createMutableRepository<R extends Entity>(
  config: RepositoryConfig<R, MutableRepositoryDataProvider>,
): MutableRepository<R> {
  const baseRepo = createReadOnlyRepository<R>(config)
  const repo: MutableRepository<R> = {
    ...baseRepo,
    async create(newEntity: R) {
      if (await baseRepo.exists(newEntity.id)) {
        throw new Error(`${config.id} with id ${newEntity.id} already exists`)
      }

      const allEntities = await baseRepo.getAll()
      const updatedEntities = [...allEntities, newEntity]
      await config.dataProvider.writeFile(config.resourcePath, updatedEntities)

      return newEntity
    },
    async createMany(newEntities: R[]) {
      for (const newEntity of newEntities) {
        if (await baseRepo.exists(newEntity.id)) {
          throw new Error(`${config.id} with id ${newEntity.id} already exists`)
        }
      }

      const allEntities = await baseRepo.getAll()
      const updatedEntities = [...allEntities, ...newEntities]
      await config.dataProvider.writeFile(config.resourcePath, updatedEntities)

      return newEntities
    },
    async delete(id: string) {
      baseRepo.assureExists(id)

      const allEntities = await baseRepo.getAll()
      const updatedEntities = allEntities.filter(entity => entity.id !== id)
      await config.dataProvider.writeFile(config.resourcePath, updatedEntities)
    },
    async deleteMany(ids: string[]) {
      ids.forEach(id => baseRepo.assureExists(id))

      const allEntities = await baseRepo.getAll()
      const updatedEntities = allEntities.filter(entity => !ids.includes(entity.id))
      await config.dataProvider.writeFile(config.resourcePath, updatedEntities)
    },
    async update(updatedEntity: EntityUpdate<R>) {
      baseRepo.assureExists(updatedEntity.id)

      const allEntities = await baseRepo.getAll()
      const updatedEntities = allEntities.map(entity =>
        entity.id === updatedEntity.id ? { ...entity, ...updatedEntity } : entity,
      )
      await config.dataProvider.writeFile(config.resourcePath, updatedEntities)
    },
    async updateMany(updatedEntities: EntityUpdate<R>[]) {
      updatedEntities.forEach(entity => baseRepo.assureExists(entity.id))

      const allEntities = await baseRepo.getAll()
      const updatedEntitiesMap = new Map(updatedEntities.map(entity => [entity.id, entity]))

      const updatedEntitiesResult = allEntities.map(entity =>
        updatedEntitiesMap.has(entity.id)
          ? { ...entity, ...updatedEntitiesMap.get(entity.id) }
          : entity,
      )
      await config.dataProvider.writeFile(config.resourcePath, updatedEntitiesResult)
    },
  }

  return repo
}
