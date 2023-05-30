import z from 'zod'

import { nameSchema, slugSchema } from './common'

export const pokedexEntrySchema = z.object({
  id: slugSchema,
  dexNum: z.coerce.number().nullable(),
  forms: z.array(slugSchema),
  flavorText: z.string().optional(),
})

export const pokedexSchema = z.object({
  id: slugSchema,
  name: nameSchema,
  region: slugSchema.nullable(),
  gameSets: z.array(slugSchema),
  baseDex: slugSchema.nullable(),
  entries: z.array(pokedexEntrySchema).optional(),
})

export type Pokedex = z.infer<typeof pokedexSchema>

export type PokedexEntry = z.infer<typeof pokedexEntrySchema>
