import { HTMLProps } from 'react'
import Image from 'next/image'

import { cn } from '@pkg/utils/lib/styling/classNames'

export type GameImgProps = { id: string; isGameSet?: boolean } & HTMLProps<HTMLSpanElement>

export function GameImg({ id, isGameSet, className, ...rest }: GameImgProps): JSX.Element {
  const dir = isGameSet ? 'gameset' : 'game'
  const ext = isGameSet ? 'png' : 'jpeg'
  const tileImg = require(`../../../../assets/images/games/${dir}-tiles/${id}.${ext}`)
  const baseSize = 60
  let width = baseSize
  let height = baseSize
  if (tileImg.default.width > tileImg.default.height) {
    width = baseSize * 2
    height = baseSize
  }

  return (
    <span title={id} className={cn(`w-full h-full not-italic`, className)} {...rest}>
      <Image
        src={tileImg}
        alt={id}
        width={width}
        height={baseSize}
        className="inline-block h-auto"
      />
    </span>
  )
}
