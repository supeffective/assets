import _records from '@pkg/assets/data/languages.json'

import { Language } from '../schemas/languages'

export function getLanguages(): Language[] {
  return _records as Language[]
}
