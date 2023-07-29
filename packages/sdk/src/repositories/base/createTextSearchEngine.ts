import { KVStore } from '../..'
import { Entity, RepositoryTextSearchEngine } from './types'

function buildCacheKey(repoId: string) {
  return `sdk.textSearchEngine_index::${repoId}`
}

export function createTextSearchEngine<R extends Entity>(
  kv: KVStore,
  repoId: string,
  tokenSeparator = ':'
): RepositoryTextSearchEngine<R> {
  return {
    async isIndexed() {
      const key = buildCacheKey(repoId)

      return kv.has(key)
    },
    async index(entities, tokens) {
      const index = new Map<string, string>()
      const sep = tokenSeparator

      for (const item of entities) {
        if (index.has(item.id)) {
          throw new Error(`The index already has the item with key: ${item.id}`)
        }

        let fullText = ''

        for (const [prop, propValueFn] of tokens) {
          const propName = prop as string

          let propValues = propValueFn(item)
          if (!propValues) {
            continue
          }
          if (!Array.isArray(propValues)) {
            propValues = [propValues]
          }

          // support many values
          for (let propValue of propValues) {
            if (typeof propValue === 'number') {
              propValue = String(propValue)
            }
            if (typeof propValue !== 'string' || propValue === '') {
              continue
            }
            const minifiedValue = propValue.replace(/\s/g, '')
            fullText = `${fullText} ${propName}${sep}${propValue}`
            if (propValue !== minifiedValue) {
              fullText = `${fullText} ${propName}${sep}${minifiedValue}`
            }
          }
        }

        fullText = fullText.trim().toLowerCase()

        if (fullText !== '') {
          index.set(item.id, fullText)
        }
      }

      const key = buildCacheKey(repoId)
      kv.set(key, index)
    },
    async search(text) {
      const key = buildCacheKey(repoId)
      const index = kv.get<Map<string, string>>(key)

      if (!index) {
        throw new Error(`The text search index for repository: ${repoId} was not found`)
      }

      if (!text || text === '' || text === '*') {
        return new Set(index.keys())
      }
      const hits: Set<string> = new Set()
      const sanitizedText = text.replace(/\s+/g, ' ').trim().toLowerCase()
      if (sanitizedText === '') {
        return hits
      }
      const tokens = sanitizedText.split(' ')

      return new Set(
        Array.from(index)
          .filter(entry => {
            return tokens.some(token => {
              if (token.startsWith('!')) {
                const negatedToken = token.slice(1)

                return negatedToken.length > 0 && !entry[1].includes(negatedToken)
              }

              return entry[1].includes(token)
            })
          })
          .map(entry => entry[0])
      )
    },
    async searchWith(entities, text) {
      if (!text || text === '' || text === '*') {
        return entities
      }
      const hits = await this.search(text)

      if (hits.size === 0) {
        return []
      }

      return entities.filter(item => hits.has(item.id))
    },
  }
}
