'use client'

import { useTransition } from 'react'

import {
  getAllPokemon,
  getExclusivePokemonForGame,
  getPokemonForGameSet,
} from '@pkg/datalayer/repositories/pokemon'
import { GameSet } from '@pkg/datalayer/schemas/gamesets'
import { Pokemon } from '@pkg/datalayer/schemas/pokemon'

import { updatePokemonOnGameSetAction } from '@/actions/updateManyPokemonActions'
import { GameIconImgFile as RecordImgFile } from '@/components/pkm/GameIconImgFile'
import { PokeGrid } from '@/components/pkm/PokeGrid'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Title } from '@/components/primitives/typography/Title'

const allPokes = getAllPokemon()

export default function GameSetEditor({ gameSet }: { gameSet: GameSet }) {
  let [isTransitionPending, startTransition] = useTransition()
  const gameIds = Object.keys(gameSet.games)
  const games = Object.entries(gameSet.games)
  const pokes = getPokemonForGameSet(gameSet.id)

  const counters = {
    obtainable: {
      species: pokes.obtainable.filter(p => !p.isForm).length,
      forms: pokes.obtainable.filter(p => p.isForm).length,
      ids: new Set(pokes.obtainable.map(p => p.id)),
    },
    storable: {
      species: pokes.storable.filter(p => !p.isForm).length,
      forms: pokes.storable.filter(p => p.isForm).length,
      ids: new Set(pokes.storable.map(p => p.id)),
    },
    transferOnly: {
      species: pokes.transferOnly.filter(p => !p.isForm).length,
      forms: pokes.transferOnly.filter(p => p.isForm).length,
      ids: new Set(pokes.transferOnly.map(p => p.id)),
    },
    eventOnly: {
      species: pokes.eventOnly.filter(p => !p.isForm).length,
      forms: pokes.eventOnly.filter(p => p.isForm).length,
      ids: new Set(pokes.eventOnly.map(p => p.id)),
    },
  }

  function handleGameSetField(rows: Pokemon[], field: keyof Pokemon) {
    const pokemonIds = rows.map(row => row.id)
    startTransition(async () => await updatePokemonOnGameSetAction(gameSet.id, pokemonIds, field))
  }

  function handleGameField(gameId: string, rows: Pokemon[], field: keyof Pokemon) {}

  return (
    <>
      <Title level={2} size={'2xl'}>
        {gameSet.name}
      </Title>
      <Flex vertical className={'inline-flex w-auto p-4 rounded-lg bg-nxt-b4/90'}>
        <Flex className="group">
          <RecordImgFile id={gameSet.id} style={{ zIndex: gameIds.length + 1 }} />
          {gameIds
            .filter(gameId => gameId !== gameSet.id)
            .map((gameId, idx) => {
              return (
                <RecordImgFile
                  key={`${gameSet.id}-${gameId}`}
                  id={gameId}
                  className="-ml-12 hover:-ml-4 transition-all duration-300 ease-in-out group-hover:-ml-4"
                  style={{ zIndex: gameIds.length - idx }}
                />
              )
            })}
        </Flex>
        <div className="flex-1">
          <div className="text-sm text-nxt-w1 font-mono uppercase">
            Superset: {gameSet.superset}
          </div>
          <div className="text-lg font-bold text-nxt-w2">{gameSet.name}</div>
        </div>
        <div className="flex-1">
          <div className="text-sm text-nxt-w1 font-mono uppercase">Storage</div>
          <div className="text-sm text-nxt-w2 font-mono">
            <span className="w-36 inline-block">Boxes: </span>
            <span>{gameSet.storage.boxes}</span>
          </div>
          <div className="text-sm text-nxt-w2 font-mono">
            <span className="w-36 inline-block">Box Capacity:</span>
            <span>{gameSet.storage.boxCapacity}</span>
          </div>
        </div>
      </Flex>
      <Title level={1} size={'2xl'}>
        Pokémon Availability
      </Title>
      <Flex gap={4} vertical>
        <div className="flex-1">
          <Title level={2} size={'xl'}>
            Obtainable In-Game
          </Title>
          <div className="p-2 rounded-lg bg-nxt-g1">
            <div className="p-2 text-center text-sm">
              {counters.obtainable.species} Pokémon & {counters.obtainable.forms} forms
            </div>
            {!isTransitionPending && (
              <PokeGrid
                size={'7ch'}
                withNames
                withDexNums
                searchable
                pokemon={pokes.obtainable}
                selectablePokemon={allPokes.filter(p => !counters.obtainable.ids.has(p.id))}
                editable
                onChange={rows => handleGameSetField(rows, 'obtainableIn')}
              />
            )}
          </div>
        </div>
        <hr className="border-b border-b-nxt-g1 my-4 border-dashed" />
        <div className="flex-1">
          <Title level={2} size={'xl'}>
            Storable in Boxes
          </Title>
          <div className="p-2 rounded-lg bg-nxt-g1">
            <div className="p-2 text-center text-sm">
              {counters.storable.species} Pokémon & {counters.storable.forms} forms
            </div>
            {!isTransitionPending && (
              <PokeGrid
                size={'7ch'}
                withNames
                withDexNums
                searchable
                pokemon={pokes.storable}
                selectablePokemon={allPokes.filter(
                  p => !counters.storable.ids.has(p.id) && !p.isBattleOnlyForm
                )}
                editable
                onChange={rows => handleGameSetField(rows, 'storableIn')}
              />
            )}
          </div>
        </div>
        <hr className="border-b border-b-nxt-g1 my-4 border-dashed" />
        <div className="flex-1">
          <Title level={2} size={'xl'}>
            Transfer Only
          </Title>
          <div className="p-2 rounded-lg bg-nxt-g1">
            <div className="p-2 text-center text-sm">
              {counters.transferOnly.species} Pokémon & {counters.transferOnly.forms} forms
            </div>
            {!isTransitionPending && (
              <PokeGrid
                size={'7ch'}
                withNames
                withDexNums
                searchable
                pokemon={pokes.transferOnly}
              />
            )}
          </div>
        </div>
        <hr className="border-b border-b-nxt-g1 my-4 border-dashed" />
        {games.map(([gameId, game], idx) => {
          const exclusive = getExclusivePokemonForGame(gameId)

          return (
            <div key={`game-${gameSet.id}-${gameId}`}>
              <div className="flex-1">
                <Title level={2} size={'xl'}>
                  Exclusive to {game}
                </Title>
                <div className="p-2 rounded-lg bg-nxt-g1">
                  <div className="p-2 text-center text-sm">{exclusive.length} Pokémon or forms</div>
                  {!isTransitionPending && <PokeGrid withNames withDexNums pokemon={exclusive} />}
                </div>
              </div>
              <hr className="border-b border-b-nxt-g1 my-4 border-dashed" />
            </div>
          )
        })}
        <div className="flex-1">
          <Title level={2} size={'xl'}>
            Event Only
          </Title>
          <div className="p-2 rounded-lg bg-nxt-g1">
            <div className="p-2 text-center text-sm">
              {counters.eventOnly.species} Pokémon & {counters.eventOnly.forms} forms
            </div>
            {!isTransitionPending && <PokeGrid withNames withDexNums pokemon={pokes.eventOnly} />}
          </div>
        </div>
      </Flex>
    </>
  )
}
