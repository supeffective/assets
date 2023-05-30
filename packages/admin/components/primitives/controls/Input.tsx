import { HTMLProps } from 'react'

import { cn } from '@pkg/utils/lib/styling/classNames'

type InputProps =
  | ({
      multiline?: true
    } & HTMLProps<HTMLTextAreaElement>)
  | ({
      multiline?: false | undefined
    } & HTMLProps<HTMLInputElement>)

export function Input({ multiline, className, ...rest }: InputProps): JSX.Element {
  const classNames = cn(
    'rounded-md font-mono',
    'p-3 align-top flex w-full items-center text-sm font-medium',
    'transition-colors duration-200 leading-5 outline-none',
    'bg-black text-nxt-w3 border border-nxt-g2',
    'focus-visible:border-nxt-w1 focus-visible:text-white',
    'read-only:!text-nxt-g3 read-only:!bg-nxt-b3',
    'read-only:!border-nxt-g2 read-only:cursor-not-allowed',
    className
  )

  if (multiline) {
    const textAreaProps = rest as HTMLProps<HTMLTextAreaElement>

    return <textarea className={classNames} {...textAreaProps} />
  }
  const inputProps = rest as HTMLProps<HTMLInputElement>

  return <input className={classNames} {...inputProps} />
}
