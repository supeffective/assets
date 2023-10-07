import fsp from 'node:fs/promises'
import path from 'node:path'

import { assurePath, pathExists } from '@pkg/utils'

import type { CmdParams, SpriteIndexItem } from '../types'

export const copySortedFiles = async function (
  index: SpriteIndexItem[],
  params: CmdParams,
): Promise<void> {
  if (pathExists(params.tmpDir)) {
    console.log(`[copySortedFiles] SKIPPING. Build dir already exists under ${params.tmpDir}`)

    return
  }
  // copy src files to build path (so they can be safely modified, renamed, etc)
  // we will also rename them in a way they are sorted in the specified order

  console.log(`[copySortedFiles] Copying ${params.srcDir} into ${params.tmpDir}`)
  assurePath(params.tmpDir)

  const padDigits = String(index.length).length

  for (let i = 0; i < index.length; i++) {
    const numPad = String(Number(i) + 1).padStart(padDigits, '0')
    index[i].tmpPath = path.join(params.tmpDir, numPad + params.ext)
    await fsp.copyFile(index[i].path, index[i].tmpPath as string)
    // console.log(index[i].path, index[i].tmpPath as string)
  }

  console.log(`[copySortedFiles] DONE`)
}
