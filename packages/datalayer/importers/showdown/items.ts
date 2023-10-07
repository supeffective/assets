import { Dex, type Item as DexItem } from '@pkmn/dex'
import { z } from 'zod'

import {
  getDataPath,
  readFileAsJson,
  writeFileAsJson,
  type DataOverrideDefinition,
} from '../../datafs'
import { itemSchema, type Item, type ItemCategory } from '../../schemas/items'

function getItemCategory(item: DexItem): ItemCategory {
  if (item.isBerry) {
    return 'berry'
  }
  if (item.isGem || item.isChoice) {
    return 'holdable'
  }
  if (item.isPokeball) {
    return 'ball'
  }

  return 'other'
}
export const importShowdownItems = function (): void {
  const overrides = readFileAsJson<DataOverrideDefinition>(getDataPath('overrides/items.json'))
  const outFile = getDataPath('items.json')
  const transformedRows: Item[] = []

  const rawRows = Array.from(Dex.items.all())

  const rawRowsSorted = rawRows
    .filter(row => Number(row.num) > 0)
    .sort(function (a, b) {
      return Number(a.num) - Number(b.num)
    })

  rawRowsSorted.forEach(row => {
    const num: number | undefined = row.num

    if (num === undefined || isNaN(num) || num <= 0) {
      return
    }

    if (overrides.exclude.includes(row.id)) {
      return
    }

    const record: Item = {
      id: row.id,
      name: row.name,
      psName: row.name,
      generation: row.gen,
      desc: row.desc.length > 0 ? row.desc : null,
      shortDesc: row.shortDesc,
      category: getItemCategory(row),
    }

    itemSchema
      .extend({
        id: z.string(),
      })
      .parse(record)

    transformedRows.push(record)
  })

  writeFileAsJson(outFile, transformedRows)
}
