#!/usr/bin/env node
import { Command } from 'commander'

import packageJson from '../package.json'
import createSpriteIndices from './commands/create-sprite-indices'
import generateTsConstants from './commands/generate-ts-constants'
import mountFont from './commands/mount-font'
import mountSpritesheet from './commands/mount-spritesheet'

const program = new Command()
program.name('generator-cli').version(packageJson.version)

function registerCommands(): void {
  // sprite maker commands:
  mountSpritesheet(program)
  mountFont(program)

  // data commands
  createSpriteIndices(program)
  generateTsConstants(program)
}

registerCommands()

program.parse(process.argv)
