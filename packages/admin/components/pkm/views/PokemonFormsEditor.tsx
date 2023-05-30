'use client'

import { useState } from 'react'

import { getAllPokemon, getManyPokemon } from '@pkg/datalayer/repositories/pokemon'
import { Pokemon } from '@pkg/datalayer/schemas/pokemon'

import { PokeGrid } from '@/components/pkm/PokeGrid'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Label } from '@/components/primitives/boxes/Label'
import { Input } from '@/components/primitives/controls/Input'
import { Checkbox } from '@/components/ui/checkbox'

export function PokemonFormsEditor({
  pkm: pokemon,
  onChange,
}: {
  pkm: Pokemon
  onChange?: (pkm: Pokemon) => void
}) {
  const allPokemon = getAllPokemon()
  const [pkm, setPkm] = useState<Pokemon>(pokemon)

  function handleSingleFormSelection(rows: Pokemon[], field: keyof Pokemon) {
    ;(pkm as any)[field] = rows.length > 0 ? rows[rows.length - 1].id : null
    setPkm({ ...pkm })
    if (onChange) {
      onChange(pkm)
    }
  }

  function handleFormsSelection(rows: Pokemon[], field: keyof Pokemon) {
    ;(pkm as any)[field] = rows.map(row => row.id)
    setPkm({ ...pkm })
    if (onChange) {
      onChange(pkm)
    }
  }

  return (
    <>
      <div className="mb-10">
        <h4 className="text-xl font-bold mb-4">Forms</h4>
        <PokeGrid
          editable
          onChange={list => handleFormsSelection(list, 'forms')}
          selectablePokemon={allPokemon}
          withNames
          pokemon={getManyPokemon(pkm.forms)}
        />
        {pkm.forms.map((form, i) => {
          return (
            <input type="hidden" name={`forms[${i}]`} value={form} key={`forms.${form}.${i}`} />
          )
        })}
        {pkm.forms.length === 0 && <input type="hidden" name="forms[]" value="" />}
      </div>
      <div className="mb-10">
        <h4 className="text-xl font-bold mb-4">Changes From</h4>
        <PokeGrid
          editable
          onChange={list => handleFormsSelection(list, 'baseForms')}
          selectablePokemon={allPokemon}
          withNames
          pokemon={getManyPokemon(pkm.baseForms)}
        />
        {pkm.baseForms.map((form, i) => {
          return (
            <input
              type="hidden"
              name={`baseForms[${i}]`}
              value={form}
              key={`baseForms.${form}.${i}`}
            />
          )
        })}
        {pkm.baseForms.length === 0 && <input type="hidden" name="baseForms[]" value="" />}
      </div>
      <div className="mb-10">
        <h4 className="text-xl font-bold mb-4">Base Species</h4>
        <PokeGrid
          editable
          onChange={list => handleSingleFormSelection(list, 'baseSpecies')}
          selectablePokemon={allPokemon}
          addLabel="Select Base Species"
          max={1}
          withNames
          pokemon={pkm.baseSpecies ? getManyPokemon([pkm.baseSpecies]) : []}
        />
        <input type="hidden" name="baseSpecies" value={pkm.baseSpecies || ''} />
      </div>
      <div className="mb-10">
        <h4 className="text-xl font-bold mb-4">Shiny Info</h4>
        <Flex>
          <Label text="Is Shiny released?">
            <Checkbox defaultChecked={pkm.shinyReleased} name="shinyReleased" />
          </Label>
        </Flex>
        <PokeGrid
          editable
          onChange={list => handleSingleFormSelection(list, 'shinyBase')}
          selectablePokemon={allPokemon}
          addLabel="Select Shiny Base"
          max={1}
          withNames
          pokemon={pkm.shinyBase ? getManyPokemon([pkm.shinyBase]) : []}
        />
        <input type="hidden" name="shinyBase" value={pkm.shinyBase || ''} />
      </div>
      <Flex className="mb-0">
        <h4 className="text-xl font-bold">Form Flags</h4>
      </Flex>
      <Flex className="justify-between flex-col lg:flex-row"></Flex>
      <div className="grid grid-cols-3 w-full mb-6 last-child:mb-0 gap-4">
        <Label text="isDefault">
          <Checkbox defaultChecked={pkm.isDefault} name="isDefault" />
        </Label>
        <Label text="isForm">
          <Checkbox defaultChecked={pkm.isForm} name="isForm" />
        </Label>
        <Label text="isLegendary">
          <Checkbox defaultChecked={pkm.isLegendary} name="isLegendary" />
        </Label>
        <Label text="isMythical">
          <Checkbox defaultChecked={pkm.isMythical} name="isMythical" />
        </Label>
        <Label text="isSpecialAbilityForm">
          <Checkbox defaultChecked={pkm.isSpecialAbilityForm} name="isSpecialAbilityForm" />
        </Label>
        <Label text="isCosmeticForm">
          <Checkbox defaultChecked={pkm.isCosmeticForm} name="isCosmeticForm" />
        </Label>
        <Label text="isFemaleForm">
          <Checkbox defaultChecked={pkm.isFemaleForm} name="isFemaleForm" />
        </Label>
        <Label text="hasGenderDifferences">
          <Checkbox defaultChecked={pkm.hasGenderDifferences} name="hasGenderDifferences" />
        </Label>
        <Label text="isBattleOnlyForm">
          <Checkbox defaultChecked={pkm.isBattleOnlyForm} name="isBattleOnlyForm" />
        </Label>
        <Label text="isSwitchableForm">
          <Checkbox defaultChecked={pkm.isSwitchableForm} name="isSwitchableForm" />
        </Label>
        <Label text="isMega">
          <Checkbox defaultChecked={pkm.isMega} name="isMega" />
        </Label>
        <Label text="isPrimal">
          <Checkbox defaultChecked={pkm.isPrimal} name="isPrimal" />
        </Label>
        <Label text="isRegional">
          <Checkbox defaultChecked={pkm.isRegional} name="isRegional" />
        </Label>
        <Label text="isGmax">
          <Checkbox defaultChecked={pkm.isGmax} name="isGmax" />
        </Label>
        <Label text="canGmax">
          <Checkbox defaultChecked={pkm.canGmax} name="canGmax" />
        </Label>
        <Label text="canDynamax">
          <Checkbox defaultChecked={pkm.canDynamax} name="canDynamax" />
        </Label>
        <Label text="canBeAlpha">
          <Checkbox defaultChecked={pkm.canBeAlpha} name="canBeAlpha" />
        </Label>
      </div>
      <hr className="my-6 border-nxt-g1" />
      <Flex>
        <h4 className="text-xl font-bold">Ultra Beast Data</h4>
      </Flex>
      <Flex>
        <Label text="Is Ultra Beast">
          <Checkbox defaultChecked={pkm.isUltraBeast} name="isisUltraBeast" />
        </Label>
      </Flex>
      <Flex>
        <Input
          placeholder="UB Codename"
          type="text"
          name="ultraBeastCode"
          defaultValue={pkm.ultraBeastCode || ''}
        />
      </Flex>
      <hr className="my-6 border-nxt-g1" />
      <h4 className="text-xl font-bold mb-4">Fusion Data</h4>
      <Flex>
        <Label text="isFusion">
          <Checkbox defaultChecked={pkm.isFusion} name="isFusion" />
        </Label>
      </Flex>
      <Flex>
        <PokeGrid
          editable
          onChange={list => handleFormsSelection(list, 'fusedWith')}
          selectablePokemon={allPokemon}
          withNames
          pokemon={getManyPokemon(pkm.fusedWith || [])}
        />
        {(pkm.fusedWith || []).map((form, i) => {
          return (
            <input
              type="hidden"
              name={`fusedWith[${i}]`}
              value={form}
              key={`fusedWith.${form}.${i}`}
            />
          )
        })}
        {(pkm.fusedWith === null || pkm.fusedWith?.length === 0) && (
          <input type="hidden" name="fusedWith" value="" />
        )}
      </Flex>
      <hr className="my-6 border-nxt-g1" />
      <h4 className="text-xl font-bold mb-4">Paradox Data</h4>
      <Flex>
        <Label text="isParadox">
          <Checkbox defaultChecked={pkm.isParadox} name="isParadox" />
        </Label>
      </Flex>
      <Flex>
        <PokeGrid
          editable
          onChange={list => handleFormsSelection(list, 'paradoxSpecies')}
          selectablePokemon={allPokemon}
          withNames
          pokemon={getManyPokemon(pkm.paradoxSpecies || [])}
        />
        {(pkm.paradoxSpecies || []).map((form, i) => {
          return (
            <input
              type="hidden"
              name={`paradoxSpecies[${i}]`}
              value={form}
              key={`paradoxSpecies.${form}.${i}`}
            />
          )
        })}
        {(!pkm.paradoxSpecies || pkm.paradoxSpecies?.length === 0) && (
          <input type="hidden" name="paradoxSpecies" value="" />
        )}
      </Flex>
      <hr className="my-6 border-nxt-g1" />
      <h4 className="text-xl font-bold mb-4">Convergent Species Data</h4>
      <Flex>
        <Label text="isConvergent">
          <Checkbox defaultChecked={pkm.isConvergent} name="isConvergent" />
        </Label>
      </Flex>
      <Flex>
        <PokeGrid
          editable
          onChange={list => handleFormsSelection(list, 'convergentSpecies')}
          selectablePokemon={allPokemon}
          withNames
          pokemon={getManyPokemon(pkm.convergentSpecies || [])}
        />
        {(pkm.convergentSpecies || []).map((form, i) => {
          return (
            <input
              type="hidden"
              name={`convergentSpecies[${i}]`}
              value={form}
              key={`convergentSpecies.${form}.${i}`}
            />
          )
        })}
        {(!pkm.convergentSpecies || pkm.convergentSpecies?.length === 0) && (
          <input type="hidden" name="convergentSpecies" value="" />
        )}
      </Flex>
    </>
  )
}
