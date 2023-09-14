const fs = require('fs')
const path = require('path')
const dataDir = path.join(__dirname, '..', 'assets', 'data')
const pokedexesFile = path.join(dataDir, 'pokedexes.json')
const pokemonFile = path.join(dataDir, 'pokemon.json')
const games = JSON.parse(fs.readFileSync(path.join(dataDir, 'games.json'), 'utf8'))
const gameIds = [...new Set([...games.map(g => g.id)])]

/**
 * @type {Array<import('../packages/datalayer/schemas/pokedexes').Pokedex>}
 */
const pokedexes = JSON.parse(fs.readFileSync(pokedexesFile, 'utf8'))

/**
 * @type {Map<string, import('../packages/datalayer/schemas/pokedexes').Pokedex>}
 */
const pokedexMap = new Map(
  pokedexes.map(dex => {
    return [dex.id, dex]
  }),
)

/**
 * @type {Array<import('../packages/datalayer/schemas/pokemon').Pokemon>}
 */
const pokemonList = JSON.parse(fs.readFileSync(pokemonFile, 'utf8'))
const newPokemonList = []

/**
 * @type {Map<string, import('../packages/datalayer/schemas/pokemon').Pokemon>}
 */
const pokemonMap = new Map(
  pokemonList.map(pokemon => {
    return [pokemon.id, pokemon]
  }),
)

const pokemonIds = Array.from(pokemonMap.keys())

/**
 *
 * @param {import('../packages/datalayer/schemas/pokemon').Pokemon} pokemon
 * @param {string} gameSetId
 * @param {boolean} includeNonStorable
 * @returns {boolean}
 */
const isTrackable = (pokemon, includeNonStorable) => {
  return pokemon && pokemon.dexNum > 0 && (pokemon.isBattleOnlyForm === false || includeNonStorable)
}

/**
 *
 * @param {import('../packages/datalayer/schemas/pokedexes').Pokedex} dex
 * @param {string} pokemonId
 */
function dexHasPokemon(dex, pokemonId) {
  return dex.entries.some(p => p.id === pokemonId)
}

const updatePokemonAvailability = () => {
  const nationalDex = pokedexMap.get('national')
  if (!nationalDex) {
    throw new Error('National dex not found')
  }

  const kitakamiDex = pokedexMap.get('kitakami')

  if (!kitakamiDex) {
    throw new Error('Kitakami dex not found')
  }

  for (const pokemonId of pokemonIds) {
    const pokemon = pokemonMap.get(pokemonId)
    if (!pokemon) {
      throw new Error(`Pokemon not found: ${pokemonId}`)
    }

    // HOME / National
    if (dexHasPokemon(nationalDex, pokemonId)) {
      if (isTrackable(pokemon, false) && !pokemon.storableIn.includes('home')) {
        pokemon.storableIn.push('home')
      }
    }

    // Kitakami
    if (dexHasPokemon(kitakamiDex, pokemonId)) {
      if (!pokemon.obtainableIn.includes('sv')) {
        pokemon.obtainableIn.push('sv')
      }
      if (isTrackable(pokemon, false) && !pokemon.storableIn.includes('sv')) {
        pokemon.storableIn.push('sv')
      }
    }

    const obtainableSet = new Set(pokemon.obtainableIn)
    const storableSet = new Set(pokemon.storableIn)
    pokemon.obtainableIn = []
    pokemon.storableIn = []

    // set games in order
    for (const gameId of gameIds) {
      if (obtainableSet.has(gameId)) {
        pokemon.obtainableIn.push(gameId)
      }
      if (storableSet.has(gameId)) {
        pokemon.storableIn.push(gameId)
      }
    }

    newPokemonList.push(pokemon)
  }

  fs.writeFileSync(pokemonFile, JSON.stringify(newPokemonList, null, 2))
}

updatePokemonAvailability()
