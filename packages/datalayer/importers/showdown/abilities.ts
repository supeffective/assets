import { Dex } from '@pkmn/dex'
import { z } from 'zod'

import { getDataPath, writeDataFileAsJson } from '../../datafs'
import { Ability, abilitySchema } from '../../schemas/abilities'

export const importShowdownAbilities = function (): void {
  const outFile = getDataPath('abilities.json')
  const transformedRows: Ability[] = []

  const rawRows = Array.from(Dex.abilities.all())

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

    const record: Ability = {
      id: row.id,
      name: row.name,
      psName: row.name,
      generation: row.gen,
      desc: row.desc.length > 0 ? row.desc : null,
      shortDesc: row.shortDesc,
    }

    abilitySchema
      .extend({
        id: z.string(),
      })
      .parse(record)

    transformedRows.push(record)
  })

  writeDataFileAsJson(outFile, transformedRows)
}
