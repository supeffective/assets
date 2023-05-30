import fs from 'node:fs'
import path from 'node:path'

const PKG_PATH = path.dirname(new URL(import.meta.url).pathname)
const DATA_PATH = path.join(PKG_PATH, '..', '..', 'assets', 'data')

export function getDataPath(basename?: string): string {
  return basename ? path.join(DATA_PATH, basename) : DATA_PATH
}

export function getSafeDataPath(filename: string, basePath?: string): string | null {
  const safeFilename = filename.replace(/[^a-z0-9-_.]/gi, '')

  if (safeFilename !== filename) {
    return null
  }

  if (basePath) {
    return getDataPath(path.join(basePath, safeFilename))
  }

  return getDataPath(safeFilename)
}

export function getSafeDataPathOrFail(filename: string, basePath?: string): string {
  const path = getSafeDataPath(filename, basePath)

  if (!path) {
    throw new Error(`Invalid filename: ${filename}`)
  }

  return path
}

export function readDataFile(filename: string): string {
  return fs.readFileSync(filename, 'utf8')
}

export function readDataFileAsJson<T = any>(filename: string): T {
  const data = readDataFile(filename)

  return JSON.parse(data)
}

export function writeDataFile(filename: string, data: string): void {
  const dirName = path.dirname(filename)
  ensureDataDir(dirName)
  fs.writeFileSync(filename, data)
}

export function writeDataFileAsJson(basename: string, data: any): void {
  writeDataFile(basename, JSON.stringify(data, null, 2))
}

export function dataPathExists(absPath: string): boolean {
  return fs.existsSync(absPath)
}

export function ensureDataDir(fullPath: string): void {
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
  }
}
