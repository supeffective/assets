'use client'

import React from 'react'

import { GameSet } from '@pkg/datalayer/schemas/gamesets'

import { GameSetGrid } from '@/components/pkm/GameSetGrid'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

type GameSetSelectorProps = {
  children: React.ReactNode
  items: GameSet[]
  onSelect?: (item: GameSet) => void
}

export function GameSetSelector({ children, items, onSelect }: GameSetSelectorProps): JSX.Element {
  const [open, setOpen] = React.useState(false)
  const onItemClick = (item: GameSet) => {
    if (onSelect) {
      onSelect(item)
    }
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
          <GameSetGrid searchable items={items} withNames onItemClick={onItemClick} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
