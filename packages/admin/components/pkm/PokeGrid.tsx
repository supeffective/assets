'use client'

import { useEffect, useState } from 'react'
import { PlusIcon, TrashIcon } from 'lucide-react'

import { Pokemon } from '@pkg/datalayer/schemas/pokemon'
import { cn } from '@pkg/utils/lib/styling/classNames'

import { PokeSelector } from '@/components/pkm/PokeSelector'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Grid } from '@/components/primitives/boxes/Grid'
import { Button } from '@/components/primitives/controls/Button'
import { Input } from '@/components/primitives/controls/Input'
import { useDebounce } from '@/hooks/useDebounce'
import { Routes } from '@/lib/Routes'

type PokeGridProps = {
  pokemon: Pokemon[]
  withNames?: boolean
  withDexNums?: boolean
  searchable?: boolean
  sortable?: boolean
  addLabel?: string
  size?: string
  max?: number
  onChange?: (pokemon: Pokemon[]) => void
  onPkmClick?: (pkm: Pokemon) => void
} & (
  | {
      editable?: never | undefined | false
      selectablePokemon?: undefined | never
    }
  | {
      editable: true
      selectablePokemon: Pokemon[]
    }
)

type PokemonTuple = [Pokemon, number]

export function PokeGrid({
  pokemon,
  selectablePokemon,
  withNames,
  withDexNums,
  searchable,
  sortable,
  max = 0,
  editable,
  addLabel = '',
  size = '10ch',
  onChange,
  onPkmClick,
}: PokeGridProps) {
  const spriteWrapperCn = cn(
    'w-full min-w-[3rem] text-xs text-nxt-w1 hover:text-nxt-w4 flex flex-col gap-2'
  )
  const spriteCn = cn(
    'w-full aspect-square leading-none rounded-full',
    'bg-nxt-b4 flex items-center justify-center'
  )

  // search
  const debounceDelay = 800
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [pokemonList, setPokemonList] = useState<Pokemon[]>(pokemon)
  const [results, setResults] = useState<number[]>(pokemonList.map((_, idx) => idx))
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const debouncedSearchTerm: string = useDebounce<string>(searchTerm, debounceDelay)
  const canAddMore = max === 0 || results.length < max

  const getPokemonListIndices = () => pokemonList.map((_, idx) => idx)

  // interactions
  const handlePkmClick = (e: any, pkm: Pokemon) => {
    if (!onPkmClick) {
      return
    }
    onPkmClick(pkm)

    e.preventDefault()

    return false
  }

  const handleOnPkmSelect = (pkm: Pokemon) => {
    const newPokemonList = [...pokemonList, pkm]
    setPokemonList(newPokemonList)
    onChange?.(newPokemonList)
  }

  function searchPokemon(searchTerms: string): number[] {
    return pokemonList
      .map((pkm, idx): [Pokemon, number] => [pkm, idx])
      .filter(data => {
        const [pkm] = data
        const searchableText = `name:"${pkm.name}" id:${pkm.id} dex:${pkm.dexNum} 
      color:${pkm.color} type:${pkm.type1}:1 type:${pkm.type2}:2 region:${pkm.region}
      gen${pkm.generation} gen:${pkm.generation} generation:${pkm.generation}`.toLowerCase()

        const terms = searchTerms.toLowerCase().split(' ')
        const negativeTerms = terms.filter(term => term.startsWith('!'))
        const positiveTerms = terms.filter(term => !term.startsWith('!'))

        const negativeMatches = negativeTerms.filter(term => searchableText.includes(term.slice(1)))
        const positiveMatches = positiveTerms.filter(term => searchableText.includes(term))

        return negativeMatches.length === 0 && positiveMatches.length === positiveTerms.length
      })
      .map(([, idx]) => idx)
  }

  function _removePokeByIndex(listIndex: number) {
    const _pokemonList = [...pokemonList]
    _pokemonList.splice(listIndex, 1)
    setPokemonList(_pokemonList)
    setResults(results.filter(idx => idx !== listIndex))
    onChange?.(_pokemonList)
  }

  useEffect(() => {
    setPokemonList(pokemon)
    setResults(pokemon.map((_, idx) => idx))
  }, [pokemon])

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        setIsSearching(true)
        const _resultIndices = searchPokemon(debouncedSearchTerm)
        setIsSearching(false)
        setResults(_resultIndices)
      } else {
        setResults(getPokemonListIndices())
        setIsSearching(false)
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  )

  function _renderResult(listIndex: number) {
    const pkm = pokemonList[listIndex]
    if (!pkm) {
      throw new Error(`Pokemon not found at index ${listIndex}`)
    }
    const _className = cn(spriteWrapperCn, 'group relative')
    const spriteBlock = (
      <span className={spriteWrapperCn}>
        <i className={`${spriteCn} pkm pkm-${pkm.id}`} />
      </span>
    )
    const dexNumBlock = withDexNums && (
      <span className="block font-mono select-none text-[10px]">
        #{String(pkm.dexNum).padStart(4, '0')}
      </span>
    )
    const nameBlock = withNames && <span className="block font-mono select-none">{pkm.name}</span>
    const deleteBtn = (
      <Button
        title="Delete"
        className="hidden group-hover:inline absolute top-0 right-0 text-white bg-red-700 hover:bg-red-800 text-xs p-2"
        onClick={() => _removePokeByIndex(listIndex)}
      >
        <TrashIcon size={16} />
      </Button>
    )

    if (editable) {
      return (
        <span
          key={`${pkm.id}-${listIndex}`}
          className={_className}
          title={pkm.name}
          onClick={e => handlePkmClick(e, pkm)}
        >
          {spriteBlock}
          <span className="mb-2">
            {dexNumBlock}
            {nameBlock}
          </span>
          {deleteBtn}
        </span>
      )
    }

    return (
      <a
        key={`${pkm.id}-${listIndex}`}
        className={_className}
        title={pkm.name}
        href={`${Routes.Pokemon}/${pkm.id}/edit`}
        onClick={e => handlePkmClick(e, pkm)}
      >
        {spriteBlock}
        <span className="mb-2">
          {dexNumBlock}
          {nameBlock}
        </span>
      </a>
    )
  }

  function _renderAddButton() {
    if (!editable || !canAddMore) {
      return null
    }

    return (
      <PokeSelector pokemon={selectablePokemon} onSelect={handleOnPkmSelect}>
        <span className={cn(spriteWrapperCn, 'focus-visible:ring-2 text-center items-center')}>
          <span className={spriteCn}>
            <PlusIcon />
          </span>
          {withNames && addLabel && <span className="font-mono select-none block">{addLabel}</span>}
        </span>
      </PokeSelector>
    )
  }

  function _renderResults() {
    if (isSearching) {
      return <div>Searching ...</div>
    }
    if (results.length === 0 && debouncedSearchTerm) {
      return <div>0 results</div>
    }

    return (
      <>
        {results.map(_renderResult)}
        {_renderAddButton()}
      </>
    )
  }

  return (
    <div className="z-0">
      {searchable && (
        <Flex className="sticky top-0 bg-black z-10">
          <Input
            type="search"
            placeholder="Search..."
            onChange={(e: any) => setSearchTerm(e.target.value)}
          />
        </Flex>
      )}
      <Grid className="grid-flow-dense gap-2 text-center items-start" minColWidth={size}>
        {_renderResults()}
      </Grid>
    </div>
  )
}
