export function cachedResult<T>(ttl: number, hydrator: () => Promise<T>): () => Promise<T> {
  const ttlMs = ttl * 1000

  let resource: T
  let timestamp: number
  let hydratorPromiseLock: Promise<T> | undefined
  let hydrated = false

  const hydrate = async () => {
    resource = await hydrator()
    hydrated = true
    timestamp = Date.now()
    hydratorPromiseLock = undefined

    return resource
  }

  return async () => {
    if (ttlMs === 0) {
      return await hydrator()
    }

    const dateDiff = Date.now() - (timestamp || 0)

    if (hydrated && ttlMs > dateDiff) {
      return resource
    }

    if (!hydratorPromiseLock) {
      hydratorPromiseLock = hydrate()
    }

    return hydratorPromiseLock
  }
}
