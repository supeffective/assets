'use client'

import { useState } from 'react'

import { getGames, getManyGames } from '@pkg/datalayer/repositories/games'
import { getGameSets, getManyGameSets } from '@pkg/datalayer/repositories/gamesets'
import { Game } from '@pkg/datalayer/schemas/games'
import { GameSet } from '@pkg/datalayer/schemas/gamesets'
import { Pokemon } from '@pkg/datalayer/schemas/pokemon'

import { GameGrid } from '@/components/pkm/GameGrid'
import { GameSetGrid } from '@/components/pkm/GameSetGrid'
import { Flex } from '@/components/primitives/boxes/Flex'

export function PokemonGameSetEditor({
  pkm: pokemon,
  onChange,
}: {
  pkm: Pokemon
  onChange?: (pkm: Pokemon) => void
}) {
  const [pkm, setPkm] = useState<Pokemon>(pokemon)
  function handleGameSetsSelection(rows: GameSet[], field: keyof Pokemon) {
    const ids = rows.map(row => row.id)
    ;(pkm as any)[field] = getGameSets()
      .filter(game => ids.includes(game.id))
      .map(game => game.id)
    setPkm({ ...pkm })
    if (onChange) {
      onChange(pkm)
    }
  }

  function handleGamesSelection(rows: Game[], field: keyof Pokemon) {
    const ids = rows.map(row => row.id)
    ;(pkm as any)[field] = getGames()
      .filter(game => ids.includes(game.id))
      .map(game => game.id)
    setPkm({ ...pkm })
    if (onChange) {
      onChange(pkm)
    }
  }

  return (
    <>
      <div className="mb-10">
        <h4 className="text-xl font-bold mb-4">Obtainable In</h4>
        <Flex>
          <GameSetGrid
            editable
            onChange={(list: GameSet[]) => handleGameSetsSelection(list, 'obtainableIn')}
            selectableItems={getGameSets()}
            withNames
            items={getManyGameSets(pkm.obtainableIn)}
          />
          {(pkm.obtainableIn || []).map((row, i) => {
            return (
              <input
                type="hidden"
                name={`obtainableIn[${i}]`}
                value={row}
                key={`obtainableIn.${row}.${i}`}
              />
            )
          })}
          {(!pkm.obtainableIn || pkm.obtainableIn?.length === 0) && (
            <input type="hidden" name="obtainableIn[]" value="" />
          )}
        </Flex>
      </div>
      <div className="mb-10">
        <h4 className="text-xl font-bold mb-4">Storable In</h4>
        <Flex>
          <GameSetGrid
            editable
            onChange={(list: GameSet[]) => handleGameSetsSelection(list, 'storableIn')}
            selectableItems={getGameSets()}
            withNames
            items={getManyGameSets(pkm.storableIn)}
          />
          {(pkm.storableIn || []).map((row, i) => {
            return (
              <input
                type="hidden"
                name={`storableIn[${i}]`}
                value={row}
                key={`storableIn.${row}.${i}`}
              />
            )
          })}
          {(!pkm.storableIn || pkm.storableIn?.length === 0) && (
            <input type="hidden" name="storableIn[]" value="" />
          )}
        </Flex>
      </div>
      <div className="mb-10">
        <h4 className="text-xl font-bold mb-4">Version Exclusive In</h4>
        <Flex>
          <GameGrid
            editable
            onChange={(list: Game[]) => handleGamesSelection(list, 'versionExclusiveIn')}
            selectableItems={getGames()}
            withNames
            items={getManyGames(pkm.versionExclusiveIn)}
          />
          {(pkm.versionExclusiveIn || []).map((row, i) => {
            return (
              <input
                type="hidden"
                name={`versionExclusiveIn[${i}]`}
                value={row}
                key={`versionExclusiveIn.${row}.${i}`}
              />
            )
          })}
          {(!pkm.versionExclusiveIn || pkm.versionExclusiveIn?.length === 0) && (
            <input type="hidden" name="versionExclusiveIn[]" value="" />
          )}
        </Flex>
      </div>
      <div className="mb-10">
        <h4 className="text-xl font-bold mb-4">Event Only In</h4>
        <Flex>
          <GameSetGrid
            editable
            onChange={(list: GameSet[]) => handleGameSetsSelection(list, 'eventOnlyIn')}
            selectableItems={getGameSets()}
            withNames
            items={getManyGameSets(pkm.eventOnlyIn)}
          />
          {(pkm.eventOnlyIn || []).map((row, i) => {
            return (
              <input
                type="hidden"
                name={`eventOnlyIn[${i}]`}
                value={row}
                key={`eventOnlyIn.${row}.${i}`}
              />
            )
          })}
          {(!pkm.eventOnlyIn || pkm.eventOnlyIn?.length === 0) && (
            <input type="hidden" name="eventOnlyIn[]" value="" />
          )}
        </Flex>
      </div>
    </>
  )
}
