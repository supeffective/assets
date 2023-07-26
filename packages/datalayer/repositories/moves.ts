import _records from '@pkg/assets/data/moves.json'

import { Move } from '../schemas/moves'

export function getMoves(): Move[] {
  return _records as Move[]
}

export function getMoveByNameOrFail(name: string): Move {
  const record = getMoves().find(record => record.name === name)
  if (!record) {
    throw Error(`Move with name '${name}' not found`)
  }

  return record
}

export function getMoveByShowdownNameOrFail(name: string): Move {
  const record = getMoves().find(record => record.psName === name)
  if (!record) {
    throw Error(`Move with psName '${name}' not found`)
  }

  return record
}
