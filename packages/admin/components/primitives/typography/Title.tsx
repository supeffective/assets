import { cn } from '@/../utils/lib/styling/classNames'

export function Title({
  level = 1,
  size = '4xl',
  children,
  className = '',
}: {
  level?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  size?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | '8xl'
    | '9xl'
  children: React.ReactNode
  className?: string
}): JSX.Element {
  const _level = level ?? 0
  const Tag = (_level > 0 ? `h${_level}` : 'span') as keyof JSX.IntrinsicElements
  const lgSize =
    size === 'xs'
      ? 'sm'
      : size === 'sm'
      ? 'md'
      : size === 'md'
      ? 'lg'
      : size === 'xl'
      ? '2xl'
      : size === '9xl'
      ? '9xl'
      : size.slice(0, -2) + Number(size.slice(-2)) + 1 + 'xl'

  return (
    <Tag
      className={cn(
        'my-4 mx-6 mb-8 font-extrabold leading-tight xl:leading-snug text-center',
        'bg-clip-text text-transparent',
        'bg-gradient-to-b from-black/80 to-black dark:from-nxt-w4 dark:to-nxt-g4',
        `text-${size}`,
        `lg:text-${lgSize}`,
        className,
      )}
    >
      {children}
    </Tag>
  )
}
