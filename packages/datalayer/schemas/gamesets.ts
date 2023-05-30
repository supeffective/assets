import z from 'zod'

import { nameSchema, slugSchema } from './common'

export const gameSetSchema = z.object({
  id: slugSchema,
  name: nameSchema,
  superset: slugSchema,
})

export type GameSet = z.infer<typeof gameSetSchema>
