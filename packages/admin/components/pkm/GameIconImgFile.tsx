import type { HTMLProps } from 'react'
import Image from 'next/image'

import { cn } from '@pkg/utils/lib/styling/classNames'

import { ASSETS_URL } from '@/lib/constants'

export type GameIconImgFileProps = { id: string } & HTMLProps<HTMLSpanElement>

export function GameIconImgFile({ id, className, ...rest }: GameIconImgFileProps): JSX.Element {
  const tileImg = `${ASSETS_URL}/images/games/icons-circle/${id}.png`
  const baseSize = 80
  const width = baseSize
  const height = baseSize

  return (
    <span
      title={id}
      className={cn(`max-w-full height-auto not-italic inline-block`, className)}
      {...rest}
    >
      <Image src={tileImg} alt={id} width={width} height={height} className="inline-block h-auto" />
    </span>
  )
}
