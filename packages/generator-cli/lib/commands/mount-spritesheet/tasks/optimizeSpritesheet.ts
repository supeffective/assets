import fs from 'node:fs'
import path from 'node:path'

import { assurePath, pathExists, pathWithoutExtension, runCommand } from '@pkg/utils'

import { CmdParams } from '../types'

const WEBP_QUALITY = 75

const optimizePng = function (src: string): Promise<void> {
  const srcNoExt = pathWithoutExtension(src)
  const proofFile = srcNoExt + '-optipng.log'

  if (pathExists(proofFile) || !src.toLowerCase().endsWith('.png')) {
    return Promise.resolve()
  }

  return runCommand(['optipng', [src]])
    .then(() => {
      console.log('[optimizeSpritesheet.optimizePng] DONE')
      fs.writeFileSync(proofFile, 'done')
    })
    .catch(err => {
      throw new Error('[optimizeSpritesheet.optimizePng] Failed: ' + err)
    })
}

const createShadowBg = function (src: string, withWebp: boolean): Promise<void> {
  const srcNoExt = pathWithoutExtension(src)
  const dest = srcNoExt + '-shadow.png'

  if (pathExists(dest)) {
    return Promise.resolve()
  }

  // fully opaque:
  // convert input.png -format png -colorspace gray -fill "#010101" -colorize 100 output.png

  const shadowScriptArgs = [
    src,
    '-format',
    'png',
    '-modulate', // https://imagemagick.org/Usage/color_mods/#modulate
    '0,0',
    `-colorspace`,
    'gray',
    dest,
  ]

  return runCommand(['convert', shadowScriptArgs])
    .catch(err => {
      throw new Error('[optimizeSpritesheet.createShadowBg] Failed: ' + err)
    })
    .then(() => optimizePng(dest))
    .then(() => {
      if (withWebp) {
        return createWebp(dest)
      }
    })
}

const createWebp = function (src: string): Promise<void> {
  const srcNoExt = pathWithoutExtension(src)

  const webpScriptArgs = [
    `-q`,
    String(WEBP_QUALITY),
    '-preset',
    'drawing',
    src,
    `-o`,
    srcNoExt + '.webp',
  ]

  // const scriptArgsLossless = ['-lossless', srcFile, `-o`, outFile]
  return runCommand(['cwebp', webpScriptArgs])
    .then(() => {
      console.log('[optimizeSpritesheet.createWebp] DONE')
    })
    .catch(err => {
      throw new Error('[optimizeSpritesheet.createWebp] Failed: ' + err)
    })
}

export const optimizeSpritesheet = async function (params: CmdParams): Promise<void> {
  const srcFile = path.join(params.outDir, 'spritesheet.png')

  console.log(`[optimizeSpritesheet] Optimizing spritesheet image files in ${params.outDir}`)

  assurePath(params.outDir)

  return optimizePng(srcFile)
    .then(() => (params.webp ? createWebp(srcFile) : Promise.resolve()))
    .then(() => (params.shadowbg ? createShadowBg(srcFile, params.webp) : Promise.resolve()))
}
