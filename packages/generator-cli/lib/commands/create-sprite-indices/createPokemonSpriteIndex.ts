import path from 'node:path'

import { parseJsonFile, saveJsonFile } from '@pkg/build-tools'

interface PkmRefs {
  homeSprite: string
  miniSprite: string
}

interface PkmRecord {
  id: string
  formId: string | null
  isForm: boolean
  refs: PkmRefs
}

export const createPokemonSpriteIndex = function (
  dataDir: string,
  buildDir: string,
  variant: keyof PkmRefs
): void {
  const srcJsonFile = path.join(path.resolve(dataDir), 'src', 'collections', 'pokemon.json')
  const destJsonFile = path.join(path.resolve(buildDir), `pokemon-sprites-${variant}.json`)

  const pokemon = parseJsonFile<{
    data: PkmRecord[]
  }>(srcJsonFile)

  const spriteMap = new Map<string, Set<string>>([])

  for (const pkm of pokemon.data) {
    if (!pkm.refs || !pkm.refs[variant]) {
      throw new Error(`pkm.refs.${variant} is undefined for ${pkm.id}`)
    }

    if (!spriteMap.has(pkm.refs[variant])) {
      spriteMap.set(pkm.refs[variant], new Set([]))
    }

    spriteMap.get(pkm.refs[variant])?.add(pkm.id)

    if (!pkm.isForm && pkm.formId !== null) {
      spriteMap.get(pkm.refs[variant])?.add(pkm.id + '-' + pkm.formId)
    }
  }

  saveJsonFile(
    destJsonFile,
    Array.from(spriteMap.entries()).map(([key, value]) => {
      return [key, Array.from(value)]
    })
  )
}
