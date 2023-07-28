import { HTMLProps } from 'react'
import Image from 'next/image'

import { cn } from '@pkg/utils/lib/styling/classNames'

import { ASSETS_URL } from '@/lib/constants'

export type MarkImgFileProps = {
  id: string
  variant?: 'gen9-style'
} & HTMLProps<HTMLSpanElement>

export function MarkImgFile({
  id,
  variant = 'gen9-style',
  className,
  ...rest
}: MarkImgFileProps): JSX.Element {
  const tileImg = `${ASSETS_URL}/images/marks/${variant}/${id}.png`
  const baseSize = 68 * 2
  const width = baseSize
  const height = baseSize

  return (
    <span title={id + '.png'} className={cn(`inline-block align-top`, className)} {...rest}>
      <Image src={tileImg} alt={id} width={width} height={height} className="inline-block h-auto" />
    </span>
  )
}
