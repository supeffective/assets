import path from 'node:path'

import { getFilesByExtension, parseJsonFile, pathExists } from '@pkg/utils'

import { CmdParams, SpriteIndexItem } from '../types'

const filesToSpriteIndex = function (files: string[], ext: string): SpriteIndexItem[] {
  return files.map(f => ({
    path: path.resolve(f),
    classNames: [path.basename(f, ext)],
  }))
}

const dirToSpriteIndex = function (params: CmdParams): SpriteIndexItem[] {
  return filesToSpriteIndex(
    getFilesByExtension(params.srcDir, params.ext).map(f => path.join(params.srcDir, f)),
    params.ext,
  )
}

export const resolveSpriteIndex = function (params: CmdParams): SpriteIndexItem[] {
  const sorted: SpriteIndexItem[] = []

  sorted.push(...filesToSpriteIndex(params.prepend, params.ext))

  if (params.sorting !== undefined) {
    const sortingConfig = parseJsonFile<[string, string[]][]>(params.sorting)
    for (const def of sortingConfig) {
      sorted.push({
        path: path.resolve(path.join(params.srcDir, def[0] + params.ext)),
        classNames: def[1],
      })
    }
  } else {
    sorted.push(...dirToSpriteIndex(params))
  }

  sorted.push(...filesToSpriteIndex(params.append, params.ext))

  for (const item of sorted) {
    if (!pathExists(item.path)) {
      throw new Error(`[resolveSpriteIndex] File does not exist: ${item.path}`)
    }
  }

  return sorted
}
