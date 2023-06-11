'use client'

import { HTMLProps, useEffect, useRef, useState } from 'react'
import { PlusIcon, TrashIcon } from 'lucide-react'

import { createPlaceholderPokemon, isPlaceholderPokemon } from '@pkg/datalayer/repositories/pokemon'
import { Pokemon } from '@pkg/datalayer/schemas/pokemon'
import { cn } from '@pkg/utils/lib/styling/classNames'

import { PokeSelector } from '@/components/pkm/PokeSelector'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Grid, GridProps } from '@/components/primitives/boxes/Grid'
import { Button } from '@/components/primitives/controls/Button'
import { Input } from '@/components/primitives/controls/Input'
import { useDebounce } from '@/hooks/useDebounce'
import { Routes } from '@/lib/Routes'

// TODO refactor DnD into a separate component called DndGrid and FixedDndGrid
// TODO refactor into PokeGrid and FixedPokeGrid (for boxes DnD mode)

type PokemonList = Array<Pokemon>
type NullablePokemonList = Array<Pokemon | null>
type DragEvent = React.DragEvent<HTMLElement>
type PokeGridProps = {
  className?: string
  cols?: GridProps['repeat']
  boxMode?: boolean
  withNames?: boolean
  withDexNums?: boolean
  incrementalDexNums?: boolean
  searchable?: boolean
  sortable?: boolean
  addLabel?: string
  canRemove?: boolean
  size?: string
  max?: number
} & (
  | {
      canAdd?: never | undefined | false
      canRepeat?: never | undefined | false
      selectablePokemon?: undefined | never
    }
  | {
      canAdd: true
      canRepeat?: boolean
      selectablePokemon: PokemonList
    }
) &
  (
    | {
        boxMode?: never | undefined | false
        pokemon: PokemonList
        onChange?: (pokemon: PokemonList) => void
        onPkmClick?: (pkm: Pokemon) => void
      }
    | {
        boxMode: true
        pokemon: NullablePokemonList
        onChange?: (pokemon: NullablePokemonList) => void
        onPkmClick?: (pkm: Pokemon | null) => void
      }
  )

function convertNullablePokemonList(
  boxSize: number,
  fillSpaces: boolean,
  pokemon: NullablePokemonList
): PokemonList {
  const newList = pokemon.map(pkm => pkm ?? createPlaceholderPokemon())

  if (fillSpaces) {
    while (newList.length < boxSize) {
      newList.push(createPlaceholderPokemon())
    }
  }

  return newList
}
export function PokeGrid({
  className,
  cols,
  boxMode,
  pokemon,
  selectablePokemon,
  withNames,
  withDexNums,
  incrementalDexNums,
  searchable,
  sortable,
  max = 0,
  canAdd,
  canRepeat,
  canRemove,
  addLabel = '',
  size = '10ch',
  onChange,
  onPkmClick,
}: PokeGridProps) {
  type PokesType = typeof pokemon
  type PokesTypeItem = PokesType[number]

  const spriteWrapperCn = cn(
    [sortable, 'cursor-move'],
    'w-full min-w-[3rem] text-xs text-nxt-w1 hover:text-nxt-w4 flex flex-col gap-2'
  )
  const spriteCn = cn(
    'w-full aspect-square leading-none rounded-full',
    'bg-nxt-b4 flex items-center justify-center'
  )

  // search
  const debounceDelay = 800
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [pokemonList, setPokemonList] = useState<PokemonList>(
    convertNullablePokemonList(max, boxMode === true, pokemon)
  )
  const [results, setResults] = useState<number[]>(pokemonList.map((_, idx) => idx))
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const debouncedSearchTerm: string = useDebounce<string>(searchTerm, debounceDelay)
  const canAddMore = max === 0 || results.length < max

  const [showDelBtn, setShowDelBtn] = useState<boolean>(true)

  // sorting with drag and drop:
  const draggedItem = useRef<number | null>(null)
  const [dropZoneIndex, setDropZoneIndex] = useState<number | null>(null)
  const [dragging, setDragging] = useState<boolean>(false)

  const setPokemonListAndResults = (newPokemonList: PokemonList) => {
    setPokemonList(oldList => {
      setResults(newPokemonList.map((_, idx) => idx))

      return newPokemonList
    })
  }

  const updatePokemonList = (newPokemonList: PokemonList) => {
    setPokemonListAndResults(newPokemonList)
    if (!boxMode) {
      onChange?.(newPokemonList)

      return
    }

    onChange?.(
      newPokemonList.map(pkm => {
        if (isPlaceholderPokemon(pkm)) {
          return null
        }

        return pkm
      })
    )
  }

  const handleDragStart = (event: DragEvent, item: Pokemon, itemIndex: number) => {
    // item starts being dragged
    event.dataTransfer.effectAllowed = 'all'
    draggedItem.current = itemIndex
    setShowDelBtn(false)
    setTimeout(() => {
      // avoid styles being applied to the dragged item
      setDragging(true)
    }, 1)
  }

  const handleDragOver = (event: DragEvent, targetItem: Pokemon, targetItemIndex: number) => {
    // item is dragged over the grid

    event.preventDefault()
    event.dataTransfer.dropEffect = 'link'

    if (!draggedItem.current) {
      return
    }

    if (targetItemIndex !== dropZoneIndex) {
      setDropZoneIndex(targetItemIndex)
    }

    // if (targetItemIndex !== dropZoneIndex) {
    //   const rearrangedItems = pokemonList.filter(item => item !== draggedItem.current)
    //   rearrangedItems.splice(targetItemIndex, 0, draggedItem.current)
    //   setDropZoneIndex(targetItemIndex)
    //   setPokemonListAndResults(rearrangedItems)
    // }
  }

  const handleDrop = (event: DragEvent, targetItem: Pokemon, targetItemIndex: number) => {
    event.preventDefault()

    if (!draggedItem.current) {
      return
    }

    //if (targetItemIndex !== dropZoneIndex) {
    const rearrangedItems = pokemonList.filter((item, idx) => idx !== draggedItem.current)
    rearrangedItems.splice(targetItemIndex, 0, pokemonList[draggedItem.current])
    updatePokemonList(rearrangedItems)
    //}

    setTimeout(() => {
      draggedItem.current = null
      setDropZoneIndex(null)
      setDragging(false)
      setShowDelBtn(true)
      //updatePokemonList(pokemonList)
    }, 10)
  }

  const handleDragCancel = (event: DragEvent, item: Pokemon, index: number) => {
    // item is dropped outside the grid or back to where it was ("onDragEnd")
    setTimeout(() => {
      draggedItem.current = null
      setDropZoneIndex(null)
      setDragging(false)
      setShowDelBtn(true)
    }, 10)
  }

  const handleDragLeave = (event: DragEvent, item: Pokemon, index: number) => {
    // item is dragged over an invalid drop zone
    // console.log('dragLeave')
    setDropZoneIndex(null)
    //setDragging(false)
  }

  const getPokemonListIndices = () => pokemonList.map((_, idx) => idx)

  // interactions
  const handlePkmClick = (e: any, pkm: Pokemon) => {
    if (!e.target?.classList.contains('pkm')) {
      return
    }

    if (boxMode && isPlaceholderPokemon(pkm)) {
      onPkmClick?.(null)
    } else {
      onPkmClick?.(pkm)
    }

    // e.stopPropagation()
    // e.preventDefault()

    // return false
  }

  const handleAppendPokemon = (pkm: PokemonList) => {
    const newPokemonList = [...pokemonList, ...pkm]
    updatePokemonList(newPokemonList)
  }

  const handleReplacePokemonAt = (pkm: PokemonList, atIndex: number) => {
    console.log('replace', pkm, atIndex)
    const newPokemonList = [...pokemonList]
    newPokemonList.splice(atIndex, 1, ...pkm)
    updatePokemonList(newPokemonList)
  }

  function searchPokemon(searchTerms: string): number[] {
    return pokemonList
      .filter(pkm => pkm)
      .map((pkm, idx): [Pokemon, number] => [pkm!, idx])
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

    if (boxMode) {
      const item = _pokemonList[listIndex]
      if (!isPlaceholderPokemon(item)) {
        _pokemonList[listIndex] = createPlaceholderPokemon()
        updatePokemonList(_pokemonList)
      } else {
        // TODO replace with Add button if canAdd
      }

      return
    }

    _pokemonList.splice(listIndex, 1)
    updatePokemonList(_pokemonList)
  }

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

  useEffect(() => {
    console.log('pokemon changed')
    setPokemonListAndResults(convertNullablePokemonList(max, boxMode === true, pokemon))
  }, [pokemon])

  let lastDexNum = 0

  function _renderResults() {
    if (isSearching) {
      return <div>Searching ...</div>
    }
    if (results.length === 0 && debouncedSearchTerm) {
      return <div>0 results</div>
    }

    return (
      <>
        {results.flatMap(_renderResult)}
        {_renderAddButtonCell()}
      </>
    )
  }

  function _resolveDexNum(pkm: Pokemon, listIndex: number) {
    if (!incrementalDexNums) {
      return pkm.dexNum
    }

    if (pkm.isForm) {
      return lastDexNum
    }

    lastDexNum++

    return lastDexNum
  }

  function _renderResult(listIndex: number) {
    const _pkm = pokemonList[listIndex]
    if (_pkm === undefined) {
      throw new Error(`Pokemon not found at index ${listIndex}`)
    }

    const pkm = _pkm === null ? createPlaceholderPokemon() : _pkm

    const dexNum = _resolveDexNum(pkm, listIndex)
    pkm.dexNum = dexNum

    function _renderActionButton(idx: number) {
      if (!showDelBtn) {
        return null
      }

      if (canRemove && !isPlaceholderPokemon(pkm)) {
        return (
          <Button
            title="Delete"
            className="hidden group-hover:inline absolute top-0 right-0 text-white bg-red-700 hover:bg-red-800 text-xs p-2"
            onClick={() => _removePokeByIndex(idx)}
          >
            <TrashIcon size={16} />
          </Button>
        )
      }

      if (!selectablePokemon || !boxMode) {
        return null
      }

      return (
        <div className="hidden group-hover:inline absolute top-0 right-0">
          <PokeSelector
            pokemon={selectablePokemon}
            maxSelection={1}
            uniqueSelection={true}
            onSelect={pokes => handleReplacePokemonAt(pokes, idx)}
          >
            <Button asSpan title="Add Pokémon" className="text-xs p-2">
              <PlusIcon size={16} />
            </Button>
          </PokeSelector>
        </div>
      )
    }

    const isBeingDragged = draggedItem.current === listIndex && dragging
    const itemClass = cn(spriteWrapperCn, 'group relative', [isBeingDragged, 'dragged opacity-50'])
    const spriteWrapperClass = cn(
      spriteWrapperCn,
      [dropZoneIndex === listIndex && dragging, 'border-nxt-acc3 border-l-2 border-dashed'],
      [isBeingDragged, 'outline-2 rounded-full outline-dashed outline-offset-0 outline-nxt-g4'],
      [dropZoneIndex === listIndex && isBeingDragged, 'outline-nxt-warn2']
    )
    const spriteClass = cn(spriteCn, `pkm pkm-${pkm.id}`, [isBeingDragged, '!bg-none !bg-nxt-b2'])

    const itemEditHref = `${Routes.Pokemon}/${pkm.id}/edit`

    const itemCommonProps: Omit<HTMLProps<HTMLElement>, 'ref'> = {
      className: itemClass,
      title: pkm.name,
      onClick: e => handlePkmClick(e, pkm),
    }

    const itemDraggableProps: Omit<HTMLProps<HTMLElement>, 'ref'> = sortable
      ? {
          draggable: true,
          onDragStart: e => handleDragStart(e, pkm, listIndex),
          onDragOver: e => handleDragOver(e, pkm, listIndex),
          onDragEnd: e => handleDragCancel(e, pkm, listIndex),
          onDragLeave: e => handleDragLeave(e, pkm, listIndex),
          onDrop: e => handleDrop(e, pkm, listIndex),
        }
      : {}

    const spriteBlock = (
      <span className={spriteWrapperClass}>
        <i className={`${spriteClass} pkm pkm-${pkm.id}`} />
      </span>
    )
    const dexNumBlock = withDexNums && !isBeingDragged && (
      <span className="block font-mono select-none text-[10px]">
        #{String(dexNum).padStart(4, '0')}
      </span>
    )
    const nameBlock = withNames && !isBeingDragged && (
      <span className="block font-mono select-none">{pkm.name}</span>
    )

    const itemContent = (
      <>
        {spriteBlock}
        <span className="mb-2">
          {dexNumBlock}
          {nameBlock}
        </span>
      </>
    )

    const renderableItems = []
    const hasActions = onPkmClick || canAdd || canRemove

    renderableItems.push(
      hasActions ? (
        <span key={`${pkm.id}-${listIndex}`} {...itemCommonProps} {...itemDraggableProps}>
          {itemContent}
          {_renderActionButton(listIndex)}
        </span>
      ) : (
        <a
          key={`${pkm.id}-${listIndex}`}
          {...itemCommonProps}
          {...itemDraggableProps}
          onClick={undefined}
          href={itemEditHref}
        >
          {itemContent}
        </a>
      )
    )

    return renderableItems
  }

  function _renderAddButtonCell() {
    if (!canAdd || !canAddMore) {
      return null
    }

    return (
      <PokeSelector
        pokemon={selectablePokemon}
        maxSelection={max ? max - pokemonList.length : 100}
        uniqueSelection={canRepeat !== true}
        onSelect={handleAppendPokemon}
      >
        <span className={cn(spriteWrapperCn, 'focus-visible:ring-2 text-center items-center')}>
          <span className={spriteCn}>
            <PlusIcon />
          </span>
          {withNames && addLabel && <span className="font-mono select-none block">{addLabel}</span>}
        </span>
      </PokeSelector>
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
      <Grid
        className={cn('grid-flow-dense gap-2 text-center items-start', className)}
        repeat={cols}
        minColWidth={size}
      >
        {_renderResults()}
      </Grid>
    </div>
  )
}
