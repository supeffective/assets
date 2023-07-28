import { cachedResult } from './cachedResource'

const mockHydrator = jest.fn().mockResolvedValue('Mocked data')

describe('cachedResult', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('should return a function that caches the result for the specified TTL', async () => {
    const ttl = 5
    const cachedHydrator = cachedResult(ttl, mockHydrator)

    await cachedHydrator()
    await cachedHydrator()

    expect(mockHydrator).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(ttl * 1000 + 100)

    const result = await cachedHydrator()
    expect(result).toEqual('Mocked data')
    expect(mockHydrator).toHaveBeenCalledTimes(2)
  })

  test('should always invoke hydrator if TTL is set to 0', async () => {
    const cachedHydrator = cachedResult(0, mockHydrator)

    await cachedHydrator()
    await cachedHydrator()
    await cachedHydrator()

    expect(mockHydrator).toHaveBeenCalledTimes(3)
  })

  test('should correctly handle concurrent calls within the TTL period', async () => {
    const ttl = 3
    const cachedHydrator = cachedResult(ttl, mockHydrator)

    const promises = [cachedHydrator(), cachedHydrator(), cachedHydrator()]
    await Promise.all(promises)

    expect(mockHydrator).toHaveBeenCalledTimes(1)
  })

  test('should correctly handle concurrent calls after the TTL period', async () => {
    const ttl = 5
    const cachedHydrator = cachedResult(ttl, mockHydrator)

    const promises = [cachedHydrator(), cachedHydrator()]
    expect(mockHydrator).toHaveBeenCalledTimes(1)

    await Promise.all(promises)

    jest.advanceTimersByTime(ttl * 1000 + 100)

    const promisesAfterTTL = [cachedHydrator(), cachedHydrator(), cachedHydrator()]
    await Promise.all(promisesAfterTTL)

    expect(mockHydrator).toHaveBeenCalledTimes(2)
  })
})
