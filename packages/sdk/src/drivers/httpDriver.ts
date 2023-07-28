import { kv } from '..'
import type { RepositoryDriver } from '../repositories'

function buildCacheKey(uri: string) {
  return `sdk.httpDriver::${uri}`
}

export function createHttpDriver(assetsUrl: string): RepositoryDriver {
  return {
    id: 'http',
    baseUri: assetsUrl,
    resolveUri(relativePath) {
      return `${assetsUrl}/${relativePath.replace(/^\//, '')}`
    },
    async readFile(relativePath, cacheTtl) {
      const uri = this.resolveUri(relativePath)
      const key = buildCacheKey(uri)
      if (cacheTtl && kv.has(key)) {
        return kv.get(key)
      }

      const data = await fetch(this.resolveUri(relativePath)).then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status} on GET ${res.url}`)
        }

        return res.text()
      })

      const parsedData = JSON.parse(data)

      if (cacheTtl) {
        kv.set(key, parsedData, cacheTtl)
      }

      return parsedData
    },
    async clearCache(relativePath) {
      const key = buildCacheKey(relativePath)
      kv.remove(key)
    },
  }
}
