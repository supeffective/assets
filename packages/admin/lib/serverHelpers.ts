import fs from 'node:fs'
import path from 'node:path'

const ASSETS_PATH = path.resolve(path.join(process.cwd(), '../../assets'))

export function assetExists(assetPath: string): boolean {
  return fs.existsSync(path.join(ASSETS_PATH, assetPath))
}
