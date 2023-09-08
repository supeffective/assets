import { z } from 'zod'

export interface Entity {
  id: string
  name: string
}

export type EntityValidationResult = { success: boolean; error?: Error }

export interface Repository<R extends Entity> {
  id: string
  getAll(): Promise<Array<R>>
  getById(id: string): Promise<R>
  findById(id: string): Promise<R | undefined>
  getManyByIds(ids: Array<string>): Promise<Array<R>>
  exists(id: string): Promise<boolean>
  assureExists(id: string): Promise<void>
  validate(data: R): EntityValidationResult
  validateMany(data: Array<R>): EntityValidationResult
}

export interface RepositoryDataProvider {
  id: string
  baseUri: string
  resolveUri(relativePath: string): string
  readFile<R extends Entity>(relativePath: string): Promise<Array<R>>
}

export type EntityUpdate<R extends Entity> = Partial<R> & { id: Entity['id'] }

export interface MutableRepository<R extends Entity> extends Repository<R> {
  create(entity: R): Promise<R>
  createMany(entities: Array<R>): Promise<Array<R>>
  update(entity: EntityUpdate<R>): Promise<void>
  updateMany(entities: Array<EntityUpdate<R>>): Promise<void>
  delete(id: string): Promise<void>
  deleteMany(ids: Array<string>): Promise<void>
}

export interface MutableRepositoryDataProvider extends RepositoryDataProvider {
  writeFile<R extends Entity>(relativePath: string, data: Array<R>): Promise<void>
}

export type RepositoryConfig<
  R extends Entity,
  S extends RepositoryDataProvider = RepositoryDataProvider,
> = {
  id: string
  schema: z.ZodSchema<R>
  resourcePath: string
  dataProvider: S
}
