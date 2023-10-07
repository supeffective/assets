import type { Command } from 'commander'

import { createSpriteIndex } from './createSpriteIndex'

export default function createSpriteIndices(program: Command): void {
  program
    .command('create-sprite-indices')
    .description(
      'Creates different indices to use as sorting JSON files, e.g. for the sprite builder.',
    )
    .argument('<dataFile>', 'JSON data file, a collection of records')
    .argument('<buildDir>', 'Build directory')
    .action((dataFile: string, buildDir: string): void | Promise<void> => {
      console.log('[create-indices] Creating indices from', dataFile, ', into', buildDir)
      createSpriteIndex(dataFile, buildDir)
      console.log('[create-indices] DONE')
    })
}
