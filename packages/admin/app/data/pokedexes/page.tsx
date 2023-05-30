import { getPokedexes as getRecords } from '@pkg/datalayer/repositories/pokedexes'

import { Flex } from '@/components/primitives/boxes/Flex'
import { Grid } from '@/components/primitives/boxes/Grid'
import { Title } from '@/components/primitives/typography/Title'

export default function Page() {
  const title = 'Pokedexes'
  const records = getRecords()

  return (
    <Flex vertical gap={6} className="max-w-5xl">
      <div>
        <Title>{title}</Title>
        <Grid minColWidth="32ch">
          {records.map(record => {
            return (
              <div
                className={'flex gap-4 flex-col items-start p-4 rounded-lg bg-nxt-b3'}
                key={record.id}
              >
                <div className="flex-1">
                  <div className="text-sm text-nxt-w1 font-mono uppercase">
                    {record.region || ''}
                  </div>
                  <div className="text-lg font-bold text-nxt-w2">{record.name}</div>
                  <div className="text-xs text-nxt-g3 font-mono uppercase">
                    {record.gameSets.join(' / ')}
                  </div>
                </div>
              </div>
            )
          })}
        </Grid>
      </div>
    </Flex>
  )
}
