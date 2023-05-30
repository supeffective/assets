import _records from '@pkg/assets/data/regions.json'

import { Region } from '../schemas/regions'

export function getRegions(): Region[] {
  return _records
}
