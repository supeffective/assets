'use client'

import { ChangeEvent, useEffect, useState } from 'react'

import { getGameSets } from '@/../datalayer/repositories/gamesets'
import { getPokemonOrFail } from '@/../datalayer/repositories/pokemon'
import { BoxPreset, BoxPresetBox, BoxPresetBoxPokemon } from '@/../datalayer/schemas/box-presets'
import { GameSet } from '@/../datalayer/schemas/gamesets'
import { PokeImgFile } from '@/components/pkm/PokeImgFile'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Grid } from '@/components/primitives/boxes/Grid'
import { Select } from '@/components/primitives/controls/Select'

import { getBoxPresetsByGameSet } from '../../../../datalayer/repositories/box-presets'

const gameSets = getGameSets().reverse()

export function BoxPresetViewer() {
  const [currentGameSet, setCurrentGameSet] = useState(gameSets.length > 0 ? gameSets[0].id : null)
  const boxPresets = currentGameSet ? getBoxPresetsByGameSet(currentGameSet) : []
  const [currentPreset, setCurrentPreset] = useState(
    boxPresets.length > 0 ? boxPresets[0].id : null
  )
  const preset = currentPreset ? boxPresets.find(preset => preset.id === currentPreset) : null
  const gameSet = currentGameSet ? gameSets.find(gameSet => gameSet.id === currentGameSet) : null
  useEffect(() => {
    if (currentGameSet) {
      setCurrentPreset(getBoxPresetsByGameSet(currentGameSet)[0].id)
    }
  }, [currentGameSet])

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

  return (
    <>
      <Flex className="place-content-center content-center items-center flex-col xl:flex-row">
        <div style={{ minWidth: '30ch' }}>Select a game set and a preset:</div>
        <Select
          label="Game Set"
          options={gameSets}
          value={currentGameSet}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            setCurrentGameSet(e.target.value)
          }}
        />
        <Select
          label="Preset"
          options={boxPresets}
          value={currentPreset}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            setCurrentPreset(e.target.value)
          }}
        />
      </Flex>
      {_renderPreset(preset, gameSet)}
    </>
  )
}

function _renderPreset(preset: BoxPreset, gameSet: GameSet): JSX.Element {
  return (
    <>
      <Flex vertical>
        <div>Name: {preset.name}</div>
        <div>Description: {preset.description}</div>
        <div>Version: {preset.version}</div>

        <Grid minColWidth="440px" gap={4} className="p-0">
          {preset.boxes.map((box, i) => _renderPresetBox(gameSet, box, i))}
        </Grid>
      </Flex>
    </>
  )
}

function _renderPresetBox(gameSet: GameSet, box: BoxPresetBox, idx: number): JSX.Element {
  const cells = box.pokemon
  while (cells.length < gameSet.storage.boxCapacity) {
    cells.push(null)
  }

  return (
    <Flex vertical key={idx}>
      <div>{box.title || `Box ${idx + 1}`}</div>
      <Grid
        minColWidth="48px"
        repeat={6}
        className="p-3 rounded-md bg-nxt-teal1/20 border border-nxt-b4"
      >
        {box.pokemon.map(_renderPresetPokemon)}
      </Grid>
    </Flex>
  )
}

function _renderPresetPokemon(pkm: BoxPresetBoxPokemon, idx: number): JSX.Element {
  const pid = _parsePokemonID(pkm)
  const nid = pid ? getPokemonOrFail(pid).nid : null

  return (
    <div className="p-2 rounded-full bg-nxt-w4/20" key={idx}>
      <PokeImgFile nid={nid} variant="home3d-icon" />
    </div>
  )
}

function _parsePokemonID(pkm: BoxPresetBoxPokemon): string | null {
  if (typeof pkm === 'string') {
    return pkm
  }

  if (pkm === undefined || pkm === null) {
    return null
  }

  if (pkm.pid.endsWith('-f')) {
    return pkm.gmax ? `${pkm.pid.slice(0, -2)}-gmax` : pkm.pid
  }

  return pkm.gmax ? `${pkm.pid}-gmax` : pkm.pid
}
