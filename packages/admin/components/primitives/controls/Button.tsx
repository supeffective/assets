import { HTMLProps } from 'react'
import Link, { LinkProps } from 'next/link'

import { cn } from '@pkg/utils/lib/styling/classNames'

type HTMLButtonProps = HTMLProps<HTMLButtonElement> & {
  type?: 'button' | 'submit' | 'reset' | undefined
}

type ButtonProps = (HTMLButtonProps | HTMLProps<HTMLAnchorElement>) & {
  asSpan?: boolean
}

export function Button({ href, asSpan, className, ...rest }: ButtonProps): JSX.Element {
  const classNames = cn(
    'rounded-md px-6 py-3 inline-flex items-center',
    'text-center justify-center text-sm font-medium transition-colors duration-200',
    'leading-5 bg-white text-black border border-black hover:bg-black',
    'hover:text-white hover:border-white',
    className
  )

  if (href && !href.startsWith('http')) {
    const linkProps = rest as LinkProps

    return (
      <Link className={classNames} {...linkProps} href={href}>
        {rest.children}
      </Link>
    )
  }

  if (href) {
    const aProps = rest as HTMLProps<HTMLAnchorElement>

    return (
      <a
        className={classNames}
        tabIndex={0}
        {...aProps}
        href={href}
        target="_blank"
        rel="norefer nofollow"
      >
        {rest.children}
      </a>
    )
  }

  if (asSpan) {
    return (
      <span className={classNames} {...rest} tabIndex={0}>
        {rest.children}
      </span>
    )
  }

  const buttonProps = rest as HTMLButtonProps

  return (
    <button className={classNames} tabIndex={0} {...buttonProps}>
      {rest.children}
    </button>
  )
}
