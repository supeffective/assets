export interface Entity {
  id: string
  name: string
}

export interface RepositoryFilter {
  field: string
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
 * The first level (root) are AND conditions, the second level (nested arrays) are OR.
 *
 * e.g.: [ // people with name John and age equal to 18 OR lastname equal to Smith:
 *  [{ field: 'name', value: 'John', operator: 'eq' }],
 *  [{ field: 'age', value: 18, operator: 'eq' }, { field: 'lastname', value: 'Smith', operator: 'eq' }]
 * ]
 */
export type RepositoryQuery = Array<RepositoryFilter[]>

export type ValidationResult = { success: boolean; error?: Error }

export interface Repository<R extends Entity> {
  id: string
  getAll(): Promise<Array<R>>
  getById(id: string): Promise<R>
  findById(id: string): Promise<R | undefined>
  getManyByIds(ids: Array<string>): Promise<Array<R>>
  exists(id: string): Promise<boolean>
  assureExists(id: string): Promise<void>
  search(query: string): Promise<Array<R>>
  query(
    q: RepositoryQuery,
    limit?: number,
    offset?: number,
    sortBy?: string,
    sortDir?: 'asc' | 'desc'
  ): Promise<Array<R>>
  validate(data: R): ValidationResult
  validateMany(data: Array<R>): ValidationResult
}

export interface RepositoryDriver {
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

export interface MutableRepositoryDriver extends RepositoryDriver {
  writeFile<R extends Entity>(relativePath: string, data: Array<R>): Promise<void>
}

export interface AssetUrlResolver {
  baseUri: string
  resolveUri(relativePath: string): string
  pokemonImg(nid: string, variant: string, shiny?: boolean): string
  gameImg(id: string, variant: string): string
  itemImg(id: string, variant: string): string
  ribbonImg(id: string, variant: string): string
  markImg(id: string, variant: string): string
  typeImg(id: string, variant: string, withBg?: boolean): string
  originMarkImg(id: string): string
}
