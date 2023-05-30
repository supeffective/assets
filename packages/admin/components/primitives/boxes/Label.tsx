import { HTMLProps } from 'react'

import { cn } from '@/../utils/lib/styling/classNames'

type LabelProps = {
  text: string
  children?: React.ReactNode
} & HTMLProps<HTMLLabelElement>

export function Label({ text, children, className, ...rest }: LabelProps) {
  return (
    <label className={cn('flex items-center space-x-2', className)} {...rest}>
      {children}
      <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {text}
      </span>
    </label>
  )
}
