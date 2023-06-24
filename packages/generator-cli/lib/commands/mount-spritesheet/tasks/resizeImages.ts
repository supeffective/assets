import fs from 'node:fs'
import path from 'node:path'

import { runCommand } from '@pkg/utils/lib/node/cmd'
import { pathExists } from '@pkg/utils/lib/node/fs'

import { CmdParams } from '../types'

export const resizeImages = async function (params: CmdParams): Promise<void> {
  const resizedProofFile = path.join(params.tmpDir, 'resized.log')

  if (pathExists(resizedProofFile)) {
    console.log(`[resizeImages] SKIPPING. Images already resized`)

    return
  }

  const spriteSize = `${params.width}x${params.height}`

  console.log(`[resizeImages] Resizing images to ${spriteSize} in ${params.tmpDir}`)

  const scriptArgs = [
    `-resize`,
    spriteSize,
    // '+dither',
    // '-colors',
    // '24',
    // '-depth',
    // '8',
    `${params.tmpDir}/*${params.ext}`,
  ]
  await runCommand(['mogrify', scriptArgs], { cwd: params.tmpDir })
    .then(() => {
      fs.writeFileSync(resizedProofFile, 'done')
      console.log('[resizeImages] DONE')
    })
    .catch(err => {
      throw new Error('[resizeImages] Failed: ' + err)
    })
}
