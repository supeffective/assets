import { CompactPokemon, pokemonSchema, type Pokemon } from '../schemas/pokemon'
import createMutableRepository from './base/createMutableRepository'
import createReadOnlyRepository from './base/createReadOnlyRepository'
import type {
  MutableRepository,
  MutableRepositoryDriver,
  Repository,
  RepositoryDriver,
} from './base/types'

export function createPokemonRepository(
  driver: RepositoryDriver,
  cacheTtl: number = 60 * 15 * 1000 // 15 minutes
): Repository<Pokemon> {
  return createReadOnlyRepository<Pokemon>(
    'pokemon',
    driver,
    pokemonSchema,
    'data/pokemon.min.json',
    cacheTtl
  )
}

export function createCompactPokemonRepository(
  driver: RepositoryDriver,
  cacheTtl: number = 60 * 15 * 1000 // 15 minutes
): Repository<CompactPokemon> {
  return createReadOnlyRepository<CompactPokemon>(
    'pokemon-compact',
    driver,
    pokemonSchema,
    'data/pokemon-compact.min.json',
    cacheTtl
  )
}

export function createMutablePokemonRepository(
  driver: MutableRepositoryDriver,
  cacheTtl: number = 60 * 15 * 1000 // 15 minutes
): MutableRepository<Pokemon> {
  return createMutableRepository<Pokemon>(
    'pokemon',
    driver,
    pokemonSchema,
    'data/pokemon.min.json',
    cacheTtl
  )
}
