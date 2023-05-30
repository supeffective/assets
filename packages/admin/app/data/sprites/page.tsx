import { Flex } from '@/components/primitives/boxes/Flex'
import { Title } from '@/components/primitives/typography/Title'

export default function Page() {
  const title = 'Sprites'

  return (
    <Flex vertical gap={6} className="max-w-5xl">
      <div>
        <Title>{title}</Title>
        <Flex className="place-content-center">WIP</Flex>
      </div>
    </Flex>
  )
}
