import child_process, {
  ExecSyncOptionsWithStringEncoding,
  SpawnOptionsWithoutStdio,
  spawnSync,
} from 'node:child_process'

import { assureServerSide } from '../env'

assureServerSide()

export type CommandDefinition = [string, string[]]

export function getCliArguments(): string[] {
  return process.argv.splice(2)
}

export async function runCommand(
  command: CommandDefinition,
  options?: SpawnOptionsWithoutStdio
): Promise<[CommandDefinition, object]> {
  const _options = Object.assign({ stdio: 'inherit' }, options || {})

  return new Promise((resolve, reject) => {
    const result = spawnSync(command[0], command[1], _options)

    if (result.status === 0) {
      resolve([command, result])

      return
    }

    reject(new Error(`[commander] Process exited with error '${result.error?.message}'`))
  })
}

export async function runSequentialCommands(commands: CommandDefinition[]): Promise<void> {
  const commandStack = Array.from(commands).reverse()
  while (commandStack.length > 0) {
    const command: CommandDefinition = commandStack.pop() as CommandDefinition
    await runCommand(command)
  }
}

export const runCommandSync = function (
  script: string,
  options?: ExecSyncOptionsWithStringEncoding
): string {
  return String(child_process.execSync(script, options) + '')
}
