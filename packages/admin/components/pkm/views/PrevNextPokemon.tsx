'use client'

import { useEffect, useState } from 'react'
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from 'lucide-react'

import {
  getAllPokemon,
  getPokemonOrFail,
  getPreviousAndNextPokemon,
} from '@pkg/datalayer/repositories/pokemon'

import { PokeSprite } from '@/components/pkm/PokeSprite'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Sprite } from '@/components/primitives/boxes/Sprite'
import { Title } from '@/components/primitives/typography/Title'
import { Routes } from '@/lib/Routes'

export function PrevNextPokemon({ id }: { id: string }) {
  const allPkm = getAllPokemon()
  const cursors = getPreviousAndNextPokemon(allPkm, id)
  const pkm = getPokemonOrFail(id)
  const [hash, setHash] = useState<string>('')

  useEffect(() => {
    setHash(window.location.hash)

    const handleHashChange = () => {
      setHash(window.location.hash)
    }
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <Flex className="max-w-5xl mx-aut items-center p-2 justify-between">
      {cursors.prev ? (
        <a
          href={`${Routes.Pokemon}/${cursors.prev.id}/edit${hash}`}
          className={
            'inline-flex items-center justify-start gap-2 hover:text-nxt-acc2 p-2 hover:scale-125 transition-transform duration-200'
          }
        >
          <ArrowLeftCircleIcon />
          <Sprite size={48} className="align-top -mt-1">
            <PokeSprite id={cursors.prev.id} />
          </Sprite>
        </a>
      ) : (
        <span />
      )}
      <Title className="flex items-end gap-2">
        {pkm.name}
        <Sprite size={92} className="align-baseline">
          <PokeSprite id={id} />
        </Sprite>
      </Title>
      {cursors.next ? (
        <a
          href={`${Routes.Pokemon}/${cursors.next.id}/edit${hash}`}
          className={
            'inline-flex items-center justify-end text-right gap-2 hover:text-nxt-acc2 p-2 hover:scale-125 transition-transform duration-200'
          }
        >
          <Sprite size={48} className="align-top -mt-1">
            <PokeSprite id={cursors.next.id} />
          </Sprite>
          <ArrowRightCircleIcon />
        </a>
      ) : (
        <span />
      )}
    </Flex>
  )
}
