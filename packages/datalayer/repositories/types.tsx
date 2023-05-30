import _records from '@pkg/assets/data/types.json'

import { PokeType } from '../schemas/types'

export function getTypes(): PokeType[] {
  return _records
}
