import React, { HTMLProps } from 'react'

type FieldProps = { label: React.ReactNode } & HTMLProps<HTMLLabelElement>

export function Field({ className, label, children, ...rest }: FieldProps): JSX.Element {
  const classNames = ['flex flex-row items-start gap-4 first-child:mt-0 mt-6 w-full', className]
    .filter(Boolean)
    .join(' ')

  return (
    <label className={classNames} {...rest}>
      <span className="block font-normal max-w-[8rem] min-w-[8rem] flex-1 py-3 text-xs whitespace-pre text-neutral-300">
        {label}
      </span>
      <span className="flex-1 flex items-center gap-5">{children}</span>
    </label>
  )
}

type SplitViewProps = { label?: React.ReactNode } & HTMLProps<HTMLDivElement>

function SplitView({ className, label, children, ...rest }: SplitViewProps): JSX.Element {
  const classNames = ['flex flex-row items-start gap-4 w-full', className].filter(Boolean).join(' ')

  return (
    <div className="first-child:mt-0 mt-6">
      <div className={classNames} {...rest}>
        {label && (
          <span className="block font-normal max-w-[8rem] min-w-[8rem] flex-1 pt-9 text-xs whitespace-pre text-neutral-300">
            {label}
          </span>
        )}
        <div className="block flex-1">
          <div className="flex flex-col lg:flex-row w-full m-0 gap-4 pt-0">{children}</div>
        </div>
      </div>
    </div>
  )
}

Field.SplitView = SplitView

type SplitViewItemProps = { label?: React.ReactNode } & HTMLProps<HTMLDivElement>

function SplitViewItem({ className, label, children, ...rest }: SplitViewItemProps): JSX.Element {
  const classNames = ['flex-1', className].filter(Boolean).join(' ')

  return (
    <div className={classNames} {...rest}>
      <div className="text-xs block mb-2 text-neutral-500 uppercase">{label}</div>
      {children}
    </div>
  )
}

Field.SplitViewItem = SplitViewItem
