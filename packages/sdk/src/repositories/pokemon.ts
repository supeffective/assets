import { kv } from '..'
import {
  CompactPokemon,
  pokemonCompactSchema,
  pokemonSchema,
  type Pokemon,
} from '../schemas/pokemon'
import createMutableRepository from './base/createMutableRepository'
import createReadOnlyRepository from './base/createReadOnlyRepository'
import { createTextSearchEngine } from './base/createTextSearchEngine'
import type {
  MutableRepository,
  MutableRepositoryStorageDriver,
  Repository,
  RepositoryStorageDriver,
  RepositoryTextSearchEngine,
} from './base/types'

export async function createPokemonTextSearchEngine(): Promise<
  RepositoryTextSearchEngine<Pokemon>
> {
  return createTextSearchEngine<Pokemon>(kv, 'pokemon', ':')
}

export async function createCompactPokemonTextSearchEngine(): Promise<
  RepositoryTextSearchEngine<Pokemon>
> {
  return createTextSearchEngine<Pokemon>(kv, 'pokemon-compact', ':')
}

function pokemonTextSearchInitializer<K extends CompactPokemon | Pokemon>(
  entities: K[],
  searchEngine: RepositoryTextSearchEngine<K>
): Promise<void> {
  return searchEngine.index(entities, [
    [
      'num',
      pk => {
        const dexNum = (pk.dexNum >= 5000 ? 0 : pk.dexNum).toString()

        return [dexNum, dexNum.padStart(3, '0'), dexNum.padStart(4, '0')]
      },
    ],
    ['name', pk => [pk.id, pk.name, pk.name.replace(/ /g, '').replace(/\s/g, '')]],
    ['type', pk => [pk.type1, pk.type2].filter(Boolean) as string[]],
    ['base', pk => pk.baseSpecies || pk.id],
    ['color', pk => pk.color || null],
    ['id', pk => pk.id || null],
    ['storable', pk => (pk.storableIn.length > 0 ? pk.storableIn : null)],
    [
      'obtainable',
      pk => {
        if ('obtainableIn' in pk) {
          return pk.obtainableIn.length > 0 ? pk.obtainableIn : null
        }

        return null
      },
    ],
  ])
}

export function createPokemonRepository(
  storageDriver: RepositoryStorageDriver,
  textSearchEngine: RepositoryTextSearchEngine<Pokemon>,
  cacheTtl: number = 60 * 15 * 1000 // 15 minutes
): Repository<Pokemon> {
  return createReadOnlyRepository<Pokemon>({
    id: 'pokemon',
    resourcePath: 'data/pokemon.min.json',
    schema: pokemonSchema,
    storageDriver,
    textSearchEngine,
    searchInitializer: pokemonTextSearchInitializer,
    cacheTtl,
  })
}

export function createCompactPokemonRepository(
  storageDriver: RepositoryStorageDriver,
  textSearchEngine: RepositoryTextSearchEngine<CompactPokemon>,
  cacheTtl: number = 60 * 15 * 1000 // 15 minutes
): Repository<CompactPokemon> {
  return createReadOnlyRepository<CompactPokemon>({
    id: 'pokemon-compact',
    resourcePath: 'data/pokemon-compact.min.json',
    schema: pokemonCompactSchema,
    storageDriver,
    textSearchEngine,
    searchInitializer: pokemonTextSearchInitializer,
    cacheTtl,
  })
}

export function createMutablePokemonRepository(
  storageDriver: MutableRepositoryStorageDriver,
  textSearchEngine: RepositoryTextSearchEngine<Pokemon>,
  cacheTtl: number = 60 * 15 * 1000 // 15 minutes
): MutableRepository<Pokemon> {
  return createMutableRepository<Pokemon>({
    id: 'pokemon',
    resourcePath: 'data/pokemon.json',
    schema: pokemonSchema,
    storageDriver,
    textSearchEngine,
    searchInitializer: pokemonTextSearchInitializer,
    cacheTtl,
  })
}
