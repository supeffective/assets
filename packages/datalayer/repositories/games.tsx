import _gameSetRecords from '@pkg/assets/data/gamesets.json'

import { Game } from '../schemas/games'

const _records: Game[] = _gameSetRecords.flatMap(({ id: gameSetId, games }) => {
  return Object.entries(games).map(([id, game]) => ({
    id,
    name: game,
    gameSet: gameSetId,
  }))
})

export function getGames(): Game[] {
  return _records
}

export function getManyGames(ids: string[]): Game[] {
  return _records.filter(record => ids.includes(record.id))
}

export function getGame(id: string): Game | undefined {
  return _records.find(record => record.id === id)
}
