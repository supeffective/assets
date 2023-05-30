import _records from '@pkg/assets/data/pokedexes.json'

import { Pokedex, PokedexEntry } from '../schemas/pokedexes'

export function getPokedexes(): Pokedex[] {
  return _records as Pokedex[]
}

export function getPokedexById(id: string): Pokedex & { entries: Array<PokedexEntry> } {
  const dex = _records.find(d => d.id === id)
  if (!dex) {
    throw new Error(`Pokedex with id ${id} not found`)
  }
  const dexEntries = require(`@pkg/assets/data/pokedexes/${id}.json`)

  return {
    ...dex,
    entries: dexEntries,
  }
}
