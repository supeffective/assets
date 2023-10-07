'use server'

import { getGameSets } from '@pkg/datalayer/repositories/gamesets'
import { getAllPokemon } from '@pkg/datalayer/repositories/pokemon'
import { updateManyPokemon } from '@pkg/datalayer/repositories/server-side/pokemon'
import type { Pokemon } from '@pkg/datalayer/schemas/pokemon'

const allPokes = getAllPokemon()
const allGameSets = getGameSets()
const allGameSetIds = allGameSets.map(gs => gs.id)

export async function updatePokemonOnGameSetAction(
  gameSetId: string,
  pokemonIds: string[],
  field: keyof Pokemon,
): Promise<void> {
  const pokemonIdsSet = new Set(pokemonIds)
  const newPokes: Pokemon[] = []

  for (const pkm of allPokes) {
    const fieldValues: string[] = (pkm as any)[field]
    const newFieldValues: string[] = []

    for (const gs of allGameSetIds) {
      if (gs === gameSetId && pokemonIdsSet.has(pkm.id)) {
        newFieldValues.push(gs)
        continue
      }

      if (gs === gameSetId) {
        continue
      }

      if (fieldValues.includes(gs)) {
        newFieldValues.push(gs)
      }
    }
    ;(pkm as any)[field] = newFieldValues
    newPokes.push(pkm)
  }
  updateManyPokemon(newPokes)
}

export async function updatePokemonOnGameAction(
  gameId: string,
  pokemonIds: string[],
  field: keyof Pokemon,
): Promise<void> {
  const pokemonIdsSet = new Set(pokemonIds)
  const newPokes: Pokemon[] = []

  for (const pkm of allPokes) {
    const fieldValues: string[] = (pkm as any)[field]
    const newFieldValues: string[] = []

    for (const gs of allGameSets) {
      const setGameIds = new Set(Object.keys(gs.games))

      if (setGameIds.has(gameId) && pokemonIdsSet.has(pkm.id)) {
        newFieldValues.push(gameId)
        continue
      }

      if (setGameIds.has(gameId)) {
        continue
      }

      setGameIds.forEach(g => {
        if (fieldValues.includes(g)) {
          newFieldValues.push(g)
        }
      })
    }
    ;(pkm as any)[field] = newFieldValues
    newPokes.push(pkm)
  }
  updateManyPokemon(newPokes)
  await new Promise(resolve => setTimeout(resolve, 2000))
}
