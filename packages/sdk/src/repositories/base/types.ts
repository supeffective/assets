import { z } from 'zod'

export interface Entity {
  id: string
  name: string
}

export type EntityValidationResult = { success: boolean; error?: Error }

export interface RepositoryFilter<R extends Entity> {
  field: keyof R
  value?: string | number | boolean | string[] | number[]
  operator:
    | 'neq'
    | 'eq'
    | 'gt'
    | 'lt'
    | 'gte'
    | 'lte'
    | 'in'
    | 'notin'
    | 'ends'
    | 'starts'
    | 'contains'
    | 'ncontains'
    | 'isnull'
    | 'notnull'
}

/**
 * RepositoryQuery is a 2D array of RepositoryFilter.
 * The first level (root) are OR conditions, the second level (nested arrays) are AND.
 *
 * e.g.: [ // people with name John OR age equal to 18 AND lastname equal to Smith:
 *  [{ field: 'name', value: 'John', operator: 'eq' }],
 *  [{ field: 'age', value: 18, operator: 'eq' }, { field: 'lastname', value: 'Smith', operator: 'eq' }]
 * ]
 */
export type RepositoryQuery<R extends Entity> = Array<RepositoryFilter<R>[]>

export interface Repository<R extends Entity> {
  id: string
  getAll(): Promise<Array<R>>
  getById(id: string): Promise<R>
  findById(id: string): Promise<R | undefined>
  getManyByIds(ids: Array<string>): Promise<Array<R>>
  exists(id: string): Promise<boolean>
  assureExists(id: string): Promise<void>
  search(
    q: string | RepositoryQuery<R>,
    limit?: number,
    offset?: number,
    sortBy?: keyof R,
    sortDir?: 'asc' | 'desc'
  ): Promise<Array<R>>
  validate(data: R): EntityValidationResult
  validateMany(data: Array<R>): EntityValidationResult
}

export interface RepositoryStorageDriver {
  id: string
  baseUri: string
  resolveUri(relativePath: string): string
  readFile<R extends Entity>(relativePath: string, cacheTtl?: number): Promise<Array<R>>
  clearCache(relativePath: string): Promise<void>
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

export interface MutableRepositoryStorageDriver extends RepositoryStorageDriver {
  writeFile<R extends Entity>(relativePath: string, data: Array<R>): Promise<void>
}

export type RepositoryTextSearchEngine<R extends Entity> = {
  /**
   * Index the given entities
   * @param entities Entities to index
   * @param tokens Array of [fieldName, tokenizer] tuples
   * @returns Promise
   * @example
   * const entities = [{ id: '1', name: 'John Doe' }, { id: '2', name: 'Jane Doe' }]
   * const tokens = [['name', (item) => item.name.split(' ')]]
   * await searchEngine.index(entities, tokens)
   * // Now you can search for entities matching 'John' or 'Doe'
   * const results = await searchEngine.search('John Doe')
   * // results = Set(['1', '2'])
   * const results = await searchEngine.searchWith(entities, 'Jane')
   * // results = [{ id: '2', name: 'Jane Doe' }]
   **/
  index: (
    entities: R[],
    tokens: Array<[keyof R | string, (entity: R) => string[] | string | null]>
  ) => Promise<void>

  isIndexed: () => Promise<boolean>

  /**
   * Search for entities matching the given text
   * @param text Full text search query
   * @returns Set of ids of matching entities
   */
  search: (text: string) => Promise<Set<string>>

  /**
   * Search for entities matching the given text
   * @param entities Entities to search in
   * @param text Full text search query
   * @returns The matching entities
   */
  searchWith: (entities: R[], text: string) => Promise<R[]>
}

export type RepositoryConfig<
  R extends Entity,
  S extends RepositoryStorageDriver = RepositoryStorageDriver,
> = {
  id: string
  schema: z.ZodSchema<R>
  resourcePath: string
  storageDriver: S
  textSearchEngine: RepositoryTextSearchEngine<R>
  searchInitializer?: (
    entities: R[],
    searchEngine: RepositoryTextSearchEngine<R>,
    repository: Repository<R>
  ) => Promise<void>
  cacheTtl?: number
}

export interface AssetUrlResolver {
  baseUri: string
  resolveUri(relativePath: string): string
  pokemonImg(nid: string, variant?: string, shiny?: boolean): string
  gameImg(id: string, variant?: string): string
  itemImg(id: string, variant?: string): string
  ribbonImg(id: string, variant?: string): string
  markImg(id: string, variant?: string): string
  typeImg(id: string, variant?: string, withBg?: boolean): string
  originMarkImg(id: string): string
}
