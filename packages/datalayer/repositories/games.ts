import _gameRecords from '@pkg/assets/data/games.json'
import _gameSetRecords from '@pkg/assets/data/gamesets.json'

import { Game, GameV2 } from '../schemas/games'

const _records: Game[] = _gameSetRecords.flatMap(({ id: gameSetId, games }) => {
  return Object.entries(games).map(([id, game]) => ({
    id,
    name: game,
    gameSet: gameSetId,
  }))
})

const _gameDataV2: GameV2[] = _gameRecords as GameV2[]
const _gameRecordsV2: GameV2[] = _gameDataV2.filter(record => record.type === 'game')
const _gameSetRecordsV2: GameV2[] = _gameDataV2.filter(
  record => record.type === 'set' || (record.type === 'game' && record.gameSet === null)
)
const _gameSuperSetRecordsV2: GameV2[] = _gameDataV2.filter(
  record => record.type === 'superset' || (record.type === 'set' && record.gameSuperSet === null)
)

export function getGames(): Game[] {
  return _records
}

export function getGameRecordsV2(): GameV2[] {
  return _gameDataV2
}

export function getGamesV2(): GameV2[] {
  return _gameRecordsV2
}

export function getGameSetsV2(): GameV2[] {
  return _gameSetRecordsV2
}

export function getGameSuperSetsV2(): GameV2[] {
  return _gameSuperSetRecordsV2
}

export function getManyGames(ids: string[]): Game[] {
  return _records.filter(record => ids.includes(record.id))
}

export function getManyGameRecordsV2(ids: string[]): GameV2[] {
  return _gameDataV2.filter(record => ids.includes(record.id))
}

export function getGame(id: string): Game | undefined {
  return _records.find(record => record.id === id)
}

export function getGameRecordV2(id: string): GameV2 | undefined {
  return _gameDataV2.find(record => record.id === id)
}
