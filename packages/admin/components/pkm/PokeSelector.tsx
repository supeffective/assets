'use client'

import React from 'react'

import { Pokemon } from '@pkg/datalayer/schemas/pokemon'

import { PokeGrid } from '@/components/pkm/PokeGrid'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

export function PokeSelector({
  children,
  pokemon,
  onSelect,
}: {
  children: React.ReactNode
  pokemon: Pokemon[]
  onSelect?: (pkm: Pokemon) => void
}): JSX.Element {
  const [open, setOpen] = React.useState(false)
  const onPkmClick = (pkm: Pokemon) => {
    if (onSelect) {
      onSelect(pkm)
    }
    console.log('selected: ', pkm)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Pokémon</DialogTitle>
        </DialogHeader>
        <ScrollArea className="w-full h-auto max-h-[60vh] mt-4">
          <PokeGrid searchable pokemon={pokemon} withNames onPkmClick={onPkmClick} />
        </ScrollArea>
        {/* <DialogFooter>
          <Button type="button">Confirm</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}
