import React, { HTMLProps } from 'react'

import { cn } from '@pkg/utils/lib/styling/classNames'

type GridProps = {
  gap?: number
  minColWidth?: string
  maxColWidth?: string
  repeat?: number | 'auto-fill' | 'auto-fit' | 'inherit' | 'initial' | 'unset'
} & HTMLProps<HTMLDivElement>

export function Grid({
  className,
  style,
  gap = 4,
  minColWidth = '10ch',
  maxColWidth = '1fr',
  repeat = 'auto-fill',
  children,
  ...rest
}: GridProps): JSX.Element {
  const classNames = cn(`grid gap-${gap} w-full mb-6 last-child:mb-0`, className)
  const styleObj = Object.assign({}, style, {
    gridTemplateColumns: `repeat(${repeat},minmax(${minColWidth},${maxColWidth}))`,
  })
  // grid-template-columns: repeat(auto-fill,minmax(64px,1fr))
  const childrenArr = React.Children.toArray(children)

  return (
    <div className={classNames} {...rest} style={styleObj}>
      {childrenArr.map((child, index) => child)}
    </div>
  )
}
