import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { assureServerSide } from '../env'

assureServerSide()

export const pathExists = function (_path: string): boolean {
  return fs.existsSync(_path)
}

export const pathWithoutExtension = function (_path: string): string {
  return path.join(path.dirname(_path), path.basename(_path, path.extname(_path)))
}

export const getCurrentPaths = function (importMeta: ImportMeta): {
  __filename: string
  __dirname: string
} {
  const __filename = fileURLToPath(importMeta.url)
  const __dirname = path.dirname(__filename)

  return {
    __filename,
    __dirname,
  }
}

export const assurePath = function (_path: string): void {
  if (!pathExists(_path)) {
    fs.mkdirSync(_path, { recursive: true })
  }
}

export const getFilesByExtension = (dir: string, ext: string | RegExp): string[] => {
  const matchedFiles = []

  const files = fs.readdirSync(dir)

  for (const file of files) {
    const fileExt = path.extname(file)

    if (fileExt === ext || (ext instanceof RegExp && ext.test(fileExt))) {
      matchedFiles.push(path.join(dir, file))
    }
  }

  return matchedFiles
}
