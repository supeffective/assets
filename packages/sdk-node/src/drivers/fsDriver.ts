import { readFile as nodeReadFile, writeFile as nodeWriteFile } from 'node:fs/promises'
import { join as pathJoin } from 'node:path'
import { KVStore, type MutableRepositoryStorageDriver } from '@supereffectivegg/assets-sdk'

function buildCacheKey(path: string) {
  return `sdk-node.fsDriver::${path}`
}

export function createFsDriver(kv: KVStore, assetsPath: string): MutableRepositoryStorageDriver {
  return {
    id: 'fs',
    baseUri: assetsPath,
    resolveUri(relativePath) {
      return pathJoin(assetsPath, relativePath)
    },
    async readFile(relativePath, cacheTtl) {
      const fullPath = this.resolveUri(relativePath)
      const key = buildCacheKey(fullPath)

      if (cacheTtl && kv.has(key)) {
        return kv.get(key)
      }

      const data = await nodeReadFile(pathJoin(assetsPath, relativePath), 'utf-8')
      const parsedData = JSON.parse(data)

      if (cacheTtl) {
        kv.set(key, parsedData, cacheTtl)
      }

      return parsedData
    },
    async writeFile(relativePath, data) {
      const fullPath = this.resolveUri(relativePath)
      await nodeWriteFile(fullPath, JSON.stringify(data))
      await this.clearCache(fullPath)
    },
    async clearCache(relativePath) {
      const key = buildCacheKey(relativePath)
      kv.remove(key)
    },
  }
}
