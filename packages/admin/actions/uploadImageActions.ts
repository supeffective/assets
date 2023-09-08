'use server'

import fs from 'node:fs'
import path from 'node:path'

import { getAssetsPath } from '@pkg/datalayer/datafs'

export async function uploadImageAction(
  base64Content: string,
  destinationFilename: string,
): Promise<void> {
  const destFullPath = path.join(getAssetsPath(), destinationFilename)
  const base64Data = base64Content.replace(/^data:image\/(png|jpg|gif|jpeg);base64,/, '')
  const binaryData = Buffer.from(base64Data, 'base64')

  return fs.promises.writeFile(destFullPath, binaryData)
}
