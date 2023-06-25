import fs from 'node:fs'
import path from 'node:path'

import { assurePath, parseJsonFile } from '@pkg/utils'

const generateCode = function (srcFile: string, singularName: string, baseOutPath: string): void {
  const data = parseJsonFile<any>(srcFile) as Record<string, any>[]
  const constantValues = Array.from(data.map(item => item.id))

  const capitalizedName = singularName.charAt(0).toUpperCase() + singularName.slice(1)
  const outPath = path.join(baseOutPath, capitalizedName)

  const code = `// autogenerated by supereffective-assets/generator-cli
export const ${singularName}Ids = ${JSON.stringify(constantValues, undefined, 2)} as const

export type ${capitalizedName}ID = (typeof ${singularName}Ids)[number]
`
  //   const indexCode = `import ${singularName}CollectionJsonSchema from './schema.json'

  // export * from './ids'
  // export * from './types'

  // export { ${singularName}CollectionJsonSchema }
  // `
  assurePath(outPath)

  fs.writeFileSync(path.join(outPath, 'ids.ts'), code)
  // fs.writeFileSync(path.join(outPath, 'index.ts'), indexCode)
}

export const generateConstantFiles = function (dataDir: string, outputCodeDir: string): void {
  const dataPath = path.join(path.resolve(dataDir))
  const baseOutPath = path.resolve(outputCodeDir)

  generateCode(path.join(dataPath, 'abilities.json'), 'ability', baseOutPath)
  generateCode(path.join(dataPath, 'colors.json'), 'color', baseOutPath)
  generateCode(path.join(dataPath, 'gamesets.json'), 'gameSet', baseOutPath)
  // TODO: generate codes for individual games
  generateCode(path.join(dataPath, 'gamesupersets.json'), 'gameSuperSet', baseOutPath)
  generateCode(path.join(dataPath, 'items.json'), 'item', baseOutPath)
  generateCode(path.join(dataPath, 'languages.json'), 'language', baseOutPath)
  generateCode(path.join(dataPath, 'locations.json'), 'location', baseOutPath)
  generateCode(path.join(dataPath, 'marks.json'), 'mark', baseOutPath)
  generateCode(path.join(dataPath, 'moves.json'), 'move', baseOutPath)
  generateCode(path.join(dataPath, 'natures.json'), 'nature', baseOutPath)
  generateCode(path.join(dataPath, 'originmarks.json'), 'originMark', baseOutPath)
  generateCode(path.join(dataPath, 'pokedexes.json'), 'pokedex', baseOutPath)
  generateCode(path.join(dataPath, 'pokemon.json'), 'pokemon', baseOutPath)
  generateCode(path.join(dataPath, 'regions.json'), 'region', baseOutPath)
  generateCode(path.join(dataPath, 'ribbons.json'), 'ribbon', baseOutPath)
  generateCode(path.join(dataPath, 'types.json'), 'type', baseOutPath)
}
