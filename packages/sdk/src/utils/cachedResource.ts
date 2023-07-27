export function cachedResult<T>(ttl: number, hydrator: () => Promise<T>): () => Promise<T> {
  const ttlMs = ttl * 1000

  let resource: T | undefined
  let timestamp: number | undefined

  return async () => {
    if (ttlMs === 0) {
      return await hydrator()
    }

    if (resource && timestamp && Date.now() - timestamp < ttlMs) {
      return resource
    }

    resource = await hydrator()
    timestamp = Date.now()

    return resource
  }
}
