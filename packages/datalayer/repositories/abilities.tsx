import { z } from 'zod'

import _records from '@pkg/assets/data/abilities.json'

import { Ability, abilitySchema } from '../schemas/abilities'

export function getAbilities(): Ability[] {
  return _records
}

export function validateAbilities() {
  const records = getAbilities()

  return z.array(abilitySchema).safeParse(records)
}

export function validateAbility(ability: Ability) {
  return abilitySchema.safeParse(ability)
}
