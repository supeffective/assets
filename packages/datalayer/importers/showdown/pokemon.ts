import { Dex } from '@pkmn/dex'

import { getDataPath } from '../../datafs'
import { getAllPokemon } from '../../repositories/pokemon'
import { Pokemon } from '../../schemas/pokemon'

export const importShowdownPokemon = function (): void {
  const allPokemon = getAllPokemon()
  const allPokemonByShowdownId: Map<string, Pokemon[]> = new Map()
  for (const pokemon of allPokemon) {
    if (!pokemon.refs?.showdown) {
      throw new Error(`Pokemon ${pokemon.id} has no showdown ref`)
    }

    const showdownId = pokemon.refs.showdown

    if (!allPokemonByShowdownId.has(showdownId)) {
      allPokemonByShowdownId.set(showdownId, [pokemon])
    } else {
      allPokemonByShowdownId.get(showdownId)?.push(pokemon)
    }
  }
  const outFile = getDataPath('pokemon.json')
  const transformedRows: Pokemon[] = []

  const rawRows = Array.from(Dex.species.all())

  const rawRowsSorted = rawRows
    .filter(row => Number(row.num) > 0)
    .filter(row => {
      if (
        row.id.endsWith('totem') ||
        [
          'pikachucosplay',
          'pikachurockstar',
          'pikachubelle',
          'pikachupopstar',
          'pikachuphd',
          'pikachulibre',
          'pikachustarter',
          'eeveestarter',
          'pichuspikyeared',
          'floetteeternal',
        ].includes(row.id)
      ) {
        return false
      }

      return true
    })
    .sort(function (a, b) {
      return Number(a.num) - Number(b.num)
    })

  const rowsById: Map<string, (typeof rawRows)[number]> = new Map()
  for (const row of rawRowsSorted) {
    if (!allPokemonByShowdownId.has(row.id)) {
      throw new Error(`Missing pokemon.json entry for: ${row.id}`)
    }
    rowsById.set(row.id, row)
  }

  for (const [showdownId, pokemonSet] of allPokemonByShowdownId) {
    if (['munkidori', 'okidogi', 'fezandipiti', 'ogerpon', 'terapagos'].includes(showdownId)) {
      console.log(`Skipping ${showdownId}`)
      continue
    }
    if (!rowsById.has(showdownId)) {
      throw new Error(`Showdown doesnt have data for: ${showdownId}`)
    }
  }

  // writeDataFileAsJson(outFile, transformedRows)
}
