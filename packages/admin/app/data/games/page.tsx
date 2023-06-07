import Link from 'next/link'

import { getGameSets as getRecords } from '@pkg/datalayer/repositories/gamesets'

import { GameIconImgFile as RecordImgFile } from '@/components/pkm/GameIconImgFile'
import { Flex } from '@/components/primitives/boxes/Flex'
import { Grid } from '@/components/primitives/boxes/Grid'
import { Title } from '@/components/primitives/typography/Title'
import { Routes } from '@/lib/Routes'

export default function Page() {
  const title = 'Games'
  const records = getRecords()

  return (
    <Flex vertical gap={6} className="max-w-5xl">
      <div>
        <Title>{title}</Title>
        <Grid minColWidth="32ch">
          {records.map(record => {
            const bgClass = 'bg-nxt-b4/90'
            const gameIds = Object.keys(record.games)

            return (
              <div
                className={'flex gap-4 flex-col items-start p-4 rounded-lg ' + bgClass}
                key={record.id}
              >
                <Flex className="justify-start content-start group">
                  <RecordImgFile id={record.id} style={{ zIndex: gameIds.length + 1 }} />
                  {gameIds
                    .filter(gameId => gameId !== record.id)
                    .map((gameId, idx) => {
                      return (
                        <RecordImgFile
                          key={`${record.id}-${gameId}`}
                          id={gameId}
                          className="-ml-12 hover:-ml-4 transition-all duration-300 ease-in-out group-hover:-ml-4"
                          style={{ zIndex: gameIds.length - idx }}
                        />
                      )
                    })}
                </Flex>
                <div className="flex-1">
                  <div className="text-sm text-nxt-w1 font-mono uppercase">{record.superset}</div>
                  <Link
                    href={Routes.Games + `/${record.id}`}
                    className="block text-lg font-bold text-nxt-w2 cursor-pointer"
                  >
                    {record.name}
                  </Link>
                </div>
              </div>
            )
          })}
        </Grid>
      </div>
    </Flex>
  )
}
