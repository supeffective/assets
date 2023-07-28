import { HTMLProps } from 'react'
import Image from 'next/image'

import { cn } from '@pkg/utils/lib/styling/classNames'

import { ASSETS_URL } from '@/lib/constants'
import { assetExists } from '@/lib/serverHelpers'

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
  const assetPath = `images/items/${variant}/${id}.png`

  if (!assetExists(assetPath)) {
    throw new Error(`ItemImgFile: asset not found: ${assetPath}`)
  }

  const tileImg = `${ASSETS_URL}/${assetPath}`
  // const tileImg = assetExists(assetPath)
  //   ? `${ASSETS_URL}/${assetPath}`
  //   : `${ASSETS_URL}/images/items/${variant}/unknown-red.png`

  const baseSize = 68 * 2
  const width = baseSize
  const height = baseSize

  return (
    <span title={id + '.png'} className={cn(`inline-block align-top`, className)} {...rest}>
      <Image src={tileImg} alt={id} width={width} height={height} className="inline-block h-auto" />
    </span>
  )
}
