import z from 'zod'

import { nameSchema, slugSchema } from './common'

export const gameSuperSetSchema = z.object({
  id: slugSchema,
  name: nameSchema,
  superset: z.string().nullable(),
})

export type GameSuperSet = z.infer<typeof gameSuperSetSchema>
