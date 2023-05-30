import { HTMLProps } from 'react'

import { cn } from '@pkg/utils/lib/styling/classNames'

export type HeaderProps = { children: React.ReactNode } & HTMLProps<HTMLDivElement>

export function Header({ children, className, ...rest }: HeaderProps): JSX.Element {
  return (
    <header
      className={cn('z-10 w-full sticky top-0 pb-4 pt-6 backdrop-blur-2xl', className)}
      {...rest}
    >
      <div className="lg:px-24 mx-auto">
        <div className="w-full items-center justify-between font-mono text-sm flex">{children}</div>
      </div>
    </header>
  )
}
