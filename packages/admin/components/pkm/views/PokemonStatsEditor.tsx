import { getAbilities } from '@pkg/datalayer/repositories/abilities'
import { getColors } from '@pkg/datalayer/repositories/colors'
import { getGameSets } from '@pkg/datalayer/repositories/gamesets'
import { getRegions } from '@pkg/datalayer/repositories/regions'
import { getTypes } from '@pkg/datalayer/repositories/types'
import { MAX_POKEMON_GENERATION } from '@pkg/datalayer/schemas/common'
import { Pokemon } from '@pkg/datalayer/schemas/pokemon'

import { Field } from '@/components/primitives/boxes/Field'
import { Input } from '@/components/primitives/controls/Input'
import { Select } from '@/components/primitives/controls/Select'

export function PokemonStatsEditor({
  pkm,
  onChange,
}: {
  pkm: Pokemon
  onChange?: (pkm: Pokemon) => void
}) {
  return (
    <>
      <h4 className="text-xl font-bold mb-4">General Info</h4>
      <Field.SplitViewItem label="ID">
        <Input type="text" defaultValue={pkm.id} readOnly />
      </Field.SplitViewItem>
      <Field.SplitView>
        <Field.SplitViewItem label="Numeric ID">
          <Input type="text" name="nid" defaultValue={pkm.nid} />
        </Field.SplitViewItem>
        <Field.SplitViewItem label="Dex No.">
          <Input
            type="number"
            step={1}
            min={0}
            max={10000}
            name="dexNum"
            defaultValue={pkm.dexNum}
          />
        </Field.SplitViewItem>
        <Field.SplitViewItem label="Form ID">
          <Input type="text" name="formId" defaultValue={pkm.formId || ''} />
        </Field.SplitViewItem>
      </Field.SplitView>

      <Field.SplitView>
        <Field.SplitViewItem label="Name">
          <Input type="text" name="name" defaultValue={pkm.name} />
        </Field.SplitViewItem>
        <Field.SplitViewItem label="Form Name">
          <Input type="text" name="formName" defaultValue={pkm.formName || ''} />
        </Field.SplitViewItem>
      </Field.SplitView>

      <Field.SplitView>
        <Field.SplitViewItem label="Name (Showdown Markup)">
          <Input type="text" name="psName" defaultValue={pkm.psName} />
        </Field.SplitViewItem>
      </Field.SplitView>
      <Field.SplitView>
        <Field.SplitViewItem label="Type 1">
          <Select options={getTypes()} name="type1" defaultValue={pkm.type1} />
        </Field.SplitViewItem>
        <Field.SplitViewItem label="Type 2">
          <Select
            options={getTypes()}
            nullable
            name="type2"
            defaultValue={pkm.type2 ?? undefined}
          />
        </Field.SplitViewItem>
      </Field.SplitView>
      <Field.SplitView>
        <Field.SplitViewItem label="Primary Ability">
          <Select
            options={getAbilities()}
            name="abilities.primary"
            sorted
            defaultValue={pkm.abilities.primary}
          />
        </Field.SplitViewItem>
        <Field.SplitViewItem label="Secondary Ability">
          <Select
            options={getAbilities()}
            name="abilities.secondary"
            nullable
            sorted
            defaultValue={pkm.abilities.secondary ?? undefined}
          />
        </Field.SplitViewItem>
        <Field.SplitViewItem label="Hidden Ability">
          <Select
            options={getAbilities()}
            name="abilities.hidden"
            nullable
            sorted
            defaultValue={pkm.abilities.hidden ?? undefined}
          />
        </Field.SplitViewItem>
      </Field.SplitView>
      <Field.SplitView>
        <Field.SplitViewItem label="Color">
          <Select options={getColors()} name="color" defaultValue={pkm.color} />
        </Field.SplitViewItem>
        <Field.SplitViewItem label="Height (cm)">
          <Input type="number" step={1} min={-1} name="height" defaultValue={pkm.height || '-1'} />
        </Field.SplitViewItem>
        <Field.SplitViewItem label="Weight (g)">
          <Input type="number" step={1} min={-1} name="weight" defaultValue={pkm.weight || '-1'} />
        </Field.SplitViewItem>
      </Field.SplitView>
      <Field.SplitView>
        <Field.SplitViewItem label="HP">
          <Input
            type="number"
            step={1}
            min={-1}
            max={255}
            name="baseStats.hp"
            defaultValue={pkm.baseStats.hp}
          />
        </Field.SplitViewItem>
        <Field.SplitViewItem label="Attack">
          <Input
            type="number"
            min={-1}
            max={255}
            name="baseStats.atk"
            defaultValue={pkm.baseStats.atk}
          />
        </Field.SplitViewItem>
        <Field.SplitViewItem label="Defense">
          <Input
            type="number"
            step={1}
            min={-1}
            max={255}
            name="baseStats.def"
            defaultValue={pkm.baseStats.def}
          />
        </Field.SplitViewItem>
        <Field.SplitViewItem label="Sp. Att.">
          <Input
            type="number"
            step={1}
            min={-1}
            max={255}
            name="baseStats.spa"
            defaultValue={pkm.baseStats.spa}
          />
        </Field.SplitViewItem>
        <Field.SplitViewItem label="Sp. Def.">
          <Input
            type="number"
            step={1}
            min={-1}
            max={255}
            name="baseStats.spd"
            defaultValue={pkm.baseStats.spd}
          />
        </Field.SplitViewItem>
        <Field.SplitViewItem label="Speed">
          <Input
            type="number"
            step={1}
            min={-1}
            max={255}
            name="baseStats.spe"
            defaultValue={pkm.baseStats.spe}
          />
        </Field.SplitViewItem>
      </Field.SplitView>
      <Field.SplitView>
        <Field.SplitViewItem label="GO Stamina">
          <Input
            type="number"
            step={1}
            min={-1}
            max={255}
            name="goStats.sta"
            defaultValue={pkm.goStats.sta}
          />
        </Field.SplitViewItem>
        <Field.SplitViewItem label="GO Attack">
          <Input
            type="number"
            step={1}
            min={-1}
            max={255}
            name="goStats.atk"
            defaultValue={pkm.goStats.atk}
          />
        </Field.SplitViewItem>
        <Field.SplitViewItem label="GO Defense">
          <Input
            type="number"
            step={1}
            min={-1}
            max={255}
            name="goStats.def"
            defaultValue={pkm.goStats.def}
          />
        </Field.SplitViewItem>
      </Field.SplitView>

      <Field.SplitView>
        <Field.SplitViewItem label="Region">
          <Select options={getRegions()} name="region" defaultValue={pkm.region} />
        </Field.SplitViewItem>
        <Field.SplitViewItem label="Debut Game">
          <Select options={getGameSets()} name="debutIn" defaultValue={pkm.debutIn} />
        </Field.SplitViewItem>
        <Field.SplitViewItem label="Generation">
          <Select
            options={[...Array(MAX_POKEMON_GENERATION)].map((_, index) => ({
              value: `${index + 1}`,
              label: `Generation ${index + 1}`,
            }))}
            name="generation"
            defaultValue={pkm.generation}
          />
        </Field.SplitViewItem>
      </Field.SplitView>
    </>
  )
}
