'use client'

import React, { HTMLProps, ReactNode, useEffect, useState } from 'react'

import { cn } from '@pkg/utils/lib/styling/classNames'

import { Box } from '@/components/primitives/boxes/Box'

type TabProps = {
  children: ReactNode
  label: ReactNode
} & Omit<HTMLProps<HTMLButtonElement>, 'label'>

function Tab({ children }: TabProps) {
  return <>{children}</>
}

type TabFC = React.ReactElement<TabProps>

type TabsProps = {
  children: TabFC | TabFC[]
} & HTMLProps<HTMLDivElement>

function Tabs({ id, className, children, ...rest }: TabsProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<number>(0)
  const childrenArr = React.Children.toArray(children) as TabFC[]
  const baseClass = cn(
    'flex-1 py-4 px-4 xl:px-6 whitespace-pre max-w-[1fr]',
    'cursor-default text-sm border-0 h-full',
    'transition-colors duration-200 ease-in-out text-left lg:text-center',
    ''
  )

  const activeTabClass = cn('text-white lg:shadow-b-current-color-1', 'bg-nxt-b3 lg:bg-transparent')
  useEffect(() => {
    if (!id) {
      return
    }
    const hash = window.location.hash
    const hashIndex = childrenArr.findIndex((_, idx) => `#${id}--${idx}` === hash)

    if (hashIndex !== -1) {
      setActiveTab(hashIndex)
    }
  }, [id])

  function handleSetActiveTab(index: number) {
    setActiveTab(index)
    if (!id) {
      return
    }
    window.location.hash = `#${id}--${index}`
  }

  return (
    <Box id={id} className={cn(className, ' overflow-auto gap-0')} {...rest}>
      <div className="px-[1px] border-b-nxt-g1 border-0 border-b flex shrink-0 flex-col lg:flex-row">
        {childrenArr.map((child, index) => {
          const { label, ...childProps } = child.props

          return (
            <button
              key={index}
              {...childProps}
              type="button"
              className={baseClass + ' ' + (index === activeTab ? activeTabClass : ' text-nxt-w1')}
              onClick={() => handleSetActiveTab(index)}
            >
              {label}
            </button>
          )
        })}
      </div>
      {childrenArr.map((child, index) => {
        return (
          <div
            key={index}
            className={'flex-1 flex flex-col gap-4 ' + (index === activeTab ? 'flex' : 'hidden')}
          >
            {child}
          </div>
        )
      })}
    </Box>
  )
}

export { Tabs, Tab }
