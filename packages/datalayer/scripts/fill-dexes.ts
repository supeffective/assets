import fs from 'node:fs'
import path from 'node:path'

import { readFileAsJson, writeFileAsJson } from '../datafs'
import { getPokedexes } from '../repositories/pokedexes'
import { getAllPokemon } from '../repositories/pokemon'
import { Pokedex, PokedexEntry } from '../schemas/pokedexes'

const pokemon = getAllPokemon()
const pokemonMap = new Map(pokemon.map(p => [p.id, p]))
const pokedexes = getPokedexes()
const dataPath = path.resolve(path.join(__dirname, '..', '..', '..', 'assets', 'data'))

console.log('dataPath', dataPath)

const newDexes: Pokedex[] = []

type IndividualEntry = { id: string; dexNum: number | null; forms: string[] }

for (const dex of pokedexes) {
  if (dex.entries && dex.entries.length > 0) {
    newDexes.push({
      ...dex,
      isUnofficial: dex.isUnofficial ?? false,
      entries: dex.baseDex !== null ? [] : dex.entries,
    })
    continue
  }
  const individualDexFile = path.join(dataPath, 'pokedexes', `${dex.id}.json`)
  let individualEntries: Array<IndividualEntry> = []

  if (fs.existsSync(individualDexFile)) {
    individualEntries = readFileAsJson(individualDexFile)
  } else {
    // newDexes.push({
    //   ...dex,
    //   isUnofficial: dex.isUnofficial ?? false,
    //   entries: dex.baseDex !== null ? [] : dex.entries,
    // })
    // continue
    individualEntries = pokemon
      .filter(p => {
        return p.generation <= dex.generation
      })
      .map(p => {
        return {
          id: p.id,
          dexNum: 0,
          forms: [],
        }
      })
  }

  const entries: Array<PokedexEntry> = individualEntries.flatMap(entry => {
    const results: Array<PokedexEntry> = []
    const pkm = pokemonMap.get(entry.id)
    if (!pkm) {
      throw new Error(`Could not find pokemon ${entry.id}`)
    }

    results.push({
      id: entry.id,
      dexNum: entry.dexNum ?? undefined,
      isForm: pkm.isForm,
    })

    for (const form of entry.forms) {
      if (form === entry.id) {
        continue
      }

      const formPkm = pokemonMap.get(form)
      if (!formPkm) {
        throw new Error(`Could not find pokemon form ${form}`)
      }

      results.push({
        id: form,
        dexNum: entry.dexNum ?? undefined,
        isForm: formPkm.isForm,
      })
    }

    return results
  })

  newDexes.push({
    ...dex,
    isUnofficial: dex.isUnofficial ?? false,
    entries,
  })
}

writeFileAsJson(path.join(dataPath, 'pokedexes.json'), newDexes)
