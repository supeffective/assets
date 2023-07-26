import fs from 'node:fs'
import path from 'node:path'

const PKG_PATH = path.dirname(new URL(import.meta.url).pathname)
const ASSETS_PATH = path.join(PKG_PATH, '..', '..', 'assets')
const DATA_PATH = path.join(ASSETS_PATH, 'data')

export type DataOverrideDefinition<T extends { id: string } = { id: string }> = {
  exclude: string[]
  append?: T[]
  merge?: [string, T][]
}

export function getAssetsPath(basename?: string): string {
  return basename ? path.join(ASSETS_PATH, basename) : ASSETS_PATH
}

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

export function readFile(filename: string): string {
  return fs.readFileSync(filename, 'utf8')
}

export function readFileAsJson<T = any>(filename: string): T {
  const data = readFile(filename)

  return JSON.parse(data)
}

export function writeFile(filename: string, data: string): void {
  const dirName = path.dirname(filename)
  ensureDir(dirName)
  fs.writeFileSync(filename, data)
}

export function writeFileAsJson(basename: string, data: any): void {
  writeFile(basename, JSON.stringify(data, null, 2))
}

export function pathExists(absPath: string): boolean {
  return fs.existsSync(absPath)
}

export function ensureDir(fullPath: string): void {
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true })
  }
}
