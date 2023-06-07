import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeftCircleIcon } from 'lucide-react'

import { getGameSet } from '@pkg/datalayer/repositories/gamesets'

import GameSetEditor from '@/components/pkm/views/GameSetEditor'
import { Title } from '@/components/primitives/typography/Title'
import { Routes } from '@/lib/Routes'
import { PageProps } from '@/lib/types'

export default function Page({ params: { id } }: PageProps) {
  const record = getGameSet(id)

  if (!record) {
    return notFound()
  }

  return (
    <div className="w-full max-w-5xl">
      <Link href={Routes.Games} className="text-nxt-acc3 text-xs">
        <ArrowLeftCircleIcon /> Back
      </Link>
      <Title level={1} size={'4xl'}>
        Game
      </Title>
      <GameSetEditor gameSet={record} />
    </div>
  )
}
