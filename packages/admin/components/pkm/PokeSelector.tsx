'use client'

import React from 'react'

import { Pokemon } from '@pkg/datalayer/schemas/pokemon'
import { cn } from '@pkg/utils/lib/styling/classNames'

import { PokeGrid } from '@/components/pkm/PokeGrid'
import { Button } from '@/components/primitives/controls/Button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

export type PokemonPlacehoder = {
  id: 'unknown'
  nid: '0000-unknown'
  dexNum: 0
}

const placeholder: PokemonPlacehoder = {
  id: 'unknown',
  nid: '0000-unknown',
  dexNum: 0,
}

export function PokeSelector({
  children,
  pokemon,
  onSelect,
  maxSelection = 1,
  uniqueSelection,
}: {
  children: React.ReactNode
  pokemon: Pokemon[]
  onSelect?: (pkm: Pokemon[]) => void
  maxSelection?: number
  uniqueSelection?: boolean
}): JSX.Element {
  const [open, setOpen] = React.useState(false)

  const selectAndClose = (pokes: Pokemon[]) => {
    onSelect?.(pokes)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <PokeSelectorContent
          pokemon={pokemon}
          onSelect={selectAndClose}
          maxSelection={maxSelection}
          uniqueSelection={uniqueSelection}
        />
      </DialogContent>
    </Dialog>
  )
}

function PokeSelectorContent({
  pokemon,
  onSelect,
  maxSelection,
  uniqueSelection,
}: {
  pokemon: Pokemon[]
  onSelect?: (pkm: Pokemon[]) => void
  maxSelection: number
  uniqueSelection?: boolean
}): JSX.Element {
  const [selectedPokes, setSelectedPokes] = React.useState<Pokemon[]>([])

  const onPkmClick = (pkm: Pokemon) => {
    if (selectedPokes.length > maxSelection) {
      return
    }
    const newPoke = { ...pkm }
    if (maxSelection > 1) {
      setSelectedPokes(prev => [...prev, newPoke])
    } else {
      triggerOnSelect([newPoke])
    }
  }

  const triggerOnSelect = (pokes: Pokemon[]) => {
    onSelect?.(pokes)
  }

  const handleSelectionChange = (pokes: Pokemon[]) => {
    setSelectedPokes(pokes)
  }

  const handleConfirmClick = () => {
    triggerOnSelect(selectedPokes)
  }

  const selectablePokes = uniqueSelection
    ? pokemon.filter(pkm => !selectedPokes.includes(pkm))
    : pokemon

  const maxSelectionClass = cn([
    selectedPokes.length >= maxSelection,
    'opacity-50 pointer-events-none cursor-not-allowed',
  ])

  return (
    <>
      <DialogHeader>
        <DialogTitle>Select a Pokémon</DialogTitle>
      </DialogHeader>
      <ScrollArea className="w-full h-auto max-h-[40vh] mt-4">
        <PokeGrid
          className={maxSelectionClass}
          searchable
          pokemon={selectablePokes}
          withNames
          onPkmClick={onPkmClick}
        />
      </ScrollArea>
      {maxSelection > 1 && (
        <>
          <div>Selection:</div>
          <ScrollArea className="w-full h-auto max-h-[20vh] mt-4">
            <PokeGrid
              canRemove
              sortable
              pokemon={selectedPokes}
              max={maxSelection}
              withNames
              onPkmClick={() => {}}
              onChange={handleSelectionChange}
            />
          </ScrollArea>
        </>
      )}
      {maxSelection > 1 && (
        <DialogFooter>
          <Button type="button" onClick={handleConfirmClick}>
            Confirm Selection
          </Button>
        </DialogFooter>
      )}
    </>
  )
}
