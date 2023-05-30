import { getAllPokemon, getPokemonMissingOnSwitchGames } from '@pkg/datalayer/repositories/pokemon'

import { PokeGrid } from '@/components/pkm/PokeGrid'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Title } from '@/components/primitives/typography/Title'

export default function Page() {
  return (
    <Flex vertical gap={6} className="max-w-5xl">
      <div>
        <Title>Pokémon</Title>
        <PokeGrid searchable pokemon={getAllPokemon()} withNames />
      </div>
      <div className="mt-12">
        <Title className="text-2xl lg:text-3xl">Unavailable on Switch games:</Title>
        <PokeGrid pokemon={getPokemonMissingOnSwitchGames()} />
      </div>
    </Flex>
  )
}
