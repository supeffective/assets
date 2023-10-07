'use client'

import { useEffect, useState, useTransition } from 'react'

import { getAllPokemon, getManyPokemon } from '@pkg/datalayer/repositories/pokemon'
import type { Pokedex, PokedexEntry } from '@pkg/datalayer/schemas/pokedexes'
import type { Pokemon } from '@pkg/datalayer/schemas/pokemon'

import { updatePokedexAction } from '@/actions/updatePokedexActions'
import { PokeGrid } from '@/components/pkm/PokeGrid'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Button } from '@/components/primitives/controls/Button'
import { Title } from '@/components/primitives/typography/Title'

const allPokes = getAllPokemon()

function _resolveDexNums(dexEntries: Pokemon[]) {
  let currentDexNum = 0
  const idsSet = new Set(dexEntries.map(e => e.id))

  return dexEntries.map(entry => {
    const shouldIncrement =
      entry.isForm === false ||
      // if it's a form, but it's the default species of the region
      (entry.isForm === true &&
        entry.baseForms.length === 0 &&
        entry.baseSpecies &&
        !idsSet.has(entry.baseSpecies))

    if (shouldIncrement) {
      currentDexNum++
    }

    return {
      ...entry,
      isForm: !shouldIncrement,
      dexNum: currentDexNum,
    }
  })
}

export default function PokedexEditor({ record }: { record: Pokedex }) {
  const [isTransitionPending, startTransition] = useTransition()

  const [dexEntries, setDexEntries] = useState<PokedexEntry[]>(record.entries)
  const dexEntriesMap = new Map(dexEntries.map(e => [e.id, e]))
  const pokes = _resolveDexNums(getManyPokemon(dexEntries.map(e => e.id)))
  const registrablePokes = pokes.filter(p => dexEntriesMap.get(p.id)?.dexNum !== undefined)
  const extraPokes = pokes.filter(p => dexEntriesMap.get(p.id)?.dexNum === undefined)

  function updateRegistrableDex(rows: Pokemon[]) {
    const allExtras: Pokemon[] = [] //dexEntries.filter(e => e.dexNum === undefined)

    const alteredRows = _resolveDexNums(rows)
    const allRegistrable = alteredRows.map((row): PokedexEntry => {
      // const existingEntry = dexEntriesMap.get(row.id)

      return {
        id: row.id,
        dexNum: row.dexNum,
        isForm: row.isForm,
      }
    })

    setDexEntries([...allRegistrable, ...allExtras])
  }

  function updateExtrasDex(rows: Pokemon[]) {
    const allRegistrable = dexEntries.filter(e => e.dexNum !== undefined)
    const allExtras = rows.map(
      (row): PokedexEntry => ({
        id: row.id,
        isForm: row.isForm,
      }),
    )

    setDexEntries([...allRegistrable, ...allExtras])
  }

  function saveDexEntries() {
    startTransition(async () => await updatePokedexAction(record.id, dexEntries))
    console.log(dexEntries)
  }

  const counters = {
    registrable: {
      species: registrablePokes.filter(p => !p.isForm).length,
      forms: registrablePokes.filter(p => p.isForm).length,
      ids: new Set(registrablePokes.map(p => p.id)),
    },
    extras: {
      species: extraPokes.filter(p => !p.isForm).length,
      forms: extraPokes.filter(p => p.isForm).length,
      ids: new Set(extraPokes.map(p => p.id)),
    },
  }

  useEffect(() => {
    setDexEntries(record.entries ?? [])
  }, [record.entries])

  return (
    <>
      <Title level={2} size={'2xl'}>
        {record.name}
      </Title>
      <div className={'flex gap-4 flex-col items-start p-4 rounded-lg bg-nxt-b3'} key={record.id}>
        <div className="flex-1">
          <div className="text-sm text-nxt-w1 font-mono uppercase">{record.region || ''}</div>
          <span className="text-lg font-bold text-nxt-w2 hover:text-nxt-acc3">{record.name}</span>
          <div className="text-xs text-nxt-g3 font-mono uppercase">
            {record.gameSets.join(' / ')}
          </div>
        </div>
      </div>
      <Flex gap={4} vertical>
        <div className="flex-1">
          <Title level={2} size={'xl'}>
            Pokédex Entries
          </Title>
          <div className="p-2 rounded-lg bg-nxt-g1">
            <div className="p-2 text-center text-sm">
              {registrablePokes.length} entries: {counters.registrable.species} Pokémon +{' '}
              {counters.registrable.forms} forms
            </div>
            {!isTransitionPending && (
              <PokeGrid
                size={'8ch'}
                withNames
                withDexNums
                // incrementalDexNums
                searchable
                sortable
                pokemon={registrablePokes}
                selectablePokemon={allPokes.filter(p => !counters.registrable.ids.has(p.id))}
                canAdd
                canRemove
                onChange={updateRegistrableDex}
              />
            )}
          </div>
          <div className="text-right p-4">
            <Button onClick={saveDexEntries}>Save</Button>
          </div>
        </div>
        <div className="hidden">
          <hr className="border-b border-b-nxt-g1 my-4 border-dashed" />
          <div className="flex-1">
            <Title level={2} size={'xl'}>
              Other available Pokémon without Pokédex entries
            </Title>
            <div className="p-2 rounded-lg bg-nxt-g1">
              <div className="p-2 text-center text-sm">
                {counters.extras.species} Pokémon & {counters.extras.forms} forms
              </div>
              {!isTransitionPending && (
                <PokeGrid
                  size={'7ch'}
                  withNames
                  searchable
                  sortable
                  pokemon={extraPokes}
                  selectablePokemon={allPokes.filter(p => !counters.extras.ids.has(p.id))}
                  canAdd
                  canRemove
                  onChange={updateExtrasDex}
                />
              )}
            </div>
            <div className="text-right p-4">
              <Button onClick={saveDexEntries}>Save</Button>
            </div>
          </div>
        </div>

        <hr className="border-b border-b-nxt-g1 my-4 border-dashed" />
      </Flex>
    </>
  )
}
