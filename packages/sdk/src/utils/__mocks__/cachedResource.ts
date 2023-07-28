export const cachedResult = jest.fn().mockImplementation((ttl, hydrator) => {
  return async () => {
    return await hydrator()
  }
})
