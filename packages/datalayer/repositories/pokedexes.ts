import _records from '@pkg/assets/data/pokedexes.json'

import type { Pokedex } from '../schemas/pokedexes'

export function getPokedexes(): Pokedex[] {
  return _records as Pokedex[]
}

export function getPokedexById(id: string): Pokedex {
  const dex = _records.find(d => d.id === id)
  if (!dex) {
    throw new Error(`Pokedex with id ${id} not found`)
  }
  // const dexEntries = require(`@pkg/assets/data/pokedexes/${id}.json`)

  return {
    ...dex,
    entries: (dex as Pokedex).entries ?? [],
  }
}

export function getPokedexesByGameSetId(gameSetId: string): Array<Pokedex> {
  return _records.filter(d => d.gameSets.includes(gameSetId)) as unknown as Array<Pokedex>
}
