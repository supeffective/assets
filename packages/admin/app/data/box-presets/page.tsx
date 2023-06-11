import { Flex } from '@/components/primitives/boxes/Flex'
import { Title } from '@/components/primitives/typography/Title'

export default function Page() {
  const title = 'Box Presets (Legacy)'

  return (
    <Flex vertical gap={6} className="max-w-5xl text-center">
      <div>
        <Title>{title}</Title>
      </div>
      <p>Select a game set and a preset to edit it.</p>
    </Flex>
  )
}
