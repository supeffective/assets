import _records from '@pkg/assets/data/gamesets.json'

import { GameSet } from '../schemas/gamesets'

export const SWITCH_GAMESET_IDS = ['lgpe', 'swsh', 'bdsp', 'la', 'sv']

export function getGameSets(): GameSet[] {
  return _records
}

export function getManyGameSets(ids: string[]): GameSet[] {
  return _records.filter(record => ids.includes(record.id))
}

export function getGameSet(id: string): GameSet | undefined {
  return _records.find(record => record.id === id)
}
