import _records from '@pkg/assets/data/originmarks.json'

import { OriginMark } from '../schemas/originmarks'

export function getOriginMarks(): OriginMark[] {
  return _records as OriginMark[]
}
