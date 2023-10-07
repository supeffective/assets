import _records from '@pkg/assets/data/gamesupersets.json'

import type { GameSuperSet } from '../schemas/gamesupersets'

export function getGameSuperSets(): GameSuperSet[] {
  return _records as GameSuperSet[]
}
