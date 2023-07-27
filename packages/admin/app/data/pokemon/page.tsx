import {
  createHttpDriver,
  createMutablePokemonRepository,
  createPokemonRepository,
} from '@supereffectivegg/assets-sdk'
import { createFsDriver } from '@supereffectivegg/assets-sdk/node'

import { getPokemonMissingOnSwitchGames } from '@pkg/datalayer/repositories/pokemon'

import { PokeGrid } from '@/components/pkm/PokeGrid'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Title } from '@/components/primitives/typography/Title'
import { ASSETS_PATH } from '@/lib/serverHelpers'

export default async function Page() {
  const repo = createPokemonRepository(
    createHttpDriver('https://itsjavi.com/supereffective-assets/assets')
  )

  const mutableRepo = createMutablePokemonRepository(createFsDriver(ASSETS_PATH))

  const pokes = await repo.getAll()

  return (
    <Flex vertical gap={6} className="max-w-5xl">
      <div>
        <Title>Pokémon</Title>
        <PokeGrid searchable pokemon={pokes} withNames />
      </div>
      <div className="mt-12">
        <Title className="text-2xl lg:text-3xl">Unavailable on Switch games:</Title>
        <PokeGrid pokemon={getPokemonMissingOnSwitchGames()} />
      </div>
    </Flex>
  )
}
