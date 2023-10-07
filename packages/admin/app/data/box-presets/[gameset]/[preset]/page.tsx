'use client'

import { notFound, useParams } from 'next/navigation'

import { BoxPresetEditor } from '@/components/pkm/views/BoxPresetEditor'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Title } from '@/components/primitives/typography/Title'
import type { PageProps } from '@/lib/types'

export default function Page(props: PageProps) {
  const title = 'Box Presets (Legacy)'
  const params = useParams()
  const { gameset, preset } = params

  if (!gameset || !preset) {
    return notFound()
  }

  return (
    <Flex vertical gap={6} className="max-w-5xl">
      <div>
        <Title>{title}</Title>
        <BoxPresetEditor gameSetId={String(gameset)} presetId={String(preset)} />
      </div>
    </Flex>
  )
}
