import { readFile as nodeReadFile, writeFile as nodeWriteFile } from 'node:fs/promises'
import { join as pathJoin } from 'node:path'

import { createFsDriver } from './fsDriver'

jest.mock('node:fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
}))

const mockReadFile = nodeReadFile as jest.MockedFunction<typeof nodeReadFile>
const mockWriteFile = nodeWriteFile as jest.MockedFunction<typeof nodeWriteFile>

jest.mock('node:path', () => ({
  join: jest.fn(),
}))

describe('createFsDriver', () => {
  const assetsPath = '/assets'
  const fsDriver = createFsDriver(assetsPath)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return an object with id, baseUri, resolveUri, readFile, and writeFile functions', () => {
    expect(fsDriver).toBeDefined()
    expect(fsDriver).toHaveProperty('id', 'fs')
    expect(fsDriver).toHaveProperty('baseUri', assetsPath)
    expect(fsDriver.resolveUri).toBeInstanceOf(Function)
    expect(fsDriver.readFile).toBeInstanceOf(Function)
    expect(fsDriver.writeFile).toBeInstanceOf(Function)
  })

  test('resolveUri should return the correct path', () => {
    const relativePath = 'test/file.json'
    const expectedPath = pathJoin(assetsPath, relativePath)

    expect(fsDriver.resolveUri(relativePath)).toBe(expectedPath)
    expect(pathJoin).toHaveBeenCalledWith(assetsPath, relativePath)
  })

  test('readFile should call nodeReadFile with the correct path and return parsed JSON', async () => {
    const relativePath = 'test/file.json'
    const data = { key: 'value' }
    const expectedPath = pathJoin(assetsPath, relativePath)

    mockReadFile.mockResolvedValueOnce(JSON.stringify(data))

    const result = await fsDriver.readFile(relativePath)

    expect(result).toEqual(data)
    expect(mockReadFile).toHaveBeenCalledWith(expectedPath, 'utf-8')
  })

  test('writeFile should call nodeWriteFile with the correct path and data', async () => {
    const relativePath = 'test/file.json'
    const data = [{ id: '001', name: 'Foo' }]
    const expectedPath = pathJoin(assetsPath, relativePath)

    mockWriteFile.mockResolvedValueOnce()

    await fsDriver.writeFile(relativePath, data)

    expect(mockWriteFile).toHaveBeenCalledWith(expectedPath, JSON.stringify(data))
  })
})
