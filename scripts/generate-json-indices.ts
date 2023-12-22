import fs from 'node:fs'
import path from 'node:path'

import { globSync } from 'glob'

function getFiles(pattern: string): string[] {
  const basePath = path.resolve(import.meta.dir, '..', 'assets/images')
  return globSync(path.resolve(basePath, pattern), {
    cwd: basePath,
    absolute: false,
  })
}

const characters = getFiles('characters/masters-icons/*.png')
const gameSymbols = getFiles('games/symbols/*.png')
const gameAvatars = getFiles('games/avatars/*.png')
const gameTiles = getFiles('games/tiles/*.jpg')
const gameLogos = getFiles('games/logos/*.png')
const items = getFiles('items/gen9-style/**/*.png')
const marks = getFiles('marks/gen9-style/*.png')
const ribbons = getFiles('ribbons/gen9-style/*.png')
const originMarks = getFiles('originmarks/*.png')
const pokemon = getFiles('pokemon/home3d-icon-bordered/regular/*.png')
const pokemonShiny = getFiles('pokemon/home3d-icon-bordered/shiny/*.png')

const destDir = path.resolve(import.meta.dir, '..', 'assets/images-index')
const fileLists = {
  characters,
  gameSymbols,
  gameAvatars,
  gameTiles,
  gameLogos,
  items,
  marks,
  ribbons,
  originMarks,
  pokemon,
  pokemonShiny,
}

for (const [filename, fileList] of Object.entries(fileLists)) {
  const data = fileList.map((filePath) => {
    const basename = path.basename(filePath)
    return {
      id: basename.split('.')[0],
      path: filePath,
    }
  })
  // detect duplicate ids:
  const idCounts = data.reduce(
    (acc, { id }) => {
      acc[id] = (acc[id] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  for (const [id, count] of Object.entries(idCounts)) {
    if (count > 1) {
      throw new Error(`duplicate id: ${id} in ${filename}`)
    }
  }
  fs.writeFileSync(path.resolve(destDir, `${filename}.json`), JSON.stringify(data, null, 2))
  fs.writeFileSync(path.resolve(destDir, `${filename}.min.json`), JSON.stringify(data))
}

// for (const [filename, fileList] of Object.entries(recursiveDirLists)) {
//   const data = fileList.map((filePath) => {
//     const subdirSlug = path.dirname(filePath).replace('/', '-')
//     const basename = path.basename(filePath)
//     return {
//       id: `${subdirSlug}-${basename.split('.')[0]}`,
//       path: filePath,
//     }
//   })

//   fs.writeFileSync(path.resolve(destDir, `${filename}.json`), JSON.stringify(data, null, 2))
//   fs.writeFileSync(path.resolve(destDir, `${filename}.min.json`), JSON.stringify(data))
// }
