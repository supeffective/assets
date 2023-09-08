import { createReadOnlyRepository } from '../core/createReadOnlyRepository'
import type { Repository, RepositoryDataProvider } from '../core/types'
import { Move, moveSchema } from '../schemas'
import { createSearchIndex, SearchEngine } from '../search'
import createSearchEngine, { defaultSearchIndexHydrator } from '../search/createSearchEngine'

export function createMoveRepository(dataProvider: RepositoryDataProvider): Repository<Move> {
  return createReadOnlyRepository<Move>({
    id: 'moves',
    resourcePath: 'data/moves.min.json',
    schema: moveSchema,
    dataProvider: dataProvider,
  })
}

export function createMoveSearchEngine(repository: Repository<Move>): SearchEngine<Move> {
  return createSearchEngine<Move>(repository, createSearchIndex(), defaultSearchIndexHydrator)
}
