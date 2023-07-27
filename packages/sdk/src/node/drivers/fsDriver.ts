import { readFile as nodeReadFile, writeFile as nodeWriteFile } from 'node:fs/promises'
import { join as pathJoin } from 'node:path'

import type { MutableRepositoryDriver } from '../../repositories'

export function createFsDriver(assetsPath: string): MutableRepositoryDriver {
  return {
    id: 'fs',
    baseUri: assetsPath,
    resolveUri(relativePath) {
      return pathJoin(assetsPath, relativePath)
    },
    async readFile(relativePath) {
      const data = await nodeReadFile(pathJoin(assetsPath, relativePath), 'utf-8')

      return JSON.parse(data)
    },
    writeFile(relativePath, data) {
      return nodeWriteFile(pathJoin(assetsPath, relativePath), JSON.stringify(data))
    },
  }
}
