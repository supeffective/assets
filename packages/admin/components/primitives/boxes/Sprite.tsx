import { HTMLProps } from 'react'

import { PokeImgProps } from '@/components/pkm/PokeSprite'

export function SpriteBox({
  size,
  children,
  className,
  ...rest
}: {
  size: 16 | 32 | 48 | 64 | 92 | 128 | 136
  children: React.ReactElement<PokeImgProps>
} & HTMLProps<HTMLSpanElement>): JSX.Element {
  const extraClass = className ? ` ${className}` : ''

  return (
    <span
      className={
        `inline-block bg-nxt-b4/50 border border-nxt-b4` +
        `rounded-2xl mx-2 align-middle max-w-full ${extraClass}`
      }
      {...rest}
    >
      <Sprite size={size}>{children}</Sprite>
    </span>
  )
}

export function Sprite({
  size,
  children,
  className,
  ...rest
}: {
  size: 16 | 32 | 48 | 64 | 92 | 128 | 136
  children: React.ReactElement<PokeImgProps>
} & HTMLProps<HTMLSpanElement>): JSX.Element {
  const extraClass = className ? ` ${className}` : ''

  return (
    <span
      className={`inline-block align-middle max-w-full ${extraClass}`}
      {...rest}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {children}
    </span>
  )
}
