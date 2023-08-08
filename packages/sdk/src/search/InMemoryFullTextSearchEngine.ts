import { FullTextSearchEngine } from './types'

export class InMemoryFullTextSearchEngine implements FullTextSearchEngine {
  private _entries: Map<string, string> = new Map()

  constructor(entries: Array<[string, string]> = []) {
    this._entries = new Map(entries)
  }

  index(id: string, text: string): void {
    this._entries.set(id, text)
  }

  clear: () => void = () => {
    this._entries.clear()
  }

  size: () => number = () => {
    return this._entries.size
  }

  entries: () => [string, string][] = () => {
    return Array.from(this._entries.entries())
  }

  search: (text: string, limit?: number | undefined) => string[] = (
    text: string,
    limit?: number | undefined
  ) => {
    const results: string[] = []
    const entries = this._entries

    for (const [id, entry] of entries) {
      if (entry.includes(text)) {
        results.push(id)
      }

      if (limit && results.length >= limit) {
        break
      }
    }

    return results
  }
}
