import { createReadOnlyRepository } from '../core/createReadOnlyRepository'
import type { Repository, RepositoryDataProvider } from '../core/types'
import { Ability, abilitySchema } from '../schemas'
import { createSearchIndex, SearchEngine } from '../search'
import createSearchEngine, { defaultSearchIndexHydrator } from '../search/createSearchEngine'

export function createAbilityRepository(dataProvider: RepositoryDataProvider): Repository<Ability> {
  return createReadOnlyRepository<Ability>({
    id: 'abilities',
    resourcePath: 'data/abilities.min.json',
    schema: abilitySchema,
    dataProvider: dataProvider,
  })
}

export function createAbilitySearchEngine(repository: Repository<Ability>): SearchEngine<Ability> {
  return createSearchEngine<Ability>(repository, createSearchIndex(), defaultSearchIndexHydrator)
}
