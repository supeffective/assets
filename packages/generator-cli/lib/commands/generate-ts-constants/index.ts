import { Command } from 'commander'

import { generateConstantFiles } from './generateConstantFiles'

export default function generateTsConstants(program: Command): void {
  program
    .command('generate-constants')
    .description('Generates TypeScript constants out of the data identifiers (slugs).')
    .argument('<dataDir>', 'Data directory, where the collections dir is')
    .argument('<outputCodeDir>', 'Output directory where the code will be generated into')
    .action((dataDir: string, outputCodeDir: string): void | Promise<void> => {
      generateConstantFiles(dataDir, outputCodeDir)
      console.log('[generate-constant] DONE')
    })
}
