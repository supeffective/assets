'use client'

import { useParams } from 'next/navigation'

import { BoxPresetSelector } from '@/components/pkm/views/BoxPresetSelector'

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const { gameset, preset } = params

  return (
    <div>
      <BoxPresetSelector selectedGameSetId={gameset} selectedPresetId={preset} />
      {children}
    </div>
  )
}
