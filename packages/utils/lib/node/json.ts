import fs from 'fs'

import { assureServerSide } from '../env'
import { pathExists } from './fs'

assureServerSide()

export const parseJsonFile = <T = unknown>(_path: string): T => {
  if (!pathExists(_path)) {
    throw new Error(`File ${_path} does not exist`)
  }

  return JSON.parse(fs.readFileSync(_path, 'utf8'))
}

export const saveJsonFile = (_path: string, data: unknown, indentation = 2): void => {
  fs.writeFileSync(_path, JSON.stringify(data, null, indentation))
}
