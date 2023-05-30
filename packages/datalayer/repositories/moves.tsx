import _records from '@pkg/assets/data/moves.json'

import { Move } from '../schemas/moves'

export function getMoves(): Move[] {
  return _records as Move[]
}
