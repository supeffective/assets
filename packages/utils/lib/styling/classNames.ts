import { twMerge } from 'tailwind-merge'

export type BoolLike = boolean | undefined | null
export type ClassNameLike = string | BoolLike

export function cn(
  ...classNames: (ClassNameLike | ClassNameLike[] | [BoolLike, ...ClassNameLike[]])[]
): string {
  return twMerge(
    classNames
      .flatMap(arg => {
        if (
          Array.isArray(arg) &&
          arg.length >= 2 &&
          (typeof arg[0] === 'boolean' || arg[0] === undefined || arg[0] === null)
        ) {
          const [condition, ...rest] = arg

          return condition ? rest : undefined
        }

        return arg
      })
      .filter(Boolean)
      .join(' ')
  )
}
