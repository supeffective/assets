import z from 'zod'

import { nameSchema, slugSchema } from './common'

export const boxPresetBoxPokemonSchema = slugSchema.nullable().or(
  z.object({
    pid: slugSchema,
    gmax: z.coerce.boolean().optional(),
    shinyLocked: z.coerce.boolean().optional(),
    shiny: z.coerce.boolean().optional(),
  }),
)

export const boxPresetBoxSchema = z.object({
  title: nameSchema.optional(),
  pokemon: z.array(boxPresetBoxPokemonSchema),
})

export const boxPresetSchema = z.object({
  id: slugSchema,
  name: nameSchema,
  version: z.coerce.number().int().min(0),
  gameSet: slugSchema,
  description: z.string(),
  boxes: z.array(boxPresetBoxSchema),
  isHidden: z.coerce.boolean().optional(),
})

export const boxPresetMapSchema = z.record(z.record(boxPresetSchema))

export type BoxPresetBoxPokemon = z.infer<typeof boxPresetBoxPokemonSchema>
export type BoxPresetBox = z.infer<typeof boxPresetBoxSchema>
export type BoxPreset = z.infer<typeof boxPresetSchema>
export type BoxPresetMap = Map<string, Map<string, BoxPreset>>
export type BoxPresetRecord = Record<string, Record<string, BoxPreset>>
