import _records from '@pkg/assets/data/items.json'

import type { Item } from '../schemas/items'

export function getItems(): Item[] {
  return _records as Item[]
}

export function getItemByNameOrFail(name: string): Item {
  const record = getItems().find(record => record.name === name)
  if (!record) {
    throw Error(`Item with name '${name}' not found`)
  }

  return record
}

export function getItemByShowdownNameOrFail(name: string): Item {
  const record = getItems().find(record => record.psName === name)
  if (!record) {
    throw Error(`Item with psName '${name}' not found`)
  }

  return record
}
