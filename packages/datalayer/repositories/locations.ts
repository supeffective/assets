import _records from '@pkg/assets/data/locations.json'

import type { Location } from '../schemas/locations'

export function getLocations(): Location[] {
  return _records as Location[]
}
