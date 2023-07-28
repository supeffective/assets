import type { RepositoryDriver } from '../repositories'

export function createHttpDriver(assetsUrl: string): RepositoryDriver {
  return {
    id: 'http',
    baseUri: assetsUrl,
    resolveUri(relativePath) {
      return `${assetsUrl}/${relativePath.replace(/^\//, '')}`
    },
    async readFile(relativePath, cacheTtl) {
      const data = await fetch(this.resolveUri(relativePath)).then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status} on GET ${res.url}`)
        }

        return res.text()
      })

      return JSON.parse(data)
    },
  }
}
