import { Entity } from './types'

export function getPrevNextEntities(
  collection: Entity[],
  id: string,
): {
  prev: Entity | null
  next: Entity | null
} {
  const index = collection.findIndex(entity => entity.id === id)
  const prev = index <= 0 ? null : collection[index - 1]
  const next = index < collection.length - 1 ? collection[index + 1] : null

  return {
    prev: prev ?? null,
    next: next ?? null,
  }
}
