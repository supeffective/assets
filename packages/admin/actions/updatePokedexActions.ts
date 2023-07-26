'use server'

import { getDataPath, writeFileAsJson } from '@pkg/datalayer/datafs'
import { getPokedexes } from '@pkg/datalayer/repositories/pokedexes'
import { PokedexEntry, pokedexSchema } from '@pkg/datalayer/schemas/pokedexes'

export async function updatePokedexAction(
  dexId: string,
  entries: Array<PokedexEntry>
): Promise<void> {
  const pokedexes = getPokedexes().map(dex => {
    if (dex.id === dexId) {
      return { ...dex, entries }
    }

    return { ...dex, entries: dex.entries ?? [] }
  })

  const dataFile = getDataPath('pokedexes.json')

  for (const dex of pokedexes) {
    const validation = pokedexSchema.safeParse(dex)

    if (!validation.success) {
      throw new Error(
        validation.error.issues.map(issue => `[${issue.path}]: ${issue.message}`).join(',\n')
      )
    }
  }

  writeFileAsJson(dataFile, pokedexes)
}
