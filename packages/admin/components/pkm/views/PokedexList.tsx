import Link from 'next/link'

import type { Pokedex } from '@pkg/datalayer/schemas/pokedexes'

import { Grid } from '@/components/primitives/boxes/Grid'
import { Routes } from '@/lib/Routes'

export function PokedexList({ records }: { records: Array<Pokedex> }) {
  return (
    <Grid minColWidth="32ch">
      {records.map(record => {
        return (
          <div
            className={'flex gap-4 flex-col items-start p-4 rounded-lg bg-nxt-b3'}
            key={record.id}
          >
            <div className="flex-1">
              <div className="text-sm text-nxt-w1 font-mono uppercase">{record.region || ''}</div>
              <Link
                href={`${Routes.Pokedexes}/${record.id}`}
                className="text-lg font-bold text-nxt-w2 hover:text-nxt-acc3"
              >
                {record.name}
              </Link>
              <div className="text-sm text-nxt-teal4">{record.entries.length} entries</div>
              <div className="text-xs text-nxt-g3 font-mono uppercase">
                {record.id !== 'national' && record.gameSets.join(', ')}
              </div>
            </div>
          </div>
        )
      })}
    </Grid>
  )
}
