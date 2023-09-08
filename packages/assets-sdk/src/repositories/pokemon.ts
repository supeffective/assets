import { PKM_LATEST_GAMESET, PKM_LATEST_GENERATION, PKM_LATEST_REGION } from '../assets'
import { createReadOnlyRepository } from '../core/createReadOnlyRepository'
import type { Repository, RepositoryDataProvider } from '../core/types'
import {
  CompactPokemon,
  pokemonCompactSchema,
  pokemonSchema,
  type Pokemon,
} from '../schemas/pokemon'
import { createSearchIndex, SearchEngine, SearchEngineIndex } from '../search'
import createSearchEngine from '../search/createSearchEngine'

// ----  Search hydrator ----

async function pokemonSearchIndexHydrator<K extends CompactPokemon | Pokemon>(
  entities: K[],
  searchIndex: SearchEngineIndex<K>,
): Promise<void> {
  await searchIndex.index(entities, [
    [
      'num',
      pk => {
        const dexNum = (pk.dexNum >= 5000 ? 0 : pk.dexNum).toString()

        return [dexNum, dexNum.padStart(3, '0'), dexNum.padStart(4, '0')]
      },
    ],
    ['name', pk => [pk.id, pk.name, pk.name.replace(/ /g, '').replace(/\s/g, '')]],
    ['type', pk => [pk.type1, pk.type2].filter(Boolean) as string[]],
    ['base', pk => pk.baseSpecies || pk.id],
    ['color', pk => pk.color || null],
    ['id', pk => pk.id || null],
    ['storable', pk => (pk.storableIn.length > 0 ? pk.storableIn : null)],
    [
      'obtainable',
      pk => {
        if ('obtainableIn' in pk) {
          return pk.obtainableIn.length > 0 ? pk.obtainableIn : null
        }

        return null
      },
    ],
  ])
}

// ----  Pokemon ----

export function createPokemonRepository(dataProvider: RepositoryDataProvider): Repository<Pokemon> {
  return createReadOnlyRepository<Pokemon>({
    id: 'pokemon',
    resourcePath: 'data/pokemon.min.json',
    schema: pokemonSchema,
    dataProvider: dataProvider,
  })
}

export function createPokemonSearchEngine(repository: Repository<Pokemon>): SearchEngine<Pokemon> {
  return createSearchEngine<Pokemon>(repository, createSearchIndex(), pokemonSearchIndexHydrator)
}

// ----  Compact Pokemon ----

export function createCompactPokemonRepository(
  dataProvider: RepositoryDataProvider,
): Repository<CompactPokemon> {
  return createReadOnlyRepository<CompactPokemon>({
    id: 'pokemon-compact',
    resourcePath: 'data/pokemon-compact.min.json',
    schema: pokemonCompactSchema,
    dataProvider: dataProvider,
  })
}

export function createCompactPokemonSearchEngine(
  repository: Repository<CompactPokemon>,
): SearchEngine<CompactPokemon> {
  return createSearchEngine<CompactPokemon>(
    repository,
    createSearchIndex(),
    pokemonSearchIndexHydrator,
  )
}

export function createPlaceholderPokemon(): Pokemon {
  return {
    id: 'unknown',
    nid: '0000-unknown',
    dexNum: 0,
    formId: null,
    name: 'Untitled',
    psName: 'unknown',
    formName: null,
    region: PKM_LATEST_REGION,
    generation: PKM_LATEST_GENERATION,
    type1: 'normal',
    type2: null,
    color: 'white',
    abilities: {
      primary: 'pressure',
      secondary: null,
      hidden: null,
    },
    isDefault: true,
    isForm: false,
    isLegendary: false,
    isMythical: false,
    isUltraBeast: false,
    ultraBeastCode: null,
    isSpecialAbilityForm: false,
    isCosmeticForm: false,
    isFemaleForm: false,
    hasGenderDifferences: false,
    isBattleOnlyForm: false,
    isSwitchableForm: false,
    isFusion: false,
    fusedWith: null,
    isMega: false,
    isPrimal: false,
    isGmax: false,
    isRegional: false,
    canGmax: false,
    canDynamax: false,
    canBeAlpha: false,
    debutIn: PKM_LATEST_GAMESET,
    obtainableIn: [],
    versionExclusiveIn: [],
    eventOnlyIn: [],
    storableIn: [],
    shinyReleased: false,
    shinyBase: null,
    baseStats: {
      hp: 0,
      atk: 0,
      def: 0,
      spa: 0,
      spd: 0,
      spe: 0,
    },
    weight: 0,
    height: 0,
    baseSpecies: null,
    baseForms: [],
    forms: [],
    evolvesFrom: null,
    family: null,
    refs: {
      smogon: 'unknown',
      showdown: 'unknown',
      serebii: 'unknown',
      bulbapedia: 'unknown',
    },
  }
}

export function isPlaceholderPokemon(pkm: Pokemon): boolean {
  return pkm.id === 'unknown'
}
