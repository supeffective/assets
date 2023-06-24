'use client'

import { HTMLProps, useTransition } from 'react'
import Image from 'next/image'

import { cn } from '@pkg/utils/lib/styling/classNames'

import { uploadImageAction } from '@/actions/uploadImageActions'
import { ImageContents, ImageUploader } from '@/components/primitives/controls/ImageUploader'
import { ASSETS_URL } from '@/lib/constants'

export type PokeImgFileProps = {
  nid: string | null
  variant: 'gen8-icon' | 'home3d-icon' | 'home2d-icon'
  shiny?: boolean
  editable?: boolean
} & HTMLProps<HTMLSpanElement>

export function PokeImgFile({
  nid,
  variant,
  shiny,
  className,
  editable,
  ...rest
}: PokeImgFileProps): JSX.Element {
  const [isTransitionPending, startTransition] = useTransition()
  const shinyDir = shiny ? 'shiny' : 'regular'
  const baseName = nid ? `${variant}/${shinyDir}/${nid}.png` : `${variant}/unknown-sv.png`
  const relativePath = `images/pokemon/${baseName}`
  const tileImg = `${ASSETS_URL}/${relativePath}`

  const baseSize = 68 * 2
  let width = baseSize
  let height = baseSize
  if (variant === 'gen8-icon') {
    width = 68 * 2
    height = 56 * 2
  }

  function handeUploadImage(file: File, contents: ImageContents) {
    startTransition(async () => await uploadImageAction(String(contents), relativePath))
  }

  function _renderImg() {
    if (editable && !isTransitionPending) {
      return (
        <ImageUploader
          asComponent={'img'}
          currentSrc={tileImg + '?v=' + Date.now()}
          alt={nid || 'unknown'}
          width={width}
          height={height}
          className="inline-block h-auto max-w-full"
          style={variant === 'gen8-icon' ? { imageRendering: 'pixelated' } : {}}
          onImageLoad={handeUploadImage}
        />
      )
    }

    return (
      <Image
        src={tileImg}
        alt={nid || 'unknown'}
        width={width}
        height={height}
        className={cn('inline-flex h-auto max-w-full', [
          isTransitionPending,
          'opacity-50 grayscale cursor-progress',
        ])}
        style={variant === 'gen8-icon' ? { imageRendering: 'pixelated' } : {}}
      />
    )
  }

  return (
    <span
      title={nid + '.png'}
      className={cn(`inline-flex align-top`, className, [nid === null, 'opacity-50 grayscale'])}
      {...rest}
    >
      {_renderImg()}
    </span>
  )
}
