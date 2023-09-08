import z from 'zod'

import { nameSchema, slugSchema } from './common'

export const regionSchema = z.object({
  id: slugSchema,
  name: nameSchema,
})

export type Region = z.infer<typeof regionSchema>
