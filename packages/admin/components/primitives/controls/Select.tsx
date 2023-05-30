import { HTMLProps } from 'react'

import { cn } from '@/../utils/lib/styling/classNames'

type OptionsList = Array<
  | {
      id: string
      name: string
    }
  | {
      value: string
      label: string
    }
  | string
>

type SelectProps =
  | ({
      children?: never
      nullable?: boolean
      options: OptionsList
      sorted?: boolean
    } & HTMLProps<HTMLSelectElement>)
  | ({
      children: Array<JSX.Element | null>
      options?: undefined
      nullable?: boolean
      sorted?: boolean
    } & HTMLProps<HTMLSelectElement>)

export const chevronIcon = (
  <svg
    fill="none"
    height="18"
    shapeRendering="geometricPrecision"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    width="18"
    className="text-current"
  >
    <path d="M6 9l6 6 6-6"></path>
  </svg>
)

function normalizeOptions(
  options: OptionsList,
  sorted?: boolean
): Array<{
  id: string
  name: string
}> {
  const normalized = options.map(option => {
    if (typeof option === 'string') {
      return { id: option, name: option }
    }
    if ('id' in option) {
      return option
    }

    return { id: option.value, name: option.label }
  })

  if (sorted) {
    normalized.sort((a, b) => a.name.localeCompare(b.name))
  }

  return normalized
}

export function Select({
  options,
  nullable,
  className,
  sorted,
  ...rest
}: SelectProps): JSX.Element {
  const wrapperClassName = cn(['rounded-md flex w-full items-center min-w-[10ch]', className])

  const selectClassName = cn(
    'appearance-none focus-visible:outline-0 cursor-pointer bg-transparent p-3',
    'rounded-md flex w-full items-center text-sm font-medium transition-colors duration-200',
    'bg-black text-nxt-w3 border border-neutral-700 focus-visible:border-neutral-400',
    'focus-visible:text-white'
  )

  const optionItems = options
    ? normalizeOptions(options, sorted).map(option => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))
    : rest.children ?? []

  if (nullable) {
    optionItems.unshift(
      <option key="-" value="">
        -
      </option>
    )
  }

  return (
    <div className={wrapperClassName + '  font-mono group'}>
      <select className={selectClassName} {...rest}>
        {optionItems}
      </select>
      <span className="absolute align-top z-10 right-3 pointer-events-none transition-colors duration-200 text-neutral-700 group-hover:text-neutral-400">
        {chevronIcon}
      </span>
    </div>
  )
}
