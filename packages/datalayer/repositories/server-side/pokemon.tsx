import { parseFormData } from '@pkg/utils/lib/serialization/forms'
import { softMerge } from '@pkg/utils/lib/serialization/merge'

import { getDataPath, writeDataFileAsJson } from '../../datafs'
import { Pokemon, pokemonSchema } from '../../schemas/pokemon'
import { getAllPokemonMappedById, getPokemonOrFail, validatePokemon } from '../pokemon'

export function updatePokemon(id: string, data: Partial<Pokemon>): Pokemon {
  const pkm = getPokemonOrFail(id)
  const newPkm = softMerge<Pokemon>(pkm, data)
  const validation = validatePokemon(newPkm)

  console.log('savePokemonEntry - merged', JSON.stringify(newPkm, null, 2))

  if (!validation.success) {
    throw new Error(
      validation.error.issues.map(issue => `[${issue.path}]: ${issue.message}`).join(',\n')
    )
  }

  const dataFile = getDataPath('pokemon.json')
  const allPkm = getAllPokemonMappedById()
  allPkm.set(id, newPkm)

  writeDataFileAsJson(dataFile, Array.from(allPkm.values()))

  return newPkm
}

export function updatePokemonFromFormData(formData: FormData): Pokemon {
  const partial = parseFormData(formData, pokemonSchema.partial())
  if (!partial.id) {
    throw new Error('Missing id field')
  }

  return updatePokemon(partial.id, partial)
}
