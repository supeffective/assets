import React, { HTMLProps } from 'react'

import { cn } from '@pkg/utils/lib/styling/classNames'

type FlexProps = {
  gap?: number
  vertical?: boolean
  autoFlex?: boolean
} & HTMLProps<HTMLDivElement>

export function Flex({
  className,
  gap = 4,
  autoFlex,
  vertical,
  children,
  ...rest
}: FlexProps): JSX.Element {
  const classNames = cn(
    `flex gap-${gap} w-full mb-6 last-child:mb-0`,
    [vertical ? 'flex-col' : 'flex-row'],
    className
  )
  const childrenArr = React.Children.toArray(children)

  return (
    <div className={classNames} {...rest}>
      {childrenArr.map((child, index) => {
        return autoFlex ? (
          <div key={index} className={'flex-1'}>
            {child}
          </div>
        ) : (
          child
        )
      })}
    </div>
  )
}
