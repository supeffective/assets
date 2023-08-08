import { Entity } from '../repositories'
import { Awaitable } from '../types'

export interface SearchFilter<R extends Entity> {
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
export type SearchQuery<R extends Entity> = Array<SearchFilter<R>[]>

export type SearchFunction<R extends Entity> = (
  q: string | SearchQuery<R>,
  limit?: number,
  offset?: number,
  sortBy?: keyof R,
  sortDir?: 'asc' | 'desc'
) => Awaitable<Array<R>>

export type TokenizerToken = string[] | string | null
export type TokenizerFunction<R extends Entity> = (entity: R) => TokenizerToken

export interface FullTextSearchEngine {
  /**
   * Add a new entity to the search index
   * @param id Entity id
   * @param text Full text to index
   */
  index: (id: string, text: string) => Awaitable<void>
  clear: () => Awaitable<void>
  size: () => Awaitable<number>
  entries: () => Awaitable<Array<[string, string]>>

  /**
   * Search for results matching the given text
   * @param text Full text search query
   * @param limit Maximum number of results to return
   * @returns Set of matching ids
   */
  search: (text: string, limit?: number) => Awaitable<Array<string>>
}
