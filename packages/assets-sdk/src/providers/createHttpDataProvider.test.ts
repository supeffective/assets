import { createHttpDataProvider } from './createHttpDataProvider'

describe('createHttpDriver', () => {
  const assetsUrl = 'https://example.com/assets'
  const httpDriver = createHttpDataProvider(assetsUrl)

  test('should return an object with id, baseUri, resolveUri, and readFile functions', () => {
    expect(httpDriver).toBeDefined()
    expect(httpDriver).toHaveProperty('id', 'http')
    expect(httpDriver).toHaveProperty('baseUri', assetsUrl)
    expect(httpDriver.resolveUri).toBeInstanceOf(Function)
    expect(httpDriver.readFile).toBeInstanceOf(Function)
  })

  test('resolveUri should return the correct URL', () => {
    const relativePath = '/test/file.json'
    const expectedUri = `${assetsUrl}/test/file.json`

    expect(httpDriver.resolveUri(relativePath)).toBe(expectedUri)
  })

  test('resolveUri should handle relativePath without leading slash', () => {
    const relativePath = 'test/file.json'
    const expectedUri = `${assetsUrl}/test/file.json`

    expect(httpDriver.resolveUri(relativePath)).toBe(expectedUri)
  })

  test('readFile should fetch data and return parsed JSON', async () => {
    const relativePath = '/test/file.json'
    const data = { key: 'value' }

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      url: `${assetsUrl}${relativePath}`,
      text: () => JSON.stringify(data),
    })

    const result = await httpDriver.readFile(relativePath)

    expect(result).toEqual(data)
    expect(global.fetch).toHaveBeenCalledWith(`${assetsUrl}${relativePath}`)
  })

  test('readFile should throw an error on HTTP error', async () => {
    const relativePath = '/test/file.json'

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      url: `${assetsUrl}${relativePath}`,
    })

    await expect(httpDriver.readFile(relativePath)).rejects.toThrow(
      `HTTP error 404 on GET ${assetsUrl}${relativePath}`,
    )
    expect(global.fetch).toHaveBeenCalledWith(`${assetsUrl}${relativePath}`)
  })
})
