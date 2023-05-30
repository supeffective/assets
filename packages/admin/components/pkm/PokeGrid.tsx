'use client'

import { useEffect, useState } from 'react'
import { PlusIcon, TrashIcon } from 'lucide-react'

import { Pokemon } from '@pkg/datalayer/schemas/pokemon'
import { cn } from '@pkg/utils/lib/styling/classNames'

import { PokeSelector } from '@/components/pkm/PokeSelector'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Button } from '@/components/primitives/controls/Button'
import { Input } from '@/components/primitives/controls/Input'
import { useDebounce } from '@/hooks/useDebounce'
import { Routes } from '@/lib/Routes'

type PokeGridProps = {
  pokemon: Pokemon[]
  withNames?: boolean
  searchable?: boolean
  sortable?: boolean
  addLabel?: string
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

export function PokeGrid({
  pokemon,
  selectablePokemon,
  withNames,
  searchable,
  sortable,
  max = 0,
  editable,
  addLabel = '',
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
  const [results, setResults] = useState<Pokemon[]>(pokemon)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const debouncedSearchTerm: string = useDebounce<string>(searchTerm, debounceDelay)
  const canAddMore = max === 0 || results.length < max

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
    results.push(pkm)
    onChange?.(results)
  }

  function searchPokemon(searchTerms: string): Pokemon[] {
    return pokemon.filter(pkm => {
      const searchableText = `name:"${pkm.name}" id:${pkm.id} dex:${pkm.dexNum} 
      color:${pkm.color} type:${pkm.type1}:1 type:${pkm.type2}:2 region:${pkm.region}`.toLowerCase()

      const terms = searchTerms.toLowerCase().split(' ')
      const negativeTerms = terms.filter(term => term.startsWith('!'))
      const positiveTerms = terms.filter(term => !term.startsWith('!'))

      const negativeMatches = negativeTerms.filter(term => searchableText.includes(term.slice(1)))
      const positiveMatches = positiveTerms.filter(term => searchableText.includes(term))

      return negativeMatches.length === 0 && positiveMatches.length === positiveTerms.length
    })
  }

  function _removeResultByIndex(index: number) {
    const _results = [...results]
    _results.splice(index, 1)
    setResults(_results)
    onChange?.(_results)
  }

  useEffect(() => {
    setResults(pokemon)
  }, [pokemon])

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        setIsSearching(true)
        const _results = searchPokemon(debouncedSearchTerm)
        setIsSearching(false)
        setResults(_results)
      } else {
        setResults(pokemon)
        setIsSearching(false)
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  )

  function _renderResult(pkm: Pokemon, index: number) {
    const _className = cn(spriteWrapperCn, 'group relative')
    const spriteBlock = (
      <span className={spriteWrapperCn}>
        <i className={`${spriteCn} pkm pkm-${pkm.id}`} />
      </span>
    )
    const nameBlock = withNames && <span className="block font-mono select-none">{pkm.name}</span>
    const deleteBtn = (
      <Button
        title="Delete"
        className="hidden group-hover:inline absolute top-0 right-0 text-white bg-red-700 hover:bg-red-800 text-xs p-2"
        onClick={() => _removeResultByIndex(index)}
      >
        <TrashIcon size={16} />
      </Button>
    )

    if (editable) {
      return (
        <span
          key={`${pkm.id}-${index}`}
          className={_className}
          title={pkm.name}
          onClick={e => handlePkmClick(e, pkm)}
        >
          {spriteBlock}
          {nameBlock}
          {deleteBtn}
        </span>
      )
    }

    return (
      <a
        key={`${pkm.id}-${index}`}
        className={_className}
        title={pkm.name}
        href={`${Routes.Pokemon}/${pkm.id}/edit`}
        onClick={e => handlePkmClick(e, pkm)}
      >
        {spriteBlock}
        {nameBlock}
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
      <div className="grid grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 grid-flow-dense gap-2 text-center items-start">
        {_renderResults()}
      </div>
    </div>
  )
}
