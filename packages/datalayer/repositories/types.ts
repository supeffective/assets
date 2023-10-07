import _records from '@pkg/assets/data/types.json'

import type { PokeType } from '../schemas/types'

export function getTypes(): PokeType[] {
  return _records
}
