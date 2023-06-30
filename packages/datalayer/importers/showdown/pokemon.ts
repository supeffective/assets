import { Dex } from '@pkmn/dex'

import { getDataPath } from '../../datafs'
import { getAbilityByShowdownNameOrFail } from '../../repositories/abilities'
import { getItemByShowdownNameOrFail } from '../../repositories/items'
import { getMoveByShowdownNameOrFail } from '../../repositories/moves'
import { getAllPokemon, getPokemonByShowdownNameOrFail } from '../../repositories/pokemon'
import { updateManyPokemon } from '../../repositories/server-side/pokemon'
import { Pokemon } from '../../schemas/pokemon'

export const importShowdownPokemon = function (): void {
  const allPokemon = getAllPokemon()
  const allPokemonByShowdownId: Map<string, Pokemon[]> = new Map()
  for (const pokemon of allPokemon) {
    if (!pokemon.refs?.showdown) {
      throw new Error(`Pokemon ${pokemon.id} has no showdown ref`)
    }
    if (!pokemon.refs?.bulbapedia) {
      throw new Error(`Pokemon ${pokemon.id} has no bulbapedia ref`)
    }
    if (!pokemon.refs?.serebii) {
      throw new Error(`Pokemon ${pokemon.id} has no serebii ref`)
    }
    if (!pokemon.refs?.smogon) {
      throw new Error(`Pokemon ${pokemon.id} has no smogon ref`)
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

  // ------------------------------------------------
  // VALIDATE & cross-check with showdown
  // ------------------------------------------------
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

  const notInShowdown = ['munkidori', 'okidogi', 'fezandipiti', 'ogerpon', 'terapagos']

  for (const [showdownId, pokemonSet] of allPokemonByShowdownId) {
    if (notInShowdown.includes(showdownId)) {
      console.log(`Skipping ${showdownId}`)
      continue
    }
    if (!rowsById.has(showdownId)) {
      throw new Error(`Showdown doesnt have data for: ${showdownId}`)
    }
  }

  // ------------------------------------------------
  // SYNC data with showdown
  // ------------------------------------------------

  for (const pkm of allPokemon) {
    const showdownId = pkm.refs?.showdown
    if (!showdownId) {
      throw new Error(`Pokemon ${pkm.id} has no showdown ref`)
    }

    pkm.forms = [...pkm.forms.filter(form => form !== pkm.id)]

    if (notInShowdown.includes(showdownId)) {
      transformedRows.push(pkm)
      continue
    }

    const showdownData = rowsById.get(showdownId)

    if (!showdownData) {
      throw new Error(`Missing showdown data for ${showdownId}`)
    }

    // abilities
    if (pkm.isSpecialAbilityForm) {
      const showdownAbilityName = showdownData.abilities['S'] ?? showdownData.abilities[0]
      if (!showdownAbilityName) {
        throw new Error(`Missing special ability for ${showdownId}`)
      }
      const ability = getAbilityByShowdownNameOrFail(showdownAbilityName)
      pkm.abilities.primary = ability.id
      pkm.abilities.secondary = null
      pkm.abilities.hidden = null
    } else {
      pkm.abilities.primary = getAbilityByShowdownNameOrFail(showdownData.abilities[0]).id
      if (showdownData.abilities[1]) {
        pkm.abilities.secondary = getAbilityByShowdownNameOrFail(showdownData.abilities[1]).id
      }
      if (showdownData.abilities['H']) {
        pkm.abilities.hidden = getAbilityByShowdownNameOrFail(showdownData.abilities['H']).id
      }
    }

    // weight
    pkm.weight = Math.round(showdownData.weighthg * 10)

    // type1
    pkm.type1 = showdownData.types[0].toLowerCase()
    pkm.type2 = showdownData.types[1]?.toLowerCase() ?? null

    // stats
    pkm.baseStats.hp = showdownData.baseStats.hp
    pkm.baseStats.atk = showdownData.baseStats.atk
    pkm.baseStats.def = showdownData.baseStats.def
    pkm.baseStats.spa = showdownData.baseStats.spa
    pkm.baseStats.spd = showdownData.baseStats.spd
    pkm.baseStats.spe = showdownData.baseStats.spe

    // update psName
    pkm.psName = showdownData.name

    if (showdownData.prevo) {
      const prevo = getPokemonByShowdownNameOrFail(showdownData.prevo)
      let evoItemId = null

      if (showdownData.evoItem) {
        evoItemId = getItemByShowdownNameOrFail(showdownData.evoItem).id
      }

      let evoMoveId = null
      if (showdownData.evoMove) {
        evoMoveId = getMoveByShowdownNameOrFail(showdownData.evoMove).id
      }

      pkm.evolvesFrom = {
        ...pkm.evolvesFrom,
        pokemon: prevo.id,
        level: showdownData.evoLevel || undefined,
        item: evoItemId || undefined,
        move: evoMoveId || undefined,
        region: showdownData.evoRegion?.toLocaleLowerCase() ?? undefined,
        type: showdownData.evoType?.toLocaleLowerCase() ?? undefined,
        condition: showdownData.evoCondition || undefined,
      }
    }

    transformedRows.push(pkm)
  }

  // ------------------------------------------------
  // REGENERATE legacy data
  // ------------------------------------------------

  updateManyPokemon(transformedRows)
}
