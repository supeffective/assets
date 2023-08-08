import { getAllPokemon, getPokemonMissingOnSwitchGames } from '@pkg/datalayer/repositories/pokemon'

import { PokeGrid } from '@/components/pkm/PokeGrid'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Button } from '@/components/primitives/controls/Button'
import { Title } from '@/components/primitives/typography/Title'

export default async function Page() {
  // const repo = createPokemonRepository(
  //   createHttpDriver(kv, 'https://itsjavi.com/supereffective-assets/assets'),
  //   await createPokemonTextSearchEngine(),
  //   600
  // )

  // await repo.getAll()
  // await repo.getAll() // should be cached
  // await repo.getAll() // should be cached

  const pokes = getAllPokemon()

  return (
    <Flex vertical gap={6} className="max-w-5xl">
      <div>
        <Flex className="align-center items-center">
          <Title className="flex-1 text-3xl my-2">Pokémon</Title>
          <Button
            href="/data/pokemon/new"
            title="Add new Pokémon"
            className="bg-amber-400 text-lg py-1 bold"
          >
            +
          </Button>
        </Flex>
        <PokeGrid searchable pokemon={pokes} withNames />
      </div>
      <div className="mt-12">
        <Title className="text-2xl lg:text-3xl">Unavailable on Switch games:</Title>
        <PokeGrid pokemon={getPokemonMissingOnSwitchGames()} />
      </div>
    </Flex>
  )
}
