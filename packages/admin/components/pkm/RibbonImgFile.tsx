import { HTMLProps } from 'react'
import Image from 'next/image'

import { cn } from '@pkg/utils/lib/styling/classNames'

export type RibbonImgFileProps = {
  id: string
  variant?: 'gen9-style'
} & HTMLProps<HTMLSpanElement>

export function RibbonImgFile({
  id,
  variant = 'gen9-style',
  className,
  ...rest
}: RibbonImgFileProps): JSX.Element {
  const tileImg = require(`../../../../assets/images/ribbons/${variant}/${id}.png`)
  const baseSize = 68 * 2
  let width = baseSize
  let height = baseSize

  return (
    <span title={id + '.png'} className={cn(`inline-block align-top`, className)} {...rest}>
      <Image src={tileImg} alt={id} width={width} height={height} className="inline-block h-auto" />
    </span>
  )
}
