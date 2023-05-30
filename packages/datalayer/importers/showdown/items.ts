import { Dex, Item as DexItem } from '@pkmn/dex'
import { z } from 'zod'

import { getDataPath, writeDataFileAsJson } from '../../datafs'
import { Item, ItemCategory, itemSchema } from '../../schemas/items'

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

  writeDataFileAsJson(outFile, transformedRows)
}
