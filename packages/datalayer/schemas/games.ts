import z from 'zod'

import { nameSchema, slugSchema } from './common'

export const gameSchema = z.object({
  id: slugSchema,
  name: nameSchema,
  gameSet: slugSchema,
})

export type Game = z.infer<typeof gameSchema>
