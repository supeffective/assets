import { SafeParseReturnType } from 'zod'

// @ts-ignore
import _records from '@pkg/assets/data/pokemon.json'

import { IDType } from '../schemas/common'
import { Pokemon, pokemonSchema } from '../schemas/pokemon'
import { SWITCH_GAMESET_IDS } from './gamesets'

const _pokemonList = _records as any[]
const _pokemonMap = new Map<IDType, Pokemon>(
  (_pokemonList as unknown as Pokemon[]).map(pkm => [pkm.id, validatePokemonOrFail(pkm)])
)

export function validatePokemon(record: Pokemon): SafeParseReturnType<Pokemon, Pokemon> {
  return pokemonSchema.safeParse(record)
}

export function validatePokemonOrFail(record: Pokemon): Pokemon {
  try {
    return pokemonSchema.parse(record)
  } catch (error) {
    throw new Error(`Invalid Pokémon record for ${record.id}: ${error}`)
  }
}

export function getPokemon(id: string): Pokemon | null {
  const pkm = _pokemonMap.get(id)
  if (!pkm) {
    return null
  }

  return pkm
}

export function getManyPokemon(ids: string[]): Pokemon[] {
  return ids.map(id => getPokemonOrFail(id))
}

export function getAllPokemon(): Pokemon[] {
  return _pokemonList as unknown as Pokemon[]
}

export function getPreviousAndNextPokemon(
  list: Pokemon[],
  id: string
): {
  prev: Pokemon | null
  next: Pokemon | null
} {
  const index = list.findIndex(pkm => pkm.id === id)
  const prev = index <= 0 ? null : list[index - 1]
  const next = index < list.length - 1 ? list[index + 1] : null

  return {
    prev,
    next,
  }
}

export function getAllPokemonMappedById(): Map<IDType, Pokemon> {
  return _pokemonMap
}

export function getPokemonMissingOnSwitchGames(): Pokemon[] {
  return getAllPokemon()
    .filter(pkm => {
      return (
        !pkm.obtainableIn.some(gs => SWITCH_GAMESET_IDS.includes(gs)) &&
        !pkm.storableIn.some(gs => SWITCH_GAMESET_IDS.includes(gs))
      )
    })
    .filter(pkm => pkm.dexNum > 0)
}

type PokemonForGameSet = {
  obtainable: Pokemon[]
  storable: Pokemon[]
  transferOnly: Pokemon[]
  eventOnly: Pokemon[]
}
export function getPokemonForGameSet(gameSetId: string): PokemonForGameSet {
  const data: PokemonForGameSet = {
    obtainable: [],
    storable: [],
    transferOnly: [],
    eventOnly: [],
  }

  const pokes = getAllPokemon()

  for (const pkm of pokes) {
    if (pkm.obtainableIn.includes(gameSetId)) {
      data.obtainable.push(pkm)
    }

    if (pkm.storableIn.includes(gameSetId)) {
      data.storable.push(pkm)
    }

    if (pkm.eventOnlyIn.includes(gameSetId)) {
      data.eventOnly.push(pkm)
    }

    if (
      pkm.storableIn.includes(gameSetId) &&
      !pkm.obtainableIn.includes(gameSetId) &&
      !pkm.eventOnlyIn.includes(gameSetId)
    ) {
      data.transferOnly.push(pkm)
    }
  }

  return data
}
export function getExclusivePokemonForGame(gameId: string): Pokemon[] {
  return getAllPokemon()
    .filter(pkm => {
      return pkm.versionExclusiveIn.some(g => gameId === g)
    })
    .filter(pkm => pkm.dexNum > 0)
}

export function getPokemonOrFail(id: string): Pokemon {
  const entry = getPokemon(id)

  if (!entry) {
    throw new Error(`No Pokémon entry found for ID ${id}`)
  }

  return validatePokemonOrFail(entry)
}

export type UpdatePokemon = Partial<Pokemon> & { id: string }
export type PokemonMap = Map<string, Pokemon>

export type UpdatePokemonFn = (data: UpdatePokemon) => Pokemon
