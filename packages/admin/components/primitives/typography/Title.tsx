export function Title({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}): JSX.Element {
  return (
    <h1
      className={
        'my-4 mx-6 mb-8 font-extrabold text-4xl lg:text-5xl leading-tight xl:leading-snug text-center bg-clip-text text-transparent bg-gradient-to-b from-black/80 to-black dark:from-nxt-w4 dark:to-nxt-g4 ' +
        className
      }
    >
      {children}
    </h1>
  )
}
