'use client'

import React from 'react'

import { Game } from '@pkg/datalayer/schemas/games'

import { GameGrid } from '@/components/pkm/GameGrid'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

type GameSelectorProps = {
  children: React.ReactNode
  items: Game[]
  onSelect?: (item: Game) => void
}

export function GameSelector({ children, items, onSelect }: GameSelectorProps): JSX.Element {
  const [open, setOpen] = React.useState(false)
  const onItemClick = (item: Game) => {
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
          <GameGrid searchable items={items} withNames onItemClick={onItemClick} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
