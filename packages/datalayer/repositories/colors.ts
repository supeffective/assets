import _records from '@pkg/assets/data/colors.json'

import type { Color } from '../schemas/colors'

export function getColors(): Color[] {
  return _records
}
