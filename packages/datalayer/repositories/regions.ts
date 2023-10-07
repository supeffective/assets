import _records from '@pkg/assets/data/regions.json'

import type { Region } from '../schemas/regions'

export function getRegions(): Region[] {
  return _records
}
