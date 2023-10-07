import _records from '@pkg/assets/data/marks.json'

import type { Mark } from '../schemas/marks'

export function getMarks(): Mark[] {
  return _records as Mark[]
}
