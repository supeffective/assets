import { readFile as nodeReadFile, writeFile as nodeWriteFile } from 'node:fs/promises'
import { join as pathJoin } from 'node:path'
import { type MutableRepositoryDriver } from '@supereffectivegg/assets-sdk'

export function createFsDriver(assetsPath: string): MutableRepositoryDriver {
  return {
    id: 'fs',
    baseUri: assetsPath,
    resolveUri(relativePath) {
      return pathJoin(assetsPath, relativePath)
    },
    async readFile(relativePath, cacheTtl) {
      // const fetchData = cachedResult(cacheTtl ?? 0, async () => {
      //   const data = await nodeReadFile(pathJoin(assetsPath, relativePath), 'utf-8')

      //   cache.set(relativePath, data)

      //   return data
      // })

      const data = await nodeReadFile(pathJoin(assetsPath, relativePath), 'utf-8')

      return JSON.parse(data)
    },
    writeFile(relativePath, data) {
      return nodeWriteFile(pathJoin(assetsPath, relativePath), JSON.stringify(data))
    },
  }
}
