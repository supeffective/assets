/* eslint-disable @typescript-eslint/no-explicit-any */

import { KVStore, KVStoreEntry } from './types'

export class InMemoryKVStore implements KVStore {
  private cache: Map<string, KVStoreEntry>
  private static instance: InMemoryKVStore

  constructor() {
    this.cache = new Map<string, KVStoreEntry>()
  }

  static getInstance(): KVStore {
    if (!InMemoryKVStore.instance) {
      InMemoryKVStore.instance = new InMemoryKVStore()
    }

    return InMemoryKVStore.instance
  }

  public get<V = any>(key: string): V | undefined {
    if (this.has(key)) {
      return this.cache.get(key)?.value
    }

    return undefined
  }

  public set(key: string, value: any, ttl?: number): void {
    const expiresAt = ttl ? Date.now() + ttl : undefined
    this.cache.set(key, { value, expiresAt })

    if (ttl && ttl > 0) {
      setTimeout(() => this.cache.delete(key), ttl)
    }
  }

  public remove(key: string): boolean {
    return this.cache.delete(key)
  }

  public has(key: string): boolean {
    if (!this.cache.has(key)) {
      return false
    }

    const entry = this.cache.get(key)

    if (!entry?.expiresAt) {
      return true
    }

    return entry.expiresAt >= Date.now()
  }

  public clear(): void {
    this.cache.clear()
  }
}
