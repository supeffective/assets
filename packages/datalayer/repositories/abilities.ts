import { z } from 'zod'

import _records from '@pkg/assets/data/abilities.json'

import { abilitySchema, type Ability } from '../schemas/abilities'

export function getAbilities(): Ability[] {
  return _records
}

export function getAbilityByNameOrFail(name: string): Ability {
  const ability = getAbilities().find(record => record.name === name)

  if (!ability) {
    throw new Error(`Ability with name '${name}' not found`)
  }

  return ability
}

export function getAbilityByShowdownNameOrFail(name: string): Ability {
  const ability = getAbilities().find(record => record.psName === name)

  if (!ability) {
    throw new Error(`Ability with psName '${name}' not found`)
  }

  return ability
}

export function getAbilityById(id: string): Ability | undefined {
  return _records.find(record => record.id === id)
}

export function validateAbilities() {
  const records = getAbilities()

  return z.array(abilitySchema).safeParse(records)
}

export function validateAbility(ability: Ability) {
  return abilitySchema.safeParse(ability)
}
