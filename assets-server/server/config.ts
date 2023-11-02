import path from 'node:path'
import { parseArgs } from 'node:util'

const projectRoot = path.resolve(process.cwd(), '..', '..')

const {
  values: { port, assetsPath },
} = parseArgs({
  options: {
    port: {
      type: 'string',
      short: 'p',
      default: '3999',
    },
    assetsPath: {
      type: 'string',
      short: 'a',
      default: path.join(projectRoot, 'assets'),
    },
  },
})

if (!assetsPath) {
  throw new Error('assetsPath is not defined')
}

const config = {
  port,
  assetsPath,
}

export default config
