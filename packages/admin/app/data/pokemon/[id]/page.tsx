import { notFound } from 'next/navigation'

import { getPokemon } from '@pkg/datalayer/repositories/pokemon'

import { PokeSprite } from '@/components/pkm/PokeSprite'
import { SpriteBox } from '@/components/primitives/boxes/Sprite'
import { Button } from '@/components/primitives/controls/Button'
import { Title } from '@/components/primitives/typography/Title'
import { Routes } from '@/lib/Routes'

export default function Page({ params }: { params: { id: string } }) {
  const pkm = getPokemon(params.id)

  if (!pkm) {
    notFound()
  }

  return (
    <>
      <Title>{pkm.name}</Title>
      <div className="mb-10 p-5 px-4 border-gray-800 border rounded-2xl">
        <SpriteBox size={128}>
          <PokeSprite id={params.id} />
        </SpriteBox>
        <SpriteBox size={128}>
          <PokeSprite id={params.id} shiny />
        </SpriteBox>
      </div>
      <div className="font-mono text-xs whitespace-normal">{JSON.stringify(pkm, null, 2)}</div>
      <Button href={`${Routes.Pokemon}/${params.id}/edit`}>Edit</Button>
    </>
  )
}
