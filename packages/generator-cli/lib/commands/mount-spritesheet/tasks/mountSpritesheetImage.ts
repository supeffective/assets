import path from 'node:path'

import { assurePath, pathExists, runCommand } from '@pkg/utils'

import type { CmdParams, SpriteIndexItem } from '../types'

export const mountSpritesheetImage = async function (
  index: SpriteIndexItem[],
  params: CmdParams,
): Promise<void> {
  const gridSizeSqrt = Math.ceil(Math.sqrt(index.length))
  const gridSize = `${gridSizeSqrt}x${gridSizeSqrt}`
  const spriteSize = `${params.width}x${params.height}`
  const outFile = path.join(params.outDir, 'spritesheet.png')

  if (pathExists(outFile)) {
    console.log(`[mountSpritesheet] SKIPPING. Spritesheet image already mounted`)

    return
  }

  console.log(`[mountSpritesheet] Mounting spritesheet in ${outFile}`)

  const scriptArgs = [
    `${params.tmpDir}/*${params.ext}`,
    '-tile',
    gridSize,
    '-geometry',
    `${spriteSize}+0+0`,
    '-background',
    'transparent',
    '-border',
    params.padding,
    '-bordercolor',
    'transparent',
    '-interlace',
    'line',
    outFile,
  ]

  assurePath(params.outDir)

  await runCommand(['montage', scriptArgs], { cwd: params.tmpDir })
    .then(() => {
      console.log('[mountSpritesheet] DONE')
    })
    .catch((err: Error) => {
      throw new Error('[mountSpritesheet] Failed: ' + err)
    })
}
