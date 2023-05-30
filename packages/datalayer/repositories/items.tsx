import _records from '@pkg/assets/data/items.json'

import { Item } from '../schemas/items'

export function getItems(): Item[] {
  return _records as Item[]
}
