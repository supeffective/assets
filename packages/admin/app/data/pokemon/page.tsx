import {
  createHttpDriver,
  createPokemonRepository,
  createPokemonTextSearchEngine,
  kv,
} from '@supereffectivegg/assets-sdk'

import { getPokemonMissingOnSwitchGames } from '@pkg/datalayer/repositories/pokemon'

import { PokeGrid } from '@/components/pkm/PokeGrid'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Title } from '@/components/primitives/typography/Title'

export default async function Page() {
  const repo = createPokemonRepository(
    createHttpDriver(kv, 'https://itsjavi.com/supereffective-assets/assets'),
    await createPokemonTextSearchEngine(),
    600
  )

  await repo.getAll()
  await repo.getAll() // should be cached
  await repo.getAll() // should be cached

  const pokes = await repo.getAll() // should be cached

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
