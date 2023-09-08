import type { RepositoryDataProvider } from '../core/types'

export function createHttpDataProvider(assetsUrl: string): RepositoryDataProvider {
  return {
    id: 'http',
    baseUri: assetsUrl,
    resolveUri(relativePath) {
      return `${assetsUrl}/${relativePath.replace(/^\//, '')}`
    },
    async readFile(relativePath) {
      const uri = this.resolveUri(relativePath)

      const data = await fetch(uri).then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status} on GET ${res.url}`)
        }

        return res.text()
      })

      const parsedData = JSON.parse(data)

      return parsedData
    },
  }
}
