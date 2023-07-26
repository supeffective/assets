import _records from '@pkg/assets/data/natures.json'

import { Nature } from '../schemas/natures'

export function getNatures(): Nature[] {
  return _records as Nature[]
}
