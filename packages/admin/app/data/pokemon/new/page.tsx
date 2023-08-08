import { redirect } from 'next/navigation'

import { createPlaceholderPokemon, getAllPokemon } from '@pkg/datalayer/repositories/pokemon'
import { updatePokemonFromFormData } from '@pkg/datalayer/repositories/server-side/pokemon'

import { PokemonEditForm } from '@/components/pkm/views/PokemonEditForm'

async function saveEntry(formData: FormData) {
  'use server'

  updatePokemonFromFormData(formData)
  redirect(`/data/pokemon/${formData.get('id')}/edit?status=success`)
}

export function generateMetadata() {
  return {
    title: `Add new Pokémon`,
  }
}

export default function Page({ params }: { params: { id: string } }) {
  const pkm = createPlaceholderPokemon()
  const allPokemon = getAllPokemon()
  const lastPokemon = allPokemon[allPokemon.length - 1]

  return (
    <>
      <form className="w-full" action={saveEntry}>
        <PokemonEditForm pokemon={pkm} />
      </form>
    </>
  )
}
