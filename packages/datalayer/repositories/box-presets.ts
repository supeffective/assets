import { z } from 'zod'

import _records from '@pkg/assets/data/legacy/box-presets.json'

import { BoxPreset, BoxPresetMap, boxPresetMapSchema } from '../schemas/box-presets'

const recordsMap = new Map(
  Object.entries(_records).map(([gameSet, presetsObject]) => {
    return [gameSet, new Map(Object.entries(presetsObject))]
  })
)

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
