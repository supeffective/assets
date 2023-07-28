import { kv } from '..'
import { InMemoryKVStore } from './inMemoryKVStore'

describe('InMemoryKVStore singleton (kv)', () => {
  it('should return the same instance', () => {
    const store1 = InMemoryKVStore.getInstance()
    const store2 = InMemoryKVStore.getInstance()

    expect(store1).toBe(store2)
  })

  it('should return the same instance as the one exported in index.ts', () => {
    const store = InMemoryKVStore.getInstance()

    expect(store).toBe(kv)
  })
})

describe('InMemoryKVStore', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    // Clear the cache before each test
    const store = InMemoryKVStore.getInstance()
    store.clear()
  })

  afterEach(() => {
    jest.clearAllTimers()
  })

  test('should set and get a value correctly', () => {
    const store = InMemoryKVStore.getInstance()

    // Set a value with a key
    store.set('key1', 'value1')

    // Get the value by key
    const result = store.get<string>('key1')

    expect(result).toBe('value1')
  })

  test('should return undefined if key does not exist', () => {
    const store = InMemoryKVStore.getInstance()

    // Try to get a value with a non-existing key
    const result = store.get<string>('nonExistingKey')

    expect(result).toBeUndefined()
  })

  test('should return undefined if value has expired', async () => {
    const store = InMemoryKVStore.getInstance()

    // Set a value with a 1-second TTL
    store.set('key2', 'value2', 1000)

    // Wait for the TTL to expire
    jest.advanceTimersByTime(1500)

    // Try to get the expired value
    const result = store.get<string>('key2')

    expect(result).toBeUndefined()
  })

  test('should remove a value correctly', () => {
    const store = InMemoryKVStore.getInstance()

    // Set a value with a key
    store.set('key3', 'value3')

    // Remove the value by key
    const removed = store.remove('key3')

    // Check if the value was removed successfully
    expect(removed).toBeTruthy()

    // Try to get the removed value
    const result = store.get<string>('key3')

    expect(result).toBeUndefined()
  })

  test('should return false for non-existing key when using has()', () => {
    const store = InMemoryKVStore.getInstance()

    // Check if a non-existing key exists in the cache
    const exists = store.has('nonExistingKey')

    expect(exists).toBeFalsy()
  })

  test('should return true for existing key when using has()', () => {
    const store = InMemoryKVStore.getInstance()

    // Set a value with a key
    store.set('key4', 'value4')

    // Check if the existing key exists in the cache
    const exists = store.has('key4')

    expect(exists).toBeTruthy()
  })

  test('should return false for existing key when using has() if the entry is expired', () => {
    const store = InMemoryKVStore.getInstance()

    // Set a value with a key
    store.set('key4', 'value4', 1000)

    jest.advanceTimersByTime(1500)

    // Check if the existing key exists in the cache
    const exists = store.has('key4')

    expect(exists).toBeFalsy()
  })

  test('should return true for existing key when using has() if the entry is not expired', () => {
    const store = InMemoryKVStore.getInstance()

    // Set a value with a key
    store.set('key4', 'value4', 1000)

    jest.advanceTimersByTime(500)

    // Check if the existing key exists in the cache
    const exists = store.has('key4')

    expect(exists).toBeTruthy()
  })

  test('should clear all entries from the cache', () => {
    const store = InMemoryKVStore.getInstance()

    // Set some values in the cache
    store.set('key5', 'value5')
    store.set('key6', 'value6')

    // Clear the cache
    store.clear()

    // Check if the cache is empty
    const result1 = store.get<string>('key5')
    const result2 = store.get<string>('key6')

    expect(result1).toBeUndefined()
    expect(result2).toBeUndefined()
  })
})
