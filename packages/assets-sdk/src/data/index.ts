import {
  Color,
  colorSchema,
  Game,
  gameSchema,
  Language,
  languageSchema,
  Nature,
  natureSchema,
  OriginMark,
  originMarkSchema,
  PokeType,
  pokeTypeSchema,
  Region,
  regionSchema,
} from '../schemas'
import _pokemonColors from './colors.json'
import _pokemonGames from './games.json'
import _pokemonLanguages from './languages.json'
import _pokemonNatures from './natures.json'
import _pokemonOriginMarks from './origin-marks.json'
import _pokemonRegions from './regions.json'
import _pokemonTypes from './types.json'

// validate and cast data
const pokemonColors: Color[] = colorSchema.array().parse(_pokemonColors)
const pokemonLanguages: Language[] = languageSchema.array().parse(_pokemonLanguages)
const pokemonNatures: Nature[] = natureSchema.array().parse(_pokemonNatures)
const pokemonOriginMarks: OriginMark[] = originMarkSchema.array().parse(_pokemonOriginMarks)
const pokemonRegions: Region[] = regionSchema.array().parse(_pokemonRegions)
const pokemonTypes: PokeType[] = pokeTypeSchema.array().parse(_pokemonTypes)
const pokemonGames: Game[] = gameSchema.array().parse(_pokemonGames)

// convert to maps

const pokemonColorsMap = new Map<string, Color>(pokemonColors.map(color => [color.id, color]))
const pokemonLanguagesMap = new Map<string, Language>(
  pokemonLanguages.map(language => [language.id, language]),
)
const pokemonNaturesMap = new Map<string, Nature>(pokemonNatures.map(nature => [nature.id, nature]))
const pokemonOriginMarksMap = new Map<string, OriginMark>(
  pokemonOriginMarks.map(mark => [mark.id, mark]),
)
const pokemonRegionsMap = new Map<string, Region>(pokemonRegions.map(region => [region.id, region]))
const pokemonTypesMap = new Map<string, PokeType>(pokemonTypes.map(type => [type.id, type]))

const pokemonGamesMap = new Map<string, Game>(pokemonGames.map(game => [game.id, game]))

export {
  pokemonColors,
  pokemonColorsMap,
  pokemonGames,
  pokemonGamesMap,
  pokemonLanguages,
  pokemonLanguagesMap,
  pokemonNatures,
  pokemonNaturesMap,
  pokemonOriginMarks,
  pokemonOriginMarksMap,
  pokemonRegions,
  pokemonRegionsMap,
  pokemonTypes,
  pokemonTypesMap,
}
