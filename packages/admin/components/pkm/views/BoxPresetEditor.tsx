'use client'

import { useRef, useState, useTransition } from 'react'

import {
  flattenBoxes,
  getBoxPresetsByGameSet,
  parseBoxPokemonID,
  trimBoxNullsAtTheEnd,
} from '@pkg/datalayer/repositories/box-presets'
import { Pokemon } from '@pkg/datalayer/schemas/pokemon'

import { getGameSets } from '@/../datalayer/repositories/gamesets'
import { getAllPokemon, getPokemon } from '@/../datalayer/repositories/pokemon'
import { BoxPreset, BoxPresetBox, BoxPresetBoxPokemon } from '@/../datalayer/schemas/box-presets'
import { GameSet } from '@/../datalayer/schemas/gamesets'
import { updateBoxPresetAction, updateBoxPresetBoxAction } from '@/actions/updateBoxPresetActions'
import { PokeGrid } from '@/components/pkm/PokeGrid'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Grid } from '@/components/primitives/boxes/Grid'
import { ScrollArea } from '@/components/ui/scroll-area'

const gameSets = getGameSets()
const allPokes = getAllPokemon()

type BoxPresetEditorProps = {
  gameSetId: string
  presetId: string
}

export function BoxPresetEditor(props: BoxPresetEditorProps) {
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)
  const [isTransitionPending, startTransition] = useTransition()
  const [currentGameSet, _] = useState(props.gameSetId)
  const boxPresets = currentGameSet ? getBoxPresetsByGameSet(currentGameSet) : []
  const [currentPreset, setCurrentPreset] = useState(props.presetId)
  const preset = currentPreset ? boxPresets.find(preset => preset.id === currentPreset) : null
  const gameSet = currentGameSet ? gameSets.find(gameSet => gameSet.id === currentGameSet) : null

  if (!gameSet || !currentGameSet || gameSets.length === 0) {
    return <Flex className="place-content-center">No Game Sets found</Flex>
  }

  if (!preset || !currentPreset || boxPresets.length === 0) {
    return (
      <Flex className="place-content-center">
        No Presets found for game set: {currentGameSet.toUpperCase()}
      </Flex>
    )
  }

  const allBoxesPokemonIds = new Set(
    flattenBoxes(preset)
      .map(poke => parseBoxPokemonID(poke))
      .filter(Boolean),
  )

  const pokemonNotInBoxes = allPokes.filter(poke => !allBoxesPokemonIds.has(poke.id))

  function handleFlattenedBoxesChange(
    pokes: Array<Pokemon | null>,
    gameSet: GameSet,
    preset: BoxPreset,
  ) {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current)
    }
    const trimmedPokes = trimBoxNullsAtTheEnd(pokes).map(poke => (poke ? poke.id : null))
    saveTimeout.current = setTimeout(() => {
      startTransition(async () => await updateBoxPresetAction(gameSet.id, preset.id, trimmedPokes))
      console.log('Saving all preset boxes', preset.id)
      saveTimeout.current = null
    }, 1)
  }

  function handleBoxChange(
    pokes: Array<Pokemon | null>,
    gameSet: GameSet,
    preset: BoxPreset,
    box: BoxPresetBox,
    boxIndex: number,
  ) {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current)
    }
    const trimmedPokes = trimBoxNullsAtTheEnd(pokes).map(poke => (poke ? poke.id : null))
    const trimmedBox = { ...box, pokemon: trimmedPokes }
    saveTimeout.current = setTimeout(() => {
      startTransition(
        async () => await updateBoxPresetBoxAction(gameSet.id, preset.id, trimmedBox, boxIndex),
      )
      console.log('Saving preset box ' + boxIndex, preset.id)
      saveTimeout.current = null
    }, 1)
  }

  function _renderPreset(preset: BoxPreset, gameSet: GameSet): JSX.Element {
    while (preset.boxes.length < Math.min(gameSet.storage.boxes, 100)) {
      preset.boxes.push({ pokemon: [] })
    }

    const flattenedBoxesPokemon = flattenBoxes(preset)
    const pokes = _findPresetPokemon(flattenedBoxesPokemon)

    return (
      <>
        <Flex vertical>
          <div>Name: {preset.name}</div>
          <div>Description: {preset.description}</div>
          <div>Version: {preset.version}</div>
          <div>Boxes: {preset.boxes.length}</div>

          <Flex vertical className="flex-1 w-full hidden" gap={0}>
            <div className="font-bold rounded-lg rounded-b-none text-center p-3 py-4 bg-nxt-b4 border-nxt-g1 border border-b-0">
              All Boxes
            </div>
            <ScrollArea className="w-1/2 h-[33rem] mt-4 p-2 py-6 bg-nxt-w1 rounded-lg">
              <PokeGrid
                className="p-3 w-full rounded-lg rounded-t-none bg-nxt-b3/80 border border-nxt-g1"
                boxMode
                cols={6}
                size="24px"
                pokemon={pokes}
                max={gameSet.storage.boxCapacity}
                canAdd
                canRepeat
                canRemove
                sortable
                onChange={pokes => {
                  handleFlattenedBoxesChange(pokes, gameSet, preset)
                }}
                selectablePokemon={allPokes}
              />
            </ScrollArea>
          </Flex>

          <Grid minColWidth="440px" gap={4} className="p-0">
            {preset.boxes.map((box, i) => _renderPresetBox(gameSet, preset, box, i))}
          </Grid>
        </Flex>
      </>
    )
  }

  function _findPresetPokemon(pokemon: BoxPresetBoxPokemon[]): Array<Pokemon | null> {
    return pokemon.map(poke => {
      const pid = parseBoxPokemonID(poke)

      return pid ? getPokemon(pid) : null
    })
  }

  function _renderPresetBox(
    gameSet: GameSet,
    preset: BoxPreset,
    box: BoxPresetBox,
    idx: number,
  ): JSX.Element {
    const pokes = _findPresetPokemon(box.pokemon)

    return (
      <Flex vertical key={idx} gap={0}>
        <div className="font-bold rounded-lg rounded-b-none text-center p-3 py-4 bg-nxt-b4 border-nxt-g1 border border-b-0">
          {box.title || `Box ${idx + 1}`}
        </div>
        <PokeGrid
          className="p-3 rounded-lg rounded-t-none bg-nxt-b3/80 border border-nxt-g1"
          cols={gameSet.storage.boxCapacity === 20 ? 5 : 6}
          boxMode
          size="48px"
          max={gameSet.storage.boxCapacity}
          pokemon={pokes}
          canAdd
          canRepeat
          canRemove
          sortable
          withDexNums
          onChange={pokes => {
            handleBoxChange(pokes, gameSet, preset, box, idx)
          }}
          selectablePokemon={pokemonNotInBoxes}
        />
      </Flex>
    )
  }

  return <>{_renderPreset(preset, gameSet)}</>
}
