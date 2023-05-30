import { z } from 'zod'

import flatty from './flatty'

export function parseFormData<T extends object>(data: FormData, schema: z.ZodSchema<T>): T {
  const filteredEntries = Array.from(data.entries())
    .filter(([key]) => !key.includes('$ACTION_ID_'))
    .map(([key, value]) => {
      if (value === '' && key.endsWith('[]')) {
        return [key.slice(0, -2), []]
      }
      if (value === '') {
        return [key, null]
      }

      return [key, value]
    })

  const filtereData = Object.fromEntries(filteredEntries)

  return schema.parse(flatty.unflatten(filtereData))
}
