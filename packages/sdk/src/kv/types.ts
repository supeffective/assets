/* eslint-disable @typescript-eslint/no-explicit-any */

export interface KVStoreEntry<V = any> {
  value: V
  expiresAt?: number
}

export interface KVStore {
  /**
   * Retrieves the value associated with the given key from the store.
   * @param key The key whose value should be retrieved.
   * @returns The value associated with the given key or undefined if not found or expired.
   */
  get<V = any>(key: string): V | undefined

  /**
   * Sets a key-value pair in the store with an optional expiration time.
   * @param key The key for the store entry.
   * @param value The value to be stored.
   * @param ttl Optional time-to-live in milliseconds. If provided, the entry will expire after this time.
   */
  set(key: string, value: any, ttl?: number): void

  /**
   * Removes the entry with the given key from the store.
   * @param key The key of the entry to be removed.
   * @returns true if the entry was removed, false if the key was not found.
   */
  remove(key: string): boolean

  /**
   * Checks whether a not expired entry with the given key exists in the store.
   * @param key The key to check for existence.
   * @returns true if the key exists in the store, false otherwise.
   */
  has(key: string): boolean

  /**
   * Clears all entries from the store.
   */
  clear(): void
}
