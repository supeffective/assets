'use client'

import { Pokemon } from '@pkg/datalayer/schemas/pokemon'

import { Field } from '@/components/primitives/boxes/Field'
import { Button } from '@/components/primitives/controls/Button'
import { Input } from '@/components/primitives/controls/Input'

export function PokemonRefsEditor({ pkm }: { pkm: Pokemon }) {
  return (
    <>
      <h4 className="text-xl font-bold mb-4">References</h4>
      <p className="text-nxt-g4">
        References in the URLs of other websites and in their data formats.
      </p>
      <Field label="Pokémon GO">
        <Input type="text" name="refs.pogo" defaultValue={pkm.refs?.pogo || ''} />
      </Field>
      <Field label="Smogon">
        <Input type="text" name="refs.smogon" defaultValue={pkm.refs?.smogon || ''} />
        <Button href="#" className="bg-transparent border text-nxt-w1 border-nxt-g2">
          View
        </Button>
      </Field>
      <Field label="Showdown">
        <Input type="text" name="refs.showdown" defaultValue={pkm.refs?.showdown || ''} />
        <Button href="#" className="bg-transparent border text-nxt-w1 border-nxt-g2">
          View
        </Button>
      </Field>
      <Field label="Serebii">
        <Input type="text" name="refs.serebii" defaultValue={pkm.refs?.serebii || ''} />
        <Button href="#" className="bg-transparent border text-nxt-w1 border-nxt-g2">
          View
        </Button>
      </Field>
      <Field label="Bulbapedia (no suffix)">
        <Input
          type="text"
          placeholder='Name in the URL, without the "_(Pokémon)" part'
          name="refs.bulbapedia"
          defaultValue={pkm.refs?.bulbapedia || ''}
        />
        <Button href="#" className="bg-transparent border text-nxt-w1 border-nxt-g2">
          View
        </Button>
      </Field>
      <Field label="Mini Sprite">
        <Input type="text" name="refs.miniSprite" defaultValue={pkm.refs?.miniSprite || ''} />
      </Field>
      <Field label="Home Sprite">
        <Input type="text" name="refs.homeSprite" defaultValue={pkm.refs?.homeSprite || ''} />
      </Field>
    </>
  )
}
