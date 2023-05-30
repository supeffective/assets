import z from 'zod'

import { hexColorSchema, nameSchema, slugSchema } from './common'

export const pokeTypeSchema = z.object({
  id: slugSchema,
  name: nameSchema,
  color: hexColorSchema,
})

export type PokeType = z.infer<typeof pokeTypeSchema>
