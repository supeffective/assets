import { Command } from 'commander'

import { createPokemonSpriteIndex } from './createPokemonSpriteIndex'

export default function createSpriteIndices(program: Command): void {
  program
    .command('create-sprite-indices')
    .description(
      'Creates different indices to use as sorting JSON files, e.g. for the sprite builder.'
    )
    .argument('<dataDir>', 'Data directory')
    .argument('<buildDir>', 'Build directory')
    .action((dataDir: string, buildDir: string): void | Promise<void> => {
      createPokemonSpriteIndex(dataDir, buildDir, 'homeSprite')
      createPokemonSpriteIndex(dataDir, buildDir, 'miniSprite')
      console.log('[create-indices] DONE')
    })
}
