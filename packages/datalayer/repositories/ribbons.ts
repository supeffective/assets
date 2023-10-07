import _records from '@pkg/assets/data/ribbons.json'

import type { Ribbon } from '../schemas/ribbons'

export function getRibbons(): Ribbon[] {
  return _records as Ribbon[]
}
