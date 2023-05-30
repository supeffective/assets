import { notFound } from 'next/navigation'

import { getPokemon, getPokemonOrFail } from '@pkg/datalayer/repositories/pokemon'
import { updatePokemonFromFormData } from '@pkg/datalayer/repositories/server-side/pokemon'

import { PokemonEditForm } from '@/components/pkm/views/PokemonEditForm'
import { PrevNextPokemon } from '@/components/pkm/views/PrevNextPokemon'

async function saveEntry(formData: FormData) {
  'use server'

  updatePokemonFromFormData(formData)
  //redirect(`/data/pokemon/${formData.get('id')}/edit?status=success`)
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const pkm = getPokemonOrFail(params.id)

  return {
    title: `Edit ${pkm.name}`,
  }
}

export default function Page({ params }: { params: { id: string } }) {
  const pkm = getPokemon(params.id)

  if (!pkm) {
    notFound()
  }

  return (
    <>
      <PrevNextPokemon id={params.id} />
      <form className="w-full" action={saveEntry}>
        <PokemonEditForm pokemon={pkm} />
      </form>
    </>
  )
}
