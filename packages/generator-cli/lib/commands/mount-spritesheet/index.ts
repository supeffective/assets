import path from 'node:path'

import { Command } from 'commander'

import { generateMD5 } from '@pkg/utils'

import { copySortedFiles } from './tasks/copySortedFiles'
import { generateCss } from './tasks/generateCss'
import { mountSpritesheetImage } from './tasks/mountSpritesheetImage'
import { optimizeSpritesheet } from './tasks/optimizeSpritesheet'
import { resizeImages } from './tasks/resizeImages'
import { resolveSpriteIndex } from './tasks/resolveSpriteIndex'
import { CmdOpts, CmdParams } from './types'

const resolveParams = function (
  srcDir: string,
  outDir: string,
  tmpDir: string,
  options: CmdOpts,
): CmdParams {
  const inputParams = {
    srcDir: path.resolve(srcDir),
    outDir: path.resolve(outDir),
    ...options,
  }

  const inputParamsMD5 = generateMD5(JSON.stringify(inputParams))

  return {
    md5: inputParamsMD5,
    tmpDir: path.join(tmpDir, 'spritemaker-mount', inputParamsMD5),
    ...inputParams,
  }
}

export default function mountSpritesheet(program: Command): void {
  program
    .command('mount-spritesheet')
    .description('Mounts a spritesheet image (and CSS) given a folder of images.')
    .argument('<srcDir>', 'Source directory where the individual images are.')
    .argument('<outDir>', 'Output directory where to save the spritesheet files.')
    .argument('<tmpDir>', 'Temporary directory where to work with the images.')
    .option('--no-css', "Don't generate any CSS, only the spritesheet image.")
    .option('--ext <extension>', 'Image extension to scan for.', '.png')
    .option(
      '--sorting <jsonfile>',
      'JSON file containing an array of type [string, string[]][], defining the desired order of the sprites.\n' +
        'The first array item is the base file name without the extension, and the second item is an array of CSS class names.',
    )
    .option(
      '--prepend <files...>',
      'Extra sprite image files to prepend to the spritesheet. CSS class name will be taken from the base file name.',
      [],
    )
    .option(
      '--append <files...>',
      'Extra sprite image files to append to the spritesheet. CSS class name will be taken from the base file name.',
      [],
    )
    .option(
      '--cssprefix <prefix>',
      'CSS Class Name prefix. This is ignored if --no-css is specified.',
      'icon',
    )
    .option('--no-webp', 'Use an optimized WebP spritesheet image instead of PNG')
    .option(
      '--no-shadowbg',
      'Use a fallback black shadow spritesheet image (usually more lightweight) together with the main one',
    )
    .option('--crispy', 'Use crispy images (recommended for pixel art)', false)
    .option(
      '--responsive',
      'Genenerate a responsive CSS spritesheet, using percentages instead of pixels',
      false,
    )
    .option('--width <value>', 'Sprite item width.', '50')
    .option('--height <value>', 'Sprite item height.', '50')
    .option('--padding <value>', 'Space between sprites in pixels.', '4')
    .action(
      async (srcDir: string, outDir: string, tmpDir: string, options: CmdOpts): Promise<void> => {
        const params = resolveParams(srcDir, outDir, tmpDir, options)

        const spriteIndex = resolveSpriteIndex(params)
        await copySortedFiles(spriteIndex, params)
        await resizeImages(params)
        await mountSpritesheetImage(spriteIndex, params)
        await optimizeSpritesheet(params)

        if (params.css) {
          generateCss(spriteIndex, params)
        }
      },
    )
}
