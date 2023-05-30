import React from 'react'

import '../../app/globals.css'

// Preview.js wrapper

export function Wrapper({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}): JSX.Element {
  return (
    <>
      <div className="wrapped bg-amber-500 w-full h-full">{children}</div>
    </>
  )
}
