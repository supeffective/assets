import z from 'zod'

import { generationSchema, nameSchema, slugSchema } from './common'

export const pokemonSchema = z.object({
  id: slugSchema,
  nid: slugSchema,
  dexNum: z.coerce.number().int().min(0),
  formId: slugSchema.nullable(),
  name: nameSchema,
  psName: nameSchema,
  formName: nameSchema.nullable(),
  region: slugSchema,
  generation: generationSchema,
  type1: slugSchema,
  type2: slugSchema.nullable(),
  color: slugSchema,
  abilities: z.object({
    primary: slugSchema,
    secondary: slugSchema.nullable(),
    hidden: slugSchema.nullable(),
  }),
  isDefault: z.coerce.boolean(),
  isForm: z.coerce.boolean(),
  isLegendary: z.coerce.boolean(),
  isMythical: z.coerce.boolean(),
  isUltraBeast: z.coerce.boolean(),
  ultraBeastCode: z.string().nullable(),
  isParadox: z.coerce.boolean().optional(),
  paradoxSpecies: z.array(slugSchema).nullable().optional(),
  isConvergent: z.coerce.boolean().optional(),
  convergentSpecies: z.array(slugSchema).nullable().optional(),
  isSpecialAbilityForm: z.coerce.boolean(),
  isCosmeticForm: z.coerce.boolean(),
  isFemaleForm: z.coerce.boolean(),
  hasGenderDifferences: z.coerce.boolean(),
  isBattleOnlyForm: z.coerce.boolean(),
  isSwitchableForm: z.coerce.boolean(),
  isFusion: z.coerce.boolean(),
  fusedWith: z.array(slugSchema).nullable(),
  isMega: z.coerce.boolean(),
  isPrimal: z.coerce.boolean(),
  // isTotem: z.coerce.boolean(),
  isGmax: z.coerce.boolean(),
  isRegional: z.coerce.boolean(),
  canGmax: z.coerce.boolean(),
  canDynamax: z.coerce.boolean(),
  canBeAlpha: z.coerce.boolean(),
  debutIn: slugSchema,
  obtainableIn: z.array(slugSchema),
  versionExclusiveIn: z.array(slugSchema),
  eventOnlyIn: z.array(slugSchema),
  storableIn: z.array(slugSchema),
  shinyReleased: z.coerce.boolean(),
  shinyBase: slugSchema.nullable(),
  baseStats: z.object({
    hp: z.coerce.number().int().min(-1).max(255),
    atk: z.coerce.number().int().min(-1).max(255),
    def: z.coerce.number().int().min(-1).max(255),
    spa: z.coerce.number().int().min(-1).max(255),
    spd: z.coerce.number().int().min(-1).max(255),
    spe: z.coerce.number().int().min(-1).max(255),
  }),
  goStats: z.object({
    atk: z.coerce.number().int().min(-1).max(512),
    def: z.coerce.number().int().min(-1).max(512),
    sta: z.coerce.number().int().min(-1).max(512),
  }),
  weight: z.coerce.number().int().min(-1).max(999999),
  height: z.coerce.number().int().min(-1).max(999999),
  // maleRate: z.coerce.number().int().min(-1).max(100),
  // femaleRate: z.coerce.number().int().min(-1).max(100),
  baseSpecies: slugSchema.nullable(),
  baseForms: z.array(slugSchema),
  forms: z.array(slugSchema),
  evolvesFrom: z
    .object({
      species: slugSchema,
      level: z.coerce.number().int().min(1).max(100).optional(),
      item: z.string().nullable().optional(),
      ability: slugSchema.optional(),
      move: slugSchema.optional(),
      other: z.string().optional(),
    })
    .nullable(),
  refs: z
    .object({
      pogo: z.string().nullable(),
      smogon: z.string().nullable(),
      showdown: z.string().nullable(),
      serebii: z.string().nullable(),
      bulbapedia: z.string().nullable(),
      homeSprite: z.string().nullable(),
      miniSprite: z.string().nullable(),
    })
    .optional(),
})

export type Pokemon = z.infer<typeof pokemonSchema>

export type LegacyPokemon = {
  id: string
  nid: string
  dexNum: number
  formId: string | null
  name: string
  formName: string | null
  region: string
  generation: number
  type1: string
  type2: string | null
  color: string
  isDefault: boolean
  isForm: boolean
  isSpecialAbilityForm: boolean
  isCosmeticForm: boolean
  isFemaleForm: boolean
  hasGenderDifferences: boolean
  isBattleOnlyForm: boolean
  isSwitchableForm: boolean
  isMega: boolean
  isPrimal: boolean
  isGmax: boolean
  canGmax: boolean
  canDynamax: boolean
  canBeAlpha: boolean
  debutIn: string
  obtainableIn: string[]
  versionExclusiveIn: string[]
  eventOnlyIn: string[]
  storableIn: string[]
  shinyReleased: boolean
  shinyBase: string | null
  baseSpecies: string | null
  forms: string[] | null
  refs: {
    bulbapedia: string | null
    serebii: string | null
    smogon: string | null
    showdown: string | null
  }
}
