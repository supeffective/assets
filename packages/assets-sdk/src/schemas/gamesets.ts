import z from 'zod'

import { nameSchema, slugSchema } from './common'

export const gameSetSchema = z.object({
  id: slugSchema,
  name: nameSchema,
  superset: slugSchema,
  games: z.record(nameSchema.optional()),
  storage: z.object({
    boxCapacity: z.number().int().positive(),
    boxes: z.number().int().positive(),
  }),
})

export type GameSet = z.infer<typeof gameSetSchema>
