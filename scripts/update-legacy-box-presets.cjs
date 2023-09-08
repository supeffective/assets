const fs = require('fs')
const path = require('path')
const dataDir = path.join(__dirname, '..', 'assets', 'data')
const presetsFile = path.join(dataDir, 'legacy', 'box-presets.json')

const pokemonList = JSON.parse(fs.readFileSync(path.join(dataDir, 'pokemon.json'), 'utf8'))

/**
 * @type {import('../packages/datalayer/schemas/box-presets').BoxPresetMap}
 */
const boxPresets = JSON.parse(fs.readFileSync(presetsFile, 'utf8'))

/**
 * @type {Map<string, import('../packages/datalayer/schemas/pokemon').Pokemon>}
 */
const pokemonMap = new Map(
  pokemonList.map(pokemon => {
    return [pokemon.id, pokemon]
  })
)

const pokemonIds = Array.from(pokemonMap.keys())

/**
 * @type {import('../packages/datalayer/schemas/box-presets').BoxPreset}
 */
// const homePresets = boxPresets['home']

// const goPresetId = {
//   sortedSpecies: 'sorted-species',
//   sortedSpeciesMinimal: 'sorted-species-minimal',
//   fullySorted: 'fully-sorted',
//   fullySortedMinimal: 'fully-sorted-minimal',
// }

// const createRange = (start, end) => {
//   const range = []
//   for (let i = start; i <= end; i++) {
//     range.push(i)
//   }

//   return range
// }

// const excludedDexNums = new Set([
//   pokemonMap.get('volcanion').dexNum,
//   ...createRange(pokemonMap.get('oinkologne').dexNum + 1, 807), // Gen 9
// ])

/**
 *
 * @param {import('../packages/datalayer/schemas/pokemon').Pokemon} pokemon
 * @param {string} gameSetId
 * @param {boolean} includeNonStorable
 * @returns {boolean}
 */
const isTrackable = (pokemon, gameSetId, includeNonStorable) => {
  return (
    pokemon &&
    pokemon.dexNum > 0 &&
    ((includeNonStorable && pokemon.obtainableIn.some(game => game === gameSetId)) ||
      pokemon.storableIn.some(game => game === gameSetId) ||
      pokemon.eventOnlyIn.some(game => game === gameSetId))
  )
}

const updateGoPresets = () => {
  /**
   * @type {import('../packages/datalayer/schemas/box-presets').BoxPreset}
   */
  const goPresets = boxPresets['go']

  // empty boxes first, leaving just one:
  goPresets['sorted-species'].boxes = [{ pokemon: [] }]
  goPresets['sorted-species-minimal'].boxes = [{ pokemon: [] }]
  goPresets['fully-sorted'].boxes = [{ pokemon: [] }]
  goPresets['fully-sorted-minimal'].boxes = [{ pokemon: [] }]

  const sortedSpecies = []
  const sortedSpecies_forms = []

  const sortedSpeciesMinimal = []
  const sortedSpeciesMinimal_forms = []

  const fullySorted = []
  const fullySortedMinimal = []

  // sorted-species
  for (const pkId of pokemonIds) {
    const pk = pokemonMap.get(pkId)

    // Update GO presets
    if (isTrackable(pk, 'go', true)) {
      const isMinimalExcludedForm = pk.isForm && (pk.isLegendary || pk.isMythical)

      if (!pk.isForm) {
        sortedSpecies.push(pk.id)
        sortedSpeciesMinimal.push(pk.id)
        fullySorted.push(pk.id)
        fullySortedMinimal.push(pk.id)
      }

      if (pk.isForm) {
        sortedSpecies_forms.push(pk.id)
        fullySorted.push(pk.id)
        if (!isMinimalExcludedForm) {
          sortedSpeciesMinimal_forms.push(pk.id)
          fullySortedMinimal.push(pk.id)
        }
      }
    }
  }

  goPresets['sorted-species'].boxes[0].pokemon = [...sortedSpecies, ...sortedSpecies_forms]
  goPresets['sorted-species-minimal'].boxes[0].pokemon = [
    ...sortedSpeciesMinimal,
    ...sortedSpeciesMinimal_forms,
  ]
  goPresets['fully-sorted'].boxes[0].pokemon = fullySorted
  goPresets['fully-sorted-minimal'].boxes[0].pokemon = fullySortedMinimal

  // console.log(goPresets['fully-sorted'].boxes[0].pokemon)
  // save
  boxPresets['go'] = goPresets
  fs.writeFileSync(presetsFile, JSON.stringify(boxPresets, null, 2))

  console.log('GO presets updated!')
}

updateGoPresets()
