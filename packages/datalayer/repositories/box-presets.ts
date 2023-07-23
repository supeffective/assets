import { z } from 'zod'

import _records from '@pkg/assets/data/legacy/box-presets.json'

import {
  BoxPreset,
  BoxPresetBoxPokemon,
  BoxPresetMap,
  boxPresetMapSchema,
  BoxPresetRecord,
} from '../schemas/box-presets'
import { GameSet } from '../schemas/gamesets'
import { Pokemon } from '../schemas/pokemon'

const recordsMap = new Map(
  Object.entries(_records).map(([gameSet, presetsObject]) => {
    return [gameSet, new Map(Object.entries(presetsObject))]
  })
)

export function getBoxPresetsAsRecords(): BoxPresetRecord {
  return _records
}

export function getBoxPresets(): BoxPresetMap {
  return recordsMap
}

export function getBoxPresetsByGameSet(gameSet: string): BoxPreset[] {
  const records = getBoxPresets()
  const presets = records.get(gameSet)

  if (!presets) {
    throw new Error(`No presets found for game set ${gameSet}`)
  }

  return Array.from(presets.values())
}

export function getBoxPresetsByGameSetAndId(gameSet: string, presetId: string): BoxPreset {
  const records = getBoxPresets()
  const presets = records.get(gameSet)

  if (!presets) {
    throw new Error(`No presets found for game set ${gameSet}`)
  }

  const preset = presets.get(presetId)
  if (!preset) {
    throw new Error(`No preset found for game set ${gameSet} and id ${presetId}`)
  }

  return preset
}

export function validateBoxPresets() {
  const records = getBoxPresets()

  return z.array(boxPresetMapSchema).safeParse(records)
}

export function flattenBoxes(preset: BoxPreset): Array<string | null> {
  return preset.boxes.reduce(
    (acc, box) => {
      return [...acc, ...box.pokemon.map(pkm => parseBoxPokemonID(pkm))]
    },
    [] as Array<string | null>
  )
}

export function unflattenBoxesPokemon(
  gameSet: GameSet,
  preset: BoxPreset,
  flattened: Array<Pokemon | null>
): BoxPreset {
  const asIds = flattened.map(pkm => (pkm ? pkm.id : null))

  return unflattenBoxes(gameSet, preset, asIds)
}

export function unflattenBoxes(
  gameSet: GameSet,
  preset: BoxPreset,
  flattened: Array<string | null>
): BoxPreset {
  const boxes: BoxPreset['boxes'] = []
  const trimmed = trimBoxNullsAtTheEnd(flattened)

  while (trimmed.length) {
    const boxTitle = preset.boxes[boxes.length]?.title ?? null
    const boxTitleObj = boxTitle ? { title: boxTitle } : {}
    boxes.push({ ...boxTitleObj, pokemon: trimmed.splice(0, gameSet.storage.boxCapacity) })
  }

  return {
    ...preset,
    boxes,
  }
}

export function trimBoxNullsAtTheEnd<T = any>(arr: Array<T | null>): Array<T | null> {
  while (arr[arr.length - 1] === null) {
    arr.pop()
  }

  return arr
}

export function parseBoxPokemonID(pkm: BoxPresetBoxPokemon): string | null {
  if (typeof pkm === 'string') {
    return pkm
  }

  if (pkm === undefined || pkm === null) {
    return null
  }

  if (pkm.pid.endsWith('-f')) {
    return pkm.gmax ? `${pkm.pid.slice(0, -2)}-gmax` : pkm.pid
  }

  return pkm.gmax ? `${pkm.pid}-gmax` : pkm.pid
}
