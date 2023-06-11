import { getPokedexes as getRecords } from '@pkg/datalayer/repositories/pokedexes'

import { PokedexList } from '@/components/pkm/views/PokedexList'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Title } from '@/components/primitives/typography/Title'

export default function Page() {
  const title = 'Pokedexes'
  const records = getRecords()

  return (
    <Flex vertical gap={6} className="max-w-5xl">
      <div>
        <Title>{title}</Title>
        <PokedexList records={records} />
      </div>
    </Flex>
  )
}
