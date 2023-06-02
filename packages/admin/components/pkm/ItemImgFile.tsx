import { HTMLProps } from 'react'
import Image from 'next/image'

import { cn } from '@pkg/utils/lib/styling/classNames'

import { ASSETS_URL } from '@/lib/constants'

export type ItemImgFileProps = {
  id: string
  variant?: 'gen9-style'
} & HTMLProps<HTMLSpanElement>

export function ItemImgFile({
  id,
  variant = 'gen9-style',
  className,
  ...rest
}: ItemImgFileProps): JSX.Element {
  const tileImg = `${ASSETS_URL}/images/items/${variant}/${id}.png`
  const baseSize = 68 * 2
  let width = baseSize
  let height = baseSize

  return (
    <span title={id + '.png'} className={cn(`inline-block align-top`, className)} {...rest}>
      <Image src={tileImg} alt={id} width={width} height={height} className="inline-block h-auto" />
    </span>
  )
}
