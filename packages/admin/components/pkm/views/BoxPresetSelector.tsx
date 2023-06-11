'use client'

import { ChangeEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

import { getBoxPresetsByGameSet } from '@pkg/datalayer/repositories/box-presets'

import { getGameSets } from '@/../datalayer/repositories/gamesets'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Button } from '@/components/primitives/controls/Button'
import { Select } from '@/components/primitives/controls/Select'
import { Routes } from '@/lib/Routes'

const gameSets = getGameSets()
const defaultGameSet = gameSets[0].id

export function BoxPresetSelector({
  selectedGameSetId,
  selectedPresetId,
}: {
  selectedGameSetId?: string
  selectedPresetId?: string
}) {
  const [currentGameSet, setCurrentGameSet] = useState(selectedGameSetId ?? defaultGameSet)
  const boxPresets = getBoxPresetsByGameSet(currentGameSet)

  const [currentPreset, setCurrentPreset] = useState(selectedPresetId ?? boxPresets[0].id)

  const router = useRouter()

  const isGoodToGo = currentGameSet && currentPreset

  function handleGoToEdit() {
    if (!isGoodToGo) {
      return
    }
    router.push(`${Routes.LegacyBoxPresets}/${currentGameSet}/${currentPreset}`)
  }

  return (
    <Flex className="place-content-center content-center items-center flex-col xl:flex-row">
      <div style={{ minWidth: '30ch' }}>Select a game set and a preset:</div>
      <Select
        label="Game Set"
        options={[...gameSets].reverse()}
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
      {isGoodToGo && <Button onClick={handleGoToEdit}>Go</Button>}
    </Flex>
  )
}
