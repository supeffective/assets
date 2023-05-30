import { HTMLProps } from 'react'

import { cn } from '@pkg/utils/lib/styling/classNames'

type BoxProps = {} & HTMLProps<HTMLDivElement>

export function Box({ className, children, ...rest }: BoxProps): JSX.Element {
  const classNames = cn(
    'flex flex-col gap-4 w-full mb-12 last-child:mb-0',
    'rounded-md border border-nxt-g1 overflow-hidden',
    className
  )

  return (
    <div className={classNames} {...rest}>
      {children}
    </div>
  )
}

function Content({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="p-6 mb-4">{children}</div>
}

function Footer({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="flex justify-between items-center gap-4 px-6 py-4 border-t border-t-nxt-g1 bg-nxt-b2">
      {children}
    </div>
  )
}

Box.Footer = Footer
Box.Content = Content
