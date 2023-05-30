import { createHash } from 'crypto'

import { assureServerSide } from '../env'

assureServerSide()
export const generateMD5 = function (content: string): string {
  return createHash('md5').update(content).digest('hex')
}
