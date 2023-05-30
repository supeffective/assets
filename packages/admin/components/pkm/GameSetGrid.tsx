'use client'

import { useEffect, useState } from 'react'
import { PlusIcon, TrashIcon } from 'lucide-react'

import { cn } from '@pkg/utils/lib/styling/classNames'

import { GameSet } from '@/../datalayer/schemas/gamesets'
import { GameImg } from '@/components/pkm/GameImgFile'
import { GameSetSelector } from '@/components/pkm/GameSetSelector'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Button } from '@/components/primitives/controls/Button'
import { Input } from '@/components/primitives/controls/Input'
import { useDebounce } from '@/hooks/useDebounce'
import { Routes } from '@/lib/Routes'

type GameSetGridProps = {
  withNames?: boolean
  searchable?: boolean
  sortable?: boolean
  addLabel?: string
  max?: number
  items: GameSet[]
  onChange?: (items: GameSet[]) => void
  onItemClick?: (item: GameSet) => void
} & (
  | {
      editable?: never | undefined | false
      selectableItems?: undefined | never
    }
  | {
      editable: true
      selectableItems: Array<GameSet>
    }
)

export function GameSetGrid({
  items,
  selectableItems,
  withNames,
  searchable,
  sortable,
  max = 0,
  editable,
  addLabel = '',
  onChange,
  onItemClick,
}: GameSetGridProps) {
  const spriteWrapperCn = cn(
    'w-full min-w-12 text-xs text-nxt-w1 hover:text-nxt-w4 flex flex-col gap-2'
  )
  const spriteCn = cn(
    'w-full leading-none rounded-md',
    'bg-nxt-b4 flex items-center justify-center'
  )

  // search
  const debounceDelay = 800
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [results, setResults] = useState<any[]>(items)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const debouncedSearchTerm: string = useDebounce<string>(searchTerm, debounceDelay)
  const canAddMore = max === 0 || results.length < max

  // interactions
  const handleItemClick = (e: any, item: GameSet) => {
    if (!onItemClick) {
      return
    }
    onItemClick(item)

    e.preventDefault()

    return false
  }

  const handleOnItemSelect = (item: GameSet) => {
    results.push(item)
    onChange?.(results)
  }

  function searchItems(searchTerms: string): GameSet[] {
    return items.filter((item: GameSet) => {
      const searchableText =
        `name:${item.name} id:${item.id} superset:${item.superset}`.toLowerCase()

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
    setResults(items)
  }, [items])

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        setIsSearching(true)
        const _results = searchItems(debouncedSearchTerm)
        setIsSearching(false)
        setResults(_results)
      } else {
        setResults(items)
        setIsSearching(false)
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  )

  function _renderResult(item: GameSet, index: number) {
    const _className = cn(spriteWrapperCn, 'group relative')
    const spriteBlock = (
      <span className={spriteWrapperCn}>
        <GameImg id={item.id} isGameSet className={spriteCn} />
      </span>
    )
    const nameBlock = withNames && <span className="block font-mono select-none">{item.name}</span>
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
          key={`${item.id}-${index}`}
          className={_className}
          title={item.name}
          onClick={e => handleItemClick(e, item)}
        >
          {spriteBlock}
          {nameBlock}
          {deleteBtn}
        </span>
      )
    }

    return (
      <a
        key={`${item.id}-${index}`}
        className={_className}
        title={item.name}
        href={`${Routes.Games}/${item.id}/edit`}
        onClick={e => handleItemClick(e, item)}
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
      <GameSetSelector items={selectableItems} onSelect={handleOnItemSelect}>
        <span className={cn(spriteWrapperCn, 'focus-visible:ring-2 text-center items-center')}>
          <span className={spriteCn}>
            <PlusIcon />
          </span>
          {withNames && addLabel && <span className="font-mono select-none block">{addLabel}</span>}
        </span>
      </GameSetSelector>
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
    <>
      {searchable && (
        <Flex className="sticky top-0 bg-black z-10">
          <Input
            type="search"
            placeholder="Search..."
            onChange={(e: any) => setSearchTerm(e.target.value)}
          />
        </Flex>
      )}
      <div className="grid grid-cols-6 gap-4 text-center items-start">{_renderResults()}</div>
    </>
  )
}
