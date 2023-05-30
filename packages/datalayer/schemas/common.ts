import { z } from 'zod'

export const MAX_POKEMON_GENERATION = 9
export const nameSchema = z.string().max(50)
export const slugSchema = z
  .string()
  .max(50)
  .regex(/^[a-z0-9-]+$/)
export const generationSchema = z.coerce.number().min(0).max(MAX_POKEMON_GENERATION)
export const descriptionSchema = z.string().max(200)
export const detailSchema = z.string().max(2000).nullable()

export const hexColorSchema = z.string().regex(/^#[0-9a-f]{6}$/i)

export const statIdSchema = z.enum(['hp', 'atk', 'def', 'spa', 'spd', 'spe', 'acc', 'eva'])

export type IDType = string
