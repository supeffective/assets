import { parseFormData } from '@pkg/utils/lib/serialization/forms'
import { softMerge } from '@pkg/utils/lib/serialization/merge'

import { getDataPath, writeFileAsJson } from '../../datafs'
import { CompactPokemon, LegacyPokemon, Pokemon, pokemonSchema } from '../../schemas/pokemon'
import {
  getAllPokemonMappedById,
  getPokemon,
  getPokemonOrFail,
  PokemonMap,
  UpdatePokemon,
  validatePokemon,
} from '../pokemon'

export function updateManyPokemon(batch: UpdatePokemon[]): PokemonMap {
  const dataFile = getDataPath('pokemon.json')
  const allPkm = getAllPokemonMappedById()

  for (const data of batch) {
    const isUpdate = allPkm.has(data.id)
    const id = data.id
    const pkm = isUpdate ? getPokemonOrFail(id) : getPokemon(id)
    const newPkm = softMerge<Pokemon>(
      (pkm || {
        evolvesFrom: null,
      }) as Pokemon,
      data,
    )
    const validation = validatePokemon(newPkm)

    if (!validation.success) {
      throw new Error(
        validation.error.issues.map(issue => `[${issue.path}]: ${issue.message}`).join(',\n'),
      )
    }
    allPkm.set(id, newPkm)
  }

  const allPkmValues = Array.from(allPkm.values())

  writeFileAsJson(dataFile, allPkmValues)
  updateLegacyPokemonFile(allPkmValues)
  updateCompactPokemonFile(allPkmValues)

  return allPkm
}

export function updatePokemon(data: UpdatePokemon): Pokemon {
  const result = updateManyPokemon([data])

  return result.get(data.id)!
}

export function updatePokemonFromFormData(formData: FormData): Pokemon {
  const partial = parseFormData(formData, pokemonSchema.partial())
  if (!partial.id) {
    throw new Error('Missing id field')
  }

  return updatePokemon(partial as UpdatePokemon)
}

function updateCompactPokemonFile(data: Pokemon[]): void {
  const dataFile = getDataPath('pokemon-compact.json')
  const result: CompactPokemon[] = []

  for (const pkm of data) {
    const cPkm: CompactPokemon = {
      id: pkm.id,
      nid: pkm.nid,
      dexNum: pkm.dexNum,
      formId: pkm.formId,
      name: pkm.name,
      formName: pkm.formName,
      region: pkm.region,
      generation: pkm.generation,
      type1: pkm.type1,
      type2: pkm.type2,
      color: pkm.color,
      isDefault: pkm.isDefault,
      isForm: pkm.isForm,
      isSpecialAbilityForm: pkm.isSpecialAbilityForm,
      isCosmeticForm: pkm.isCosmeticForm,
      isFemaleForm: pkm.isFemaleForm,
      storableIn: pkm.storableIn,
      baseSpecies: pkm.baseSpecies,
    }
    result.push(cPkm)
  }

  writeFileAsJson(dataFile, result)
}

function updateLegacyPokemonFile(data: Pokemon[]): void {
  const dataFile = getDataPath('legacy/pokemon.json')
  const result: LegacyPokemon[] = []

  for (const pkm of data) {
    const legacyPkm: LegacyPokemon = {
      id: pkm.id,
      nid: pkm.nid,
      dexNum: pkm.dexNum,
      formId: pkm.formId,
      name: pkm.name,
      formName: pkm.formName,
      region: pkm.region,
      generation: pkm.generation,
      type1: pkm.type1,
      type2: pkm.type2,
      color: pkm.color,
      isDefault: pkm.isDefault,
      isForm: pkm.isForm,
      isSpecialAbilityForm: pkm.isSpecialAbilityForm,
      isCosmeticForm: pkm.isCosmeticForm,
      isFemaleForm: pkm.isFemaleForm,
      hasGenderDifferences: pkm.hasGenderDifferences,
      isBattleOnlyForm: pkm.isBattleOnlyForm,
      isSwitchableForm: pkm.isSwitchableForm,
      isMega: pkm.isMega,
      isPrimal: pkm.isPrimal,
      isGmax: pkm.isGmax,
      canGmax: pkm.canGmax,
      canDynamax: pkm.canDynamax,
      canBeAlpha: pkm.canBeAlpha,
      debutIn: pkm.debutIn,
      obtainableIn: pkm.obtainableIn,
      versionExclusiveIn: pkm.versionExclusiveIn,
      eventOnlyIn: pkm.eventOnlyIn,
      storableIn: pkm.storableIn,
      shinyReleased: pkm.shinyReleased,
      shinyBase: pkm.shinyBase,
      baseSpecies: pkm.baseSpecies,
      forms: pkm.isForm ? null : pkm.forms,
      refs: {
        serebii: pkm.refs?.serebii || pkm.id,
        bulbapedia: pkm.refs?.bulbapedia || pkm.name,
        smogon: pkm.refs?.smogon || pkm.id,
        showdown: pkm.psName || pkm.name,
      },
    }
    result.push(legacyPkm)
  }

  writeFileAsJson(dataFile, result)
}
