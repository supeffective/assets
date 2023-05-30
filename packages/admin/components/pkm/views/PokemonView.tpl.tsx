'use client'

import { useState } from 'react'

import { getAllPokemon } from '@pkg/datalayer/repositories/pokemon'
import { Pokemon } from '@pkg/datalayer/schemas/pokemon'

export function PokemonStatsEditor({
  pkm: pokemon,
  onChange,
}: {
  pkm: Pokemon
  onChange?: (pkm: Pokemon) => void
}) {
  const allPokemon = getAllPokemon()
  const [pkm, setPkm] = useState<Pokemon>(pokemon)

  return <></>
}
