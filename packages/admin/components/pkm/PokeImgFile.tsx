import { HTMLProps } from 'react'
import Image from 'next/image'

import { cn } from '@pkg/utils/lib/styling/classNames'

export type PokeImgFileProps = {
  nid: string
  variant: 'gen8-icon' | 'home3d-icon' | 'home2d-icon'
  shiny?: boolean
} & HTMLProps<HTMLSpanElement>

export function PokeImgFile({
  nid,
  variant,
  shiny,
  className,
  ...rest
}: PokeImgFileProps): JSX.Element {
  const shinyDir = shiny ? 'shiny' : 'regular'
  const tileImg = require(`../../../../assets/images/pokemon/${variant}/${shinyDir}/${nid}.png`)
  const baseSize = 68 * 2
  let width = baseSize
  let height = baseSize
  if (variant === 'gen8-icon') {
    width = 68 * 2
    height = 56 * 2
  }

  return (
    <span title={nid + '.png'} className={cn(`inline-block align-top`, className)} {...rest}>
      <Image
        src={tileImg}
        alt={nid}
        width={width}
        height={height}
        className="inline-block h-auto"
        style={variant === 'gen8-icon' ? { imageRendering: 'pixelated' } : {}}
      />
    </span>
  )
}
