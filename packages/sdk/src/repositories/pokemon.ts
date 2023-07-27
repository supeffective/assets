import { pokemonSchema, type Pokemon } from '../schemas/pokemon'
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
  cacheTtl: number = 600
): Repository<Pokemon> {
  return createReadOnlyRepository<Pokemon>(
    'pokemon',
    driver,
    pokemonSchema,
    'data/pokemon.json',
    cacheTtl
  )
}

export function createMutablePokemonRepository(
  driver: MutableRepositoryDriver
): MutableRepository<Pokemon> {
  return createMutableRepository<Pokemon>('pokemon', driver, pokemonSchema, 'data/pokemon.json')
}
