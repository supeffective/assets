'use client'

import { useEffect } from 'react'

import { Button } from '@/components/primitives/controls/Button'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-2xl font-bold text-gray-400">Something went wrong!</div>
      <p>
        <span className="text-gray-400">Error:</span> {error.message} (see console for details)
      </p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  )
}
