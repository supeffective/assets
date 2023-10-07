import path from 'node:path'

import { z } from 'zod'

import { readFileAsJson, writeFileAsJson } from '../datafs'
import { gameSchemaV2, type GameV2 } from '../schemas/games'

const dataPath = path.resolve(path.join(__dirname, '..', '..', '..', 'assets', 'data'))

const gameSuperSets = readFileAsJson<Array<{ id: string; name: string }>>(
  path.join(dataPath, 'gamesupersets.json'),
)
const gameSets = readFileAsJson<Array<any>>(path.join(dataPath, 'gamesets.json'))

const gameEntries: Array<GameV2> = []

const gameEntryBase: GameV2 = {
  id: '',
  name: '',
  generation: 1,
  type: 'superset',
  gameSet: null,
  gameSuperSet: null,
  codename: null,
  releaseDate: '',
  platforms: ['gb'],
  region: 'kanto',
  originMark: 'gb',
  pokedexes: [],
  features: {
    training: false,
    shiny: true,
    items: true,
    gender: true,
    nature: true,
    ball: true,
    mega: true,
    zmove: true,
    gmax: true,
    alpha: true,
    tera: true,
    ribbons: true,
    marks: true,
  },
  storage: {
    numBoxes: 32,
    boxCapacity: 30,
  },
}

for (const superset of gameSuperSets) {
  const entries: Map<string, GameV2> = new Map()

  const _gameSets = gameSets.filter(set => set.superset === superset.id)
  const _gameSetIds: string[] = _gameSets.map(set => set.id)

  // add superset entry
  const supersetEntry: GameV2 = {
    ...gameEntryBase,
    id: superset.id,
    name: superset.name,
    generation: 1,
    type: 'superset',
    gameSet: null,
    gameSuperSet: null,
    codename: null,
    releaseDate: '1900-01-01',
    platforms: ['gb'],
    region: 'kanto',
    originMark: 'gb',
    pokedexes: [],
    features: {
      ...gameEntryBase.features,
    },
    storage: {
      ...gameEntryBase.storage,
    },
  }

  if (entries.has(superset.id)) {
    throw new Error(`Game superset ${superset.id} already added`)
  }

  if (!_gameSetIds.includes(superset.id)) {
    entries.set(superset.id, supersetEntry)
  }

  for (const gset of _gameSets) {
    // add game set entry
    const gameSetEntry: GameV2 = {
      ...gameEntryBase,
      id: gset.id,
      name: gset.name,
      generation: gset.generation,
      type: 'set',
      gameSet: null,
      gameSuperSet: superset.id === gset.id ? null : superset.id,
      codename: gset.codename,
      releaseDate: gset.releaseDate,
      platforms: gset.platforms,
      region: gset.region,
      originMark: gset.originMark,
      pokedexes: gset.pokedexes,
      features: {
        ...gameEntryBase.features,
        ...gset.features,
      },
      storage: {
        ...gameEntryBase.storage,
        ...gset.storage,
      },
    }

    if (entries.has(gset.id)) {
      throw new Error(`Game set ${gset.id} already added`)
    }
    const games = Object.entries<string>(gset.games)
    const gameIds = games.map(([gameId]) => gameId)

    if (!gameIds.includes(gset.id)) {
      entries.set(gset.id, gameSetEntry)
    }

    const dlcs = gset.dlcs ?? []

    for (const dlc of dlcs) {
      // add dlc entry
      const dlcEntry: GameV2 = {
        ...gameSetEntry,
        id: gameSetEntry.id + '-' + dlc.id,
        type: 'dlc',
        name: dlc.name,
        codename: dlc.codename,
        releaseDate: dlc.releaseDate,
      }

      if (entries.has(dlc.id)) {
        throw new Error(`Game DLC ${dlc.id} already added`)
      }

      entries.set(dlc.id, dlcEntry)
    }

    // add games entry
    for (const [gameId, gameName] of games) {
      const gameEntry: GameV2 = {
        ...gameEntryBase,
        id: gameId,
        name: gameName,
        generation: gset.generation,
        type: 'game',
        gameSet: gset.id === gameId ? null : gset.id,
        gameSuperSet: superset.id === gset.id ? null : superset.id,
        codename: gset.codename,
        releaseDate: gset.releaseDate,
        platforms: gset.platforms,
        region: gset.region,
        originMark: gset.originMark,
        pokedexes: gset.pokedexes,
        features: {
          ...gameEntryBase.features,
          ...gset.features,
        },
        storage: {
          numBoxes: gset.storage.boxes,
          boxCapacity: gset.storage.boxCapacity,
        },
      }

      if (entries.has(gameId)) {
        throw new Error(`Game ${gameId} already added`)
      }

      entries.set(gameId, gameEntry)
    }
  }

  gameEntries.push(...entries.values())
}

// validate gameEntries
z.array(gameSchemaV2).parse(gameEntries)

writeFileAsJson(path.join(dataPath, 'games.json'), gameEntries)
