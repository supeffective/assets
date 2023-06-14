'use client'

import { useParams } from 'next/navigation'

import { BoxPresetEditor } from '@/components/pkm/views/BoxPresetEditor'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Title } from '@/components/primitives/typography/Title'
import { PageProps } from '@/lib/types'

export default function Page(props: PageProps) {
  const title = 'Box Presets (Legacy)'
  const params = useParams()
  const { gameset, preset } = params

  return (
    <Flex vertical gap={6} className="max-w-5xl">
      <div>
        <Title>{title}</Title>
        <BoxPresetEditor gameSetId={gameset} presetId={preset} />
      </div>
    </Flex>
  )
}