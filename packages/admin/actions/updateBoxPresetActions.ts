'use server'

import { getDataPath, writeDataFileAsJson } from '@pkg/datalayer/datafs'
import { getBoxPresetsAsRecords, unflattenBoxes } from '@pkg/datalayer/repositories/box-presets'
import { getGameSet } from '@pkg/datalayer/repositories/gamesets'
import { BoxPresetBox, boxPresetSchema } from '@pkg/datalayer/schemas/box-presets'

export async function updateBoxPresetAction(
  gameSetId: string,
  presetId: string,
  pokes: Array<string | null>
): Promise<void> {
  const gameSet = getGameSet(gameSetId)
  if (!gameSet) {
    throw new Error(`No game set found ${gameSetId}`)
  }

  const presets = getBoxPresetsAsRecords()
  const gamePresets = presets[gameSetId]
  if (!gamePresets) {
    throw new Error(`No presets found for game set ${gameSetId}`)
  }

  const preset = gamePresets[presetId]
  if (!preset) {
    throw new Error(`No preset found for game set ${gameSetId} and id ${presetId}`)
  }

  const newPreset = unflattenBoxes(gameSet, preset, pokes)

  if (newPreset.boxes.length > gameSet.storage.boxes) {
    throw new Error(`Too many boxes for preset ${gameSetId}.${presetId}: ${newPreset.boxes.length}`)
  }

  const validation = boxPresetSchema.safeParse(newPreset)

  if (!validation.success) {
    throw new Error(
      validation.error.issues.map(issue => `[${issue.path}]: ${issue.message}`).join(',\n')
    )
  }

  presets[gameSetId][presetId] = newPreset

  const dataFile = getDataPath('legacy/box-presets.json')

  writeDataFileAsJson(dataFile, presets)
}

export async function updateBoxPresetBoxAction(
  gameSetId: string,
  presetId: string,
  box: BoxPresetBox,
  boxIndex: number
): Promise<void> {
  const presets = getBoxPresetsAsRecords()
  const gamePresets = presets[gameSetId]
  if (!gamePresets) {
    throw new Error(`No presets found for game set ${gameSetId}`)
  }

  const preset = gamePresets[presetId]
  if (!preset) {
    throw new Error(`No preset found for game set ${gameSetId} and id ${presetId}`)
  }

  while (boxIndex > preset.boxes.length - 1) {
    preset.boxes.push({
      pokemon: [],
    })
  }

  preset.boxes[boxIndex] = box

  const validation = boxPresetSchema.safeParse(preset)

  if (!validation.success) {
    throw new Error(
      validation.error.issues.map(issue => `[${issue.path}]: ${issue.message}`).join(',\n')
    )
  }

  presets[gameSetId][presetId] = preset

  const dataFile = getDataPath('legacy/box-presets.json')

  writeDataFileAsJson(dataFile, presets)
}
