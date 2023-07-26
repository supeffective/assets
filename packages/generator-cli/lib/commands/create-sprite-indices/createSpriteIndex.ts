import path from 'node:path'

import { parseJsonFile, saveJsonFile } from '@pkg/utils'

interface DataRecord {
  id: string
  nid?: string
}

export function createSpriteIndex(dataFile: string, buildDir: string): void {
  const srcJsonFile = path.resolve(dataFile)
  const fileName = path.basename(srcJsonFile, '.json')

  const destJsonFile = path.join(path.resolve(buildDir), `${fileName}-index.json`)

  const records = parseJsonFile<DataRecord[]>(srcJsonFile)
  const idsMap = new Map<string, string[]>()

  if (!records || !Array.isArray(records)) {
    throw new Error(`Invalid format for ${srcJsonFile}`)
  }

  for (const row of records) {
    if (!row.id) {
      throw new Error(`Invalid format for ${srcJsonFile}. Missing ID`)
    }

    const _id = row.nid ?? row.id

    if (idsMap.has(_id)) {
      throw new Error(`Duplicate ID ${_id} in ${srcJsonFile}`)
    }

    idsMap.set(_id, [row.id])
  }

  saveJsonFile(destJsonFile, Array.from(idsMap.entries()))
}